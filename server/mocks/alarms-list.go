package mocks

import (
	"log"
	"server/initializers"
	"server/models"
	"time"
)

// ALARM_LIST contient les valeurs mockées pour les alarmes
var ALARM_LIST = []models.Alarm{
	{CalendarID: 1, RingtoneID: 1, Name: "Projet d'intégration", RingDate: time.Now().Add(24 * time.Hour), LocationEnd: "EPHEC", IsActive: true},
	{CalendarID: 2, RingtoneID: 2, Name: "Sécurité des réseaux (Théorie)", RingDate: time.Now().Add(48 * time.Hour), LocationEnd: "EPHEC", IsActive: false},
	{CalendarID: 3, RingtoneID: 2, Name: "Sécurité des réseaux (Pratique)", RingDate: time.Now().Add(72 * time.Hour), LocationEnd: "EPHEC", IsActive: true},
	{CalendarID: 3, RingtoneID: 3, Name: "Sécurité des réseaux (Pratique)", RingDate: time.Now().Add(time.Hour), LocationEnd: "EPHEC", IsActive: true},
}

func InsertMockedAlarms() { // VALEURS MOCKEES : A RETIRER EN PROD !!!
	err := initializers.DB.Where("1 = 1").Delete(models.Alarm{}).Error
	if err != nil {
		log.Fatal("Could not delete alarms :", err)
	}
	alarms := ALARM_LIST
	for _, alarm := range alarms {
		err := initializers.DB.Create(&alarm).Error
		if err != nil {
			log.Fatal("Could not create alarm :", err)
		}
	}
}
