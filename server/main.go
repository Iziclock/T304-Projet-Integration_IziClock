package main

import (
	"server/config"
	"server/initializers"
	"server/mocks"
	"server/routes/alarms"
	"server/routes/ping"

	"github.com/gin-gonic/gin"
)

func init() {
	initializers.InitEnv()
	initializers.ConnectDB()
	initializers.SyncDB()
	mocks.InsertMockedAlarms() // VALEURS MOCKEES : A RETIRER EN PROD !!!
}

func main() {
	router := gin.Default()
	config.SetCORS(router)

	// Groupes de routes
	ping.Routes(router)
	alarms.Routes(router)

	router.Run() // listen and serve on localhost:8080
}
