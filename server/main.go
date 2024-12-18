package main

import (
	"os"
	"server/config"
	_ "server/docs"
	"server/initializers"
	"server/routes/alarms"
	"server/routes/calendars"
	logincalendargoogle "server/routes/loginCalendarGoogle"
	"server/routes/ping"
	"server/routes/raspberry"
	"server/routes/ringtones"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"     // swagger embed files
	ginSwagger "github.com/swaggo/gin-swagger" // gin-swagger middleware
	// "server/mocks"
)

func init() {
	if os.Getenv("PROFILE") != "prod" {
		initializers.InitEnv()
	}
	initializers.ConnectDB()
	initializers.SyncDB()
	// mocks.InsertMockedCalendars() // VALEURS MOCKEES : A RETIRER EN PROD !!!
	mocks.InsertMockedRingtones() // VALEURS MOCKEES : A RETIRER EN PROD !!!
	// mocks.InsertMockedAlarms()    // VALEURS MOCKEES : A RETIRER EN PROD !!!
}

// @title IziClock API Documentation
// @version 1.0
// @description Il s'agit de la documentation de l'API IziClock.
// @host localhost:8080
// @BasePath /
func main() {
	router := gin.Default()
	config.SetCORS(router)

	router.MaxMultipartMemory = 100 << 20

	// Groupes de routes
	ping.Routes(router)
	alarms.Routes(router)
	calendars.Routes(router)
	logincalendargoogle.Routes(router)
	ringtones.Routes(router)
	raspberry.Routes(router)
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	router.Run(":8080") // listen and serve on localhost:8080
}
