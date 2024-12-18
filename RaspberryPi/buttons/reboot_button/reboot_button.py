import RPi.GPIO as GPIO
import time
import os
import subprocess

# Configuration des pins
BUTTON_PIN = 4  # GPIO4
GPIO.setmode(GPIO.BCM)  # Numérotation BCM
GPIO.setup(BUTTON_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)  # Bouton avec pull-up interne

# Fonction pour arrêter la musique jouée avec mpg123 ou aplay
def stop_music():
    # Vérifie si un processus mpg123 est en cours d'exécution
    result_mpg123 = subprocess.run(["pgrep", "-f", "mpg123"], stdout=subprocess.PIPE)
    if result_mpg123.stdout:  # Si un processus mpg123 est trouvé
        print("Stopping mpg123 music...")
        os.system("pkill -f mpg123")
        return

    # Vérifie si un processus aplay est en cours d'exécution
    result_aplay = subprocess.run(["pgrep", "-f", "aplay"], stdout=subprocess.PIPE)
    if result_aplay.stdout:  # Si un processus aplay est trouvé
        print("Stopping aplay music...")
        os.system("pkill -f aplay")
        return

    print("No music is currently playing.")

# Fonction pour redémarrer le Raspberry Pi
def reboot():
    print("Rebooting the Raspberry Pi...")
    os.system("sudo reboot")

# Boucle principale pour surveiller le bouton
try:
    while True:
        button_state = GPIO.input(BUTTON_PIN)

        if button_state == GPIO.LOW:  # Le bouton est appuyé
            print("Button pressed...")
            start_time = time.time()

            # Surveille l'état du bouton pendant qu'il est appuyé
            while GPIO.input(BUTTON_PIN) == GPIO.LOW:
                duration = time.time() - start_time
                if duration >= 3:  # Appui long (3 secondes ou plus)
                    reboot()  # Redémarrage immédiat
                time.sleep(0.1)

            # Si l'appui est court (moins de 3 secondes), arrêter la musique
            duration = time.time() - start_time
            if duration < 3:
                stop_music()

        time.sleep(0.1)  # Délai pour éviter les rebonds

except KeyboardInterrupt:
    print("Exiting...")
finally:
    GPIO.cleanup()  # Nettoyer les ressources GPIO