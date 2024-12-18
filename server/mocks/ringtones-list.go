package mocks

import (
	"log"
	"server/initializers"
	"server/models"
)

// RINGTONE_LIST contient les valeurs mockées pour les sonneries
var RINGTONE_LIST = []models.Ringtone{
	{Name: "Booba", Url: "https://example.com/ringtones1"},
	{Name: "Kaaris", Url: "https://example.com/ringtones2"},
	{Name: "Vacra", Url: "https://example.com/ringtones3"},
}

func InsertMockedRingtones() { // VALEURS MOCKEES : A RETIRER EN PROD !!!
	ringtones := RINGTONE_LIST
	for _, ringtone := range ringtones {
		err := initializers.DB.Create(&ringtone).Error
		if err != nil {
			log.Print("Could not create ringtone :", err)
		}
	}
}
