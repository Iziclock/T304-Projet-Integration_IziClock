import requests
import sqlite3
import logging
from logging.handlers import RotatingFileHandler
from datetime import datetime, timedelta
import traceback

# Configuration du logger
handler = RotatingFileHandler('update_data.log', maxBytes=5*1024*1024, backupCount=3)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s', handlers=[handler])

API_URL = "https:www.iziclock.be/raspberry"
DB_NAME = "/home/iziclockAdmin/update/database/iziclock.db"

def log_error(message):
    logging.error(message)

def log_info(message):
    logging.info(message)

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
        with sqlite3.connect(DB_NAME) as conn:
            cursor = conn.cursor()

            threshold_date = datetime.now() - timedelta(days=1)
            cursor.execute("DELETE FROM Alarm WHERE RingDate < ?", (threshold_date.strftime('%Y-%m-%d %H:%M:%S'),))
            log_info(f"Suppression des alarmes avant le {threshold_date}")
            
            for alarm in data:
                if not all(key in alarm for key in ["ID", "Name", "RingDate", "IsActive", "RingtoneID", "Ringtone"]):
                    log_error(f"Données manquantes dans l'alarme : {alarm}")
                    continue
                
                ringtone = alarm["Ringtone"]
                if not all(key in ringtone for key in ["ID", "Name", "Url"]):
                    log_error(f"Données manquantes dans la sonnerie : {ringtone}")
                    continue
                
                cursor.execute("SELECT ID FROM Alarm WHERE ID = ?", (alarm["ID"],))
                if cursor.fetchone():
                    cursor.execute(
                        "UPDATE Alarm SET Name = ?, RingDate = ?, IsActive = ?, RingtoneID = ? WHERE ID = ?",
                        (alarm["Name"], alarm["RingDate"], alarm["IsActive"], alarm["RingtoneID"], alarm["ID"])
                    )

                else:
                    cursor.execute(
                        "INSERT INTO Alarm (ID, Name, RingDate, IsActive, RingtoneID) VALUES (?, ?, ?, ?, ?)",
                        (alarm["ID"], alarm["Name"], alarm["RingDate"], alarm["IsActive"], alarm["RingtoneID"])
                    )
                    

                cursor.execute("SELECT ID FROM Ringtones WHERE ID = ?", (ringtone["ID"],))
                if not cursor.fetchone():
                    cursor.execute(
                        "INSERT INTO Ringtones (ID, Name, Url) VALUES (?, ?, ?)",
                        (ringtone["ID"], ringtone["Name"], ringtone["Url"])
                    )
                    

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
