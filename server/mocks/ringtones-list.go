package mocks

import (
	"log"
	"server/initializers"
	"server/models"
)

// RINGTONE_LIST contient les valeurs mockées pour les sonneries
var RINGTONE_LIST = []models.Ringtone{
	{ID : 2 , Name: "Kalash", Url: "https://www.iziclock.be/audio/kalash.mp3"},
	{ID : 3 , Name: "Le Navire", Url: "https://www.iziclock.be/audio/le_navire_booba.mp3"},
	// {ID : 4 , Name: "Vacra", Url: "https://example.com/ringtones3"},
}

func InsertMockedRingtones() { // VALEURS MOCKEES : A RETIRER EN PROD !!!
	ringtones := RINGTONE_LIST
	for _, ringtone := range ringtones {
		err := initializers.DB.Create(&ringtone).Error
		if err != nil {
			log.Fatal("Could not create ringtone :", err)
		}
	}
}
