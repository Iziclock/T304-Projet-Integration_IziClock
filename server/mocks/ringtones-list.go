package mocks

import (
	"log"
	"server/initializers"
	"server/models"
)

// RINGTONE_LIST contient les valeurs mockées pour les sonneries
var RINGTONE_LIST = []models.Ringtone{
	{Name: "", Url: ""},
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
