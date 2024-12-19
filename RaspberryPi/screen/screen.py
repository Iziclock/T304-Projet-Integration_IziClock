import subprocess
import spidev
import RPi.GPIO as GPIO
import time
import re
from PIL import Image, ImageDraw, ImageFont
from datetime import datetime
from ssd1305 import SSD1305
import sqlite3

# Configuration des broches SPI et GPIO
BUTTON_BT_PIN = 17
BUTTON_PLUS_PIN = 20
BUTTON_MINUS_PIN = 16
BUTTON_SNOOZE_PIN = 4

# Définir le mode GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setup(BUTTON_BT_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(BUTTON_PLUS_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(BUTTON_MINUS_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(BUTTON_SNOOZE_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setwarnings(False)

# Données pour les logos
data_bluetooth = [
    "0011000", "0010100", "0010010", "1010010", "0110100",
    "0011000", "0010100", "0110010", "1010010", "0010100", "0011000",
]
data_wifi = [
    "0000001000", "0000100100", "0010010100", "1001010100", "0101010100",
    "0101010100", "0101010100", "1001010100", "0010010100", "0000100100", "0000001000",
]

DB_NAME = "/home/iziclockAdmin/update/database/iziclock.db"


def draw_static_logo(draw, data, offset_x=0):
    """Dessine les logos statiques avec un décalage horizontal."""
    for y, row in enumerate(data):
        for x, pixel in enumerate(row):
            if pixel == "1":
                draw.point((x + offset_x, y), fill=255)

def toggle_advertising_bt_service(bt_status):
    """Active et désactive le service de recherche BLE"""
    try:
        if bt_status:
            subprocess.run(["sudo", "systemctl", "start", "advertising"], check=True)
        else:
            subprocess.run(["sudo", "systemctl", "stop", "advertising"], check=True)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Erreur lors de la gestion du service advertising : {e}")
        return False

def check_wifi_status():
    """Vérifie si le WiFi est activé et connecté."""
    try:
        output = subprocess.check_output("iwgetid", shell=True).decode("utf-8")
        return "ESSID" in output
    except subprocess.CalledProcessError:
        return False

def changer_volume(action, step=1):
    """Modifie le volume du son en augmentant ou en diminuant."""
    try:
        if action == "up":
            subprocess.run(f"amixer set PCM {step}+", shell=True, check=True)
        elif action == "down":
            subprocess.run(f"amixer set PCM {step}-", shell=True, check=True)
        else:
            raise ValueError("Action invalide")

        # Récupérer le volume actuel
        output = subprocess.check_output("amixer get PCM", shell=True, text=True)
        for line in output.splitlines():
            if "Playback" in line and "%" in line:
                volume = line.split("[")[1].split("]")[0]  # Extraire le pourcentage
                return f"Volume : {volume}"

    except subprocess.CalledProcessError as e:
        print(f"Erreur lors de la modification du volume : {e}")
        return "Erreur"
    except ValueError as e:
        print(e)
        return "Erreur"


def fetch_next_alarm():
    try:
        with sqlite3.connect(DB_NAME) as conn:
            cursor = conn.cursor()

            # Exécuter la requête SQL pour récupérer la prochaine alarme
            cursor.execute("""
                SELECT Name, LocationEnd
                FROM Alarm
                WHERE IsActive = TRUE AND RingDate >= datetime('now')
                ORDER BY RingDate ASC
                LIMIT 1;
            """)

            next_alarm = cursor.fetchone()

            if next_alarm:
                # Retourner le nom et la location de l'alarme
                return next_alarm[0], next_alarm[1]
            else:
                # Retourner None si aucune alarme n'est trouvée
                return None, None
    except sqlite3.DatabaseError as e:
        print(f"Erreur SQLite : {e}")
        return None, None

def is_audio_active():
    """Vérifie si un son est en cours de lecture (aplay ou mpg123)."""
    try:
        subprocess.check_output("pgrep -x aplay || pgrep -x mpg123", shell=True)
        return True
    except subprocess.CalledProcessError:
        return False

def stop_service(service_name):
    """Arrête un service systemd."""
    try:
        subprocess.run(["sudo", "systemctl", "stop", service_name], check=True)
        return True
    except subprocess.CalledProcessError as e:
        return False

def start_service(service_name):
    """Démarre un service systemd"""
    try:
        subprocess.run(["sudo", "systemctl", "stop", service_name], check=True)
        return True
    except subprocess.CalledProcessError as e:
        return False

def view_1(oled, font_small, font_large, wifi_connected, bluetooth_active):
    """Affiche la vue principale : Date, Heure, WiFi et Bluetooth."""
    image = Image.new("1", (oled.width, oled.height), "black")
    draw = ImageDraw.Draw(image)

    now = datetime.now()
    current_date = now.strftime("  %d / %m / %Y")
    current_time = now.strftime("  %H : %M")

    # Afficher le logo WiFi si connecté
    if wifi_connected:
        draw_static_logo(draw, data_wifi, 120)

    # Afficher le logo Bluetooth si activé
    if bluetooth_active:
        draw_static_logo(draw, data_bluetooth, 4)

    # Afficher la date et l'heure
    bbox = draw.textbbox((0, 0), current_date, font=font_small)
    draw.text(((oled.width - (bbox[2] - bbox[0])) // 2, 2), current_date, font=font_small, fill=255)
    bbox = draw.textbbox((0, 0), current_time, font=font_large)
    draw.text(((oled.width - (bbox[2] - bbox[0])) // 2, 16), current_time, font=font_large, fill=255)

    oled.getbuffer(image)
    oled.display()


def view_2(oled, font_small, font_large, wifi_connected, bluetooth_active, action):
    """Affiche la vue de contrôle du volume : Heure et volume audio."""
    volume = changer_volume(action, 5)
    image = Image.new("1", (oled.width, oled.height), "black")
    draw = ImageDraw.Draw(image)

    now = datetime.now()
    current_time = now.strftime("%H:%M")
    volume_str = f"{volume}"

    # Afficher le logo WiFi si connecté
    if wifi_connected:
        draw_static_logo(draw, data_wifi, 120)

    # Afficher le logo Bluetooth si activé
    if bluetooth_active:
        draw_static_logo(draw, data_bluetooth, 4)

    # Afficher l'heure (en haut) et le volume (en bas)
    bbox = draw.textbbox((0, 0), current_time, font=font_small)
    draw.text(((oled.width - (bbox[2] - bbox[0])) // 2, 2), current_time, font=font_small, fill=255)
    bbox = draw.textbbox((0, 0), volume_str, font=font_large)
    draw.text(((oled.width - (bbox[2] - bbox[0])) // 2, 16), volume_str, font=font_large, fill=255)

    oled.getbuffer(image)
    oled.display()


def view_3(oled, font_small, wifi_connected, bluetooth_active, alarm_name, alarm_location, scroll_offset):
    """Affiche une vue avec une partie statique (y=0 à y=12) et un texte défilant (y=13 à y=32)."""
    image = Image.new("1", (oled.width, oled.height), "black")
    draw = ImageDraw.Draw(image)
    alarm_text =  f"Alarme : {alarm_name} Adresse : {alarm_location}"
    # PARTIE STATIQUE (Y = 0 à Y = 12)
    now = datetime.now()
    current_time = now.strftime("  %H : %M")

    # Afficher le logo WiFi si connecté
    if wifi_connected:
        draw_static_logo(draw, data_wifi, 120)

    # Afficher le logo Bluetooth si activé
    if bluetooth_active:
        draw_static_logo(draw, data_bluetooth, 4)

    # Afficher l'heure (centrée en haut)
    bbox = draw.textbbox((0, 0), current_time, font=font_small)
    draw.text(((oled.width - (bbox[2] - bbox[0])) // 2, 2), current_time, font=font_small)

    # PARTIE DYNAMIQUE (TEXTE DÉFILANT, Y = 13 à Y = 32)
    text_width = font_small.getbbox(alarm_text)[2] if hasattr(font_small, 'getbbox') else font_small.getsize(alarm_text)[0]
    x_position = oled.width - scroll_offset

    # Dessiner le texte défilant
    draw.rectangle((0, 13, oled.width, 32), fill=0)  # Efface la zone dynamique
    draw.text((x_position, 13), alarm_text, font=font_small, fill=255)

    # Afficher l'image sur l'écran
    oled.getbuffer(image)
    oled.display()

    # Retourner la largeur du texte pour la gestion du défilement
    return text_width

if __name__ == "__main__":
    try:
        oled = SSD1305()
        oled.clear()
        font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 10)
        font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 12)

        bluetooth_status = True
        wifi_status = check_wifi_status()
        current_view = "view_1"
        scroll_offset = 0  # Offset initial pour le texte défilant
        has_alarm = False
        alarm_name = ""
        alarm_location = ""
        while True:
            if GPIO.input(BUTTON_BT_PIN) == GPIO.LOW:
               if bluetooth_status:
                  stop_service("advertising.service")
                  bluetooth_status = False
                  time.sleep(0.1)
               else:
                  start_service("advertising.service")
                  bluetooth_status = True
                  time.sleep(0.1)
            # Vue 3 : Gérer l'affichage du texte défilant si un audio est actif
            if is_audio_active():
                if not has_alarm:
                   alarm_name, alarme_location = fetch_next_alarm()
                   has_alarm = True
                current_view = "view_3"
                wifi_status = check_wifi_status()
                text_width = view_3(oled, font_small, wifi_status, bluetooth_status, alarm_name, alarm_location, scroll_offset)
                scroll_offset += 4  # Déplace le texte vers la gauche

                # Réinitialiser le défilement une fois que le texte a entièrement disparu
                if scroll_offset > text_width + oled.width:
                    scroll_offset = 0

                # Si le bouton Snooze est appuyé, revenir à la vue 1
                if GPIO.input(BUTTON_SNOOZE_PIN) == GPIO.LOW:
                    oled.clear()
                    current_view = "view_1"
                    has_alarm = False
                    alarm_name = ""
                    alarm_location = ""
                if not is_audio_active():
                    oled.clear()
                    current_view = "view_1"
                    has_alarm = False
        
                    alarm_name = ""
                    alarm_location = ""
            # Vue 2 : Affichage temporaire du volume si les boutons + ou - sont appuyés
            elif GPIO.input(BUTTON_PLUS_PIN) == GPIO.LOW:
                wifi_status = check_wifi_status()
                action = "up"
                view_2(oled, font_small, font_large, wifi_status, bluetooth_status, action)
                time.sleep(1)

            elif GPIO.input(BUTTON_MINUS_PIN) == GPIO.LOW:
                wifi_status = check_wifi_status()
                action = "down"
                view_2(oled, font_small, font_large, wifi_status, bluetooth_status, action)
                time.sleep(1)

            # Vue 1 : Par défaut
            elif current_view == "view_1":
                wifi_status = check_wifi_status()
                view_1(oled, font_small, font_large, wifi_status, bluetooth_status)
                time.sleep(0.1)  # Pause pour limiter la charge CPU

    finally:
        oled.full_reset()
        pin_clean_up = [BUTTON_BT_PIN, BUTTON_PLUS_PIN, BUTTON_MINUS_PIN, BUTTON_SNOOZE_PIN]
        GPIO.cleanup(pin_clean_up)