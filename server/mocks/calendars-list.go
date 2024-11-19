package mocks

import (
	"log"
	"server/initializers"
	"server/models"
)

// CALENDAR_LIST contient les valeurs mockées pour les calendriers
var CALENDAR_LIST = []models.Calendar{
	{UserID: 1, Name: "Calendrier EPHEC", IDGoogle: "https://example.com/calendar1", IsActive: true},
	{UserID: 2, Name: "Calendrier Vacances", IDGoogle: "https://example.com/calendar2", IsActive: false},
	{UserID: 3, Name: "Calendrier Maison", IDGoogle: "https://example.com/calendar3", IsActive: true},
}

func InsertMockedCalendars() { // VALEURS MOCKEES : A RETIRER EN PROD !!!
	calendars := CALENDAR_LIST
	for _, calendar := range calendars {
		err := initializers.DB.Create(&calendar).Error
		if err != nil {
			log.Fatal("Could not create calendar :", err)
		}
	}
}
