package mocks

import (
	"log"
	"server/initializers"
	"server/models"
)

// RINGTONE_LIST contient les valeurs mockées pour les sonneries
var USER_LIST = []models.User{
	{Name: "Default", PreparationTime: 10, RingtoneID: 1},
}

func InsertMockedUser() { // VALEURS MOCKEES : A RETIRER EN PROD !!!
	users := USER_LIST
	for _, user := range users {
		err := initializers.DB.Create(&user).Error
		if err != nil {
			log.Print("Could not create user :", err)
		}
	}
}