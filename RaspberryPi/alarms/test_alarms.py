import unittest
from unittest.mock import patch
from datetime import datetime, timedelta , timezone
import os
import sqlite3
from alarm import name_audio, jouer_audio, format_temps_restant, prochaine_alarme

class TestAlarmFunctions(unittest.TestCase):
    def test_format_temps_restant(self):
        self.assertEqual(format_temps_restant(3661), "1 heure(s), 1 minute(s), 1 seconde(s)")
        self.assertEqual(format_temps_restant(86400), "1 jour(s)")
        self.assertEqual(format_temps_restant(65), "1 minute(s), 5 seconde(s)")
        self.assertEqual(format_temps_restant(0), "0 seconde(s)")
        self.assertEqual(format_temps_restant(61), "1 minute(s), 1 seconde(s)")

    def test_prochaine_alarme(self):
        conn = sqlite3.connect(':memory:')
        cursor = conn.cursor()

        cursor.execute('PRAGMA foreign_keys = ON;')

        cursor.execute('''
        CREATE TABLE Ringtones (
            ID INTEGER PRIMARY KEY,
            Name TEXT NOT NULL,
            Url TEXT NOT NULL,
            IsDownloaded BOOLEAN NOT NULL DEFAULT FALSE
        );
        ''')
        cursor.execute('''
        CREATE TABLE Alarm (
            ID INTEGER PRIMARY KEY,
            RingtoneID INTEGER DEFAULT 1,
            Name TEXT NOT NULL,
            RingDate DATETIME NOT NULL,
            IsActive BOOLEAN NOT NULL DEFAULT TRUE,
            FOREIGN KEY (RingtoneID) REFERENCES Ringtones(ID) ON DELETE CASCADE
        );
        ''')

        now = datetime.now(timezone.utc)
        future_time = (now + timedelta(minutes=10)).isoformat(timespec='milliseconds').replace('+00:00', 'Z')
        cursor.execute("INSERT INTO Ringtones (ID, Name, Url, IsDownloaded) VALUES (1, 'Test Ringtone', '/path/to/ringtone.mp3', 1)")
        cursor.execute("INSERT INTO Alarm (ID, RingtoneID, Name, RingDate, IsActive) VALUES (1, 1, 'Test Alarme', ?, 1)", (future_time,))

        alarme = prochaine_alarme(cursor)
        print(f"Debug: Alarme retournée = {alarme}")
        self.assertIsNotNone(alarme)
        self.assertEqual(alarme[1], 'Test Alarme')
        self.assertEqual(alarme[2], future_time)

        cursor.execute("UPDATE Alarm SET IsActive = 0 WHERE ID = 1")
        alarme = prochaine_alarme(cursor)
        self.assertIsNone(alarme)

        conn.close()

    def test_valid_url_mp3(self):
        ringtone_url = "https://www.iziclock.be/audio/sample.mp3"
        result = name_audio(ringtone_url)
        self.assertEqual(result, "sample.mp3")

    def test_valid_url_wav(self):
        ringtone_url = "https://www.iziclock.be/audio/sample.wav"
        result = name_audio(ringtone_url)
        self.assertEqual(result, "sample.wav")

    def test_invalid_url_no_match(self):
        ringtone_url = "https://www.iziclock.be/not_audio/sample.mp3"
        result = name_audio(ringtone_url)
        self.assertIsNone(result)

    def test_no_audio_path(self):
        ringtone_url = "https://www.iziclock.be/"
        result = name_audio(ringtone_url)
        self.assertIsNone(result)

    def test_empty_url(self):
        ringtone_url = ""
        result = name_audio(ringtone_url)
        self.assertIsNone(result)

    def test_non_https_url(self):
        ringtone_url = "http://www.iziclock.be/audio/sample.mp3"
        result = name_audio(ringtone_url)
        self.assertIsNone(result)

    def test_url_with_extra_query_params(self):
        ringtone_url = "https://www.iziclock.be/audio/sample.mp3?version=1"
        result = name_audio(ringtone_url)
        self.assertEqual(result, "sample.mp3")

    @patch('subprocess.run')
    def test_jouer_audio_mp3(self, mock_run):
        chemin_mp3 = "/home/iziclockAdmin/audio/real-gone.mp3"
        jouer_audio(chemin_mp3)
        mock_run.assert_called_once_with(['mpg123', chemin_mp3])

    # @patch('subprocess.run')
    # def test_jouer_audio_wav(self, mock_run):
    #     chemin_wav = "/home/iziclockAdmin/audio/real-gone.wav"
    #     jouer_audio(chemin_wav)
    #     mock_run.assert_called_once_with(['aplay', chemin_wav])

    @patch('subprocess.run')
    def test_jouer_audio_format_inconnu(self, mock_run):
        chemin_inconnu = "/path/to/audio/sample.txt"
        jouer_audio(chemin_inconnu)
        mock_run.assert_not_called()

    @patch('subprocess.run')
    def test_jouer_audio_chemin_vide(self, mock_run):
        chemin_vide = ""
        jouer_audio(chemin_vide)
        mock_run.assert_not_called()


if __name__ == '__main__':
    unittest.main()