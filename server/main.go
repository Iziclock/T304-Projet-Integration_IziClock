package main

import (
	"server/config"
	_ "server/docs"
	"server/initializers"
	"server/mocks"
	"server/routes/alarms"
	"server/routes/ping"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"     // swagger embed files
	ginSwagger "github.com/swaggo/gin-swagger" // gin-swagger middleware
)

func init() {
	initializers.InitEnv()
	initializers.ConnectDB()
	initializers.SyncDB()
	mocks.InsertMockedAlarms() // VALEURS MOCKEES : A RETIRER EN PROD !!!
}

// @title IziClock API Documentation
// @version 1.0
// @description This is Swagger Documentation for IziClock API
// @host localhost:8080
// @BasePath /
func main() {
	router := gin.Default()
	config.SetCORS(router)

	// Groupes de routes
	ping.Routes(router)
	alarms.Routes(router)
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	router.Run() // listen and serve on localhost:8080
}
