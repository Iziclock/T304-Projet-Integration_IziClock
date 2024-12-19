import requests
import sqlite3
import logging
from logging.handlers import RotatingFileHandler
from datetime import datetime, timedelta
import traceback
import subprocess
import os
import re
from geoapify import get_route_time

# Configuration du logger
handler = RotatingFileHandler('update_data.log', maxBytes=5*1024*1024, backupCount=3)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s', handlers=[handler])

API_URL = "https://www.iziclock.be/raspberry"
DB_NAME = "/home/iziclockAdmin/update/database/iziclock.db"
AUDIO_DIR = "/home/iziclockAdmin/audio"
DEFAULT_RINGTONE_ID = 1
GEOAPIFY_KEY = "6431d6a538b141789352dd18e45e2320"

def time_final(ring_date, start_address, end_address, transport_mode, preparation_time_minutes) :
    new_alarm_datetime = None
    route_time_seconds = get_route_time(GEOAPIFY_KEY, start_address, end_address, transport_mode)
    preparation_time_seconds = preparation_time_minutes * 60
    alarm_datetime = datetime.strptime(ring_date, "%Y-%m-%dT%H:%M:%SZ")

    if route_time_seconds is None:
        new_alarm_datetime = alarm_datetime - timedelta(seconds=preparation_time_seconds)
    else:
        new_alarm_datetime = alarm_datetime - timedelta(seconds=route_time_seconds + preparation_time_seconds)

    new_alarm_datetime_str = new_alarm_datetime.strftime('%Y-%m-%dT%H:%M:%SZ')

    print(f"Nouvelle heure pour l'alarme : {new_alarm_datetime_str}")
    
    return new_alarm_datetime_str


def log_error(message):
    logging.error(message)

def log_info(message):
    logging.info(message)

def download_audio_file(url, filename):
    """
    Télécharge un fichier audio depuis l'URL spécifiée et le stocke dans le répertoire AUDIO_DIR.
    Retourne True si le téléchargement réussit, False sinon.
    """
    try:
        filepath = os.path.join(AUDIO_DIR, filename)
        if not os.path.exists(AUDIO_DIR):
            os.makedirs(AUDIO_DIR)
        result = subprocess.run(
            ["wget", "-q", "-O", filepath, url],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        if result.returncode == 0:
            log_info(f"Fichier téléchargé avec succès : {filepath}")
            return True
        else:
            log_error(f"Échec du téléchargement : {url}")
            return False
    except Exception as e:
        log_error(f"Erreur lors du téléchargement du fichier audio depuis {url} : {traceback.format_exc()}")
        return False
    
def name_audio(ringtone_url):
    match = re.search(r'https://www\.iziclock\.be/audio/(.+)', ringtone_url)
    if match:
        filename = match.group(1).split('?')[0]
        return filename
    return None

def fetch_data():
    try:
        response = requests.get(API_URL, timeout=10)
        response.raise_for_status()
        data = response.json()
        return data.get("alarms", []) if isinstance(data, dict) else (data if isinstance(data, list) else [])
    except Exception as e:
        log_error(f"Erreur lors de la récupération des données : {traceback.format_exc()}")
        return []

def update_database(data):
    if not data:
        log_info("Aucune donnée à insérer.")
        return

    try:
        with sqlite3.connect(DB_NAME , timeout=10) as conn:

            cursor = conn.cursor()

            threshold_date = datetime.now() - timedelta(days=1)
            cursor.execute("DELETE FROM Alarm WHERE RingDate < ?", (threshold_date.strftime('%Y-%m-%d %H:%M:%S'),))
            log_info(f"Suppression des alarmes avant le {threshold_date}")

            for alarm in data:
                print(alarm)
                if not all(key in alarm for key in ["ID", "Name", "RingDate", "IsActive","PreparationTime" , "LocationStart", "LocationEnd" ,"RingtoneID", "Ringtone", "Transport"]):
                    log_error(f"Données manquantes dans l'alarme : {alarm}")
                    print('test 54')
                    continue
                print('test2')
                ringtone = alarm["Ringtone"]
                if not all(key in ringtone for key in ["ID", "Name", "Url"]):
                    log_error(f"Données manquantes dans la sonnerie : {ringtone}")
                    print('test 45 ')
                    continue
                print('test3')
                cursor.execute("SELECT ID FROM Ringtones WHERE ID = ?", (ringtone["ID"],))
                if not cursor.fetchone():
                    print("n'existe pas")
                    if not download_audio_file(ringtone["Url"], f"{name_audio(ringtone['Url'])}"):
                        print("pas téléchargeable")
                        log_error(f"Le téléchargement a échoué pour {ringtone['Url']}. Utilisation de la sonnerie par défaut.")
                        ringtone["ID"] = DEFAULT_RINGTONE_ID

                    if ringtone["ID"] != DEFAULT_RINGTONE_ID:
                        print("bon téléchargement")
                        cursor.execute(
                            "INSERT INTO Ringtones (ID, Name, Url, IsDownloaded) VALUES (?, ?, ?, ?)",
                            (ringtone["ID"], ringtone["Name"], ringtone["Url"], True)
                        )
                print('test4')

                cursor.execute("SELECT ID FROM Alarm WHERE ID = ?", (alarm["ID"],))
                if cursor.fetchone():
                    print('update')
                    cursor.execute(
                        "UPDATE Alarm SET Name = ?, RingDate = ?, IsActive = ?, RingtoneID = ?  ,PreparationTime = ? , LocationStart = ? , LocationEnd = ? WHERE ID = ?",
                        (alarm["Name"], time_final(alarm["RingDate"], alarm["LocationStart"], alarm["LocationEnd"], alarm["Transport"], alarm["PreparationTime"]), alarm["IsActive"], ringtone["ID"] ,alarm["PreparationTime"], alarm["LocationStart"], alarm["LocationEnd"],alarm["ID"])
                    )
                else:
                    cursor.execute(
                        "INSERT INTO Alarm (ID, Name, RingDate, IsActive, PreparationTime , LocationStart, LocationEnd, RingtoneID  ) VALUES (?, ?, ?, ?, ? , ? , ? , ?)",
                        (alarm["ID"], alarm["Name"], time_final(alarm["RingDate"], alarm["LocationStart"], alarm["LocationEnd"], alarm["Transport"], alarm["PreparationTime"]), alarm["IsActive"] , alarm["PreparationTime"], alarm["LocationStart"], alarm["LocationEnd"] , ringtone["ID"])
                    )
                    print('test fin')
                print('fini')



            conn.commit()
            log_info("Mise à jour réussie des données.")
    except sqlite3.DatabaseError as e:
        log_error(f"Erreur SQLite : {e}")

def main():
    data = fetch_data()
    if not data:
        log_info("Aucune donnée récupérée.")
    else:
        update_database(data)

if __name__ == "__main__":
    main()