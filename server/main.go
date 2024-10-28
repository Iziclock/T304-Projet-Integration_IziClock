package main

import (
	"os"
	"server/config"
	_ "server/docs"
	"server/initializers"
	"server/mocks"
	"server/routes/alarms"
	"server/routes/calendar"
	"server/routes/calendars"
	logincalendargoogle "server/routes/loginCalendarGoogle"
	"server/routes/ping"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"     // swagger embed files
	ginSwagger "github.com/swaggo/gin-swagger" // gin-swagger middleware
)

func init() {
	if os.Getenv("PROFILE") != "prod" {
		initializers.InitEnv()
	}
	initializers.ConnectDB()
	initializers.SyncDB()
	mocks.InsertMockedCalendars() // VALEURS MOCKEES : A RETIRER EN PROD !!!
	mocks.InsertMockedAlarms()    // VALEURS MOCKEES : A RETIRER EN PROD !!!
}

// @title IziClock API Documentation
// @version 1.0
// @description Il s'agit de la documentation de l'API IziClock.
// @host localhost:8080
// @BasePath /
func main() {
	router := gin.Default()
	config.SetCORS(router)

	// Groupes de routes
	ping.Routes(router)
	alarms.Routes(router)
	calendars.Routes(router)
	calendar.Routes(router)
	logincalendargoogle.Routes(router)
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	router.Run() // listen and serve on localhost:8080
}
