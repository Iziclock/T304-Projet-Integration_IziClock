import sqlite3
import os
from datetime import datetime, timedelta, timezone
import re
import subprocess


def format_temps_restant(temps_en_secondes):
    delta = timedelta(seconds=temps_en_secondes)
    jours, secondes = delta.days, delta.seconds
    heures = secondes // 3600
    minutes = (secondes % 3600) // 60
    secondes = secondes % 60
    result = []
    if jours > 0:
        result.append(f"{jours} jour(s)")
    if heures > 0:
        result.append(f"{heures} heure(s)")
    if minutes > 0:
        result.append(f"{minutes} minute(s)")
    if secondes > 0 or len(result) == 0:
        result.append(f"{secondes} seconde(s)")
    return ", ".join(result)


def jouer_audio(chemin):
    if chemin.endswith('.mp3'):
        print(f"Lecture de l'audio MP3 avec mpg123 : {chemin}")
        subprocess.run(['mpg123', chemin])
    elif chemin.endswith('.wav'):
        print(f"Lecture de l'audio WAV avec aplay : {chemin}")
        subprocess.run(['aplay', chemin])
    else:
        print("Format audio non supporté")



def prochaine_alarme(cursor):
    maintenant_iso = datetime.now(timezone.utc).isoformat(timespec='milliseconds').replace('+00:00', 'Z')

    cursor.execute("""
       SELECT Alarm.ID, Alarm.Name, Alarm.RingDate, Ringtones.Url
       FROM Alarm
       JOIN Ringtones ON Alarm.RingtoneID = Ringtones.ID
       WHERE Alarm.IsActive = 1
       AND Alarm.RingDate > ?
       ORDER BY Alarm.RingDate ASC
       LIMIT 1;
    """, (maintenant_iso,))
    result = cursor.fetchone()
    print(f"Debug: Result from prochaine_alarme = {result}")
    return result

def update_active_alarme(cursor , id):
    cursor.execute("""
        UPDATE Alarm
        SET IsActive = FALSE
        WHERE ID = ?
    """, (id,))
    print(id)

    return cursor.rowcount

def name_audio(ringtone_url):
    match = re.search(r'https://www\.iziclock\.be/audio/(.+)', ringtone_url)
    if match:
        filename = match.group(1).split('?')[0]
        return filename
    return None

def main():
    conn = sqlite3.connect('/home/iziclockAdmin/update/database/iziclock.db')
    cursor = conn.cursor()
    try:
        alarme = prochaine_alarme(cursor)

        if alarme:
            alarme_id, nom_alarme, date_heure_alarme, chemin_audio = alarme
            print(f"Prochaine alarme ID: {alarme_id}, '{nom_alarme}', prévue pour : {date_heure_alarme}")
            date_heure_alarme_dt = datetime.strptime(date_heure_alarme, '%Y-%m-%dT%H:%M:%SZ')
            maintenant = datetime.now()
            temps_a_attendre = (date_heure_alarme_dt - maintenant).total_seconds()
            if date_heure_alarme_dt < maintenant :
                if os.path.exists(f"/home/iziclockAdmin/audio/{name_audio(chemin_audio)}"):
                    update_active_alarme(cursor, alarme_id)
                    conn.commit()
                    jouer_audio(f"/home/iziclockAdmin/audio/{name_audio(chemin_audio)}")
                else:
                    print(f"Fichier audio non trouvé : {name_audio(chemin_audio)}")
            else:
                print(f"Aucune alarme imminente. Temps restant : {format_temps_restant(temps_a_attendre)}")
        else:
            print("Aucune alarme à venir.")
    finally:
        conn.close()


if __name__ == '__main__':
    main()