package config

import (
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetCORS(router *gin.Engine) {
	if os.Getenv("PROFILE") == "dev" {
		router.Use(cors.New(cors.Config{
			AllowOrigins:     []string{"http://localhost:8100"},
			AllowMethods:     []string{"GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"},
			AllowHeaders:     []string{"Origin", "Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization", "Accept", "Cache-Control", "X-Requested-With", "Set-Cookie"},
			AllowCredentials: true,
		}))
		log.Println("Starting in dev mode")
	} else if os.Getenv("PROFILE") == "prod" {
		gin.SetMode(gin.ReleaseMode)
		router.Use(cors.New(cors.Config{
			AllowOrigins:     []string{"http://localhost:8100", "https://localhost"},
			AllowMethods:     []string{"GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"},
			AllowHeaders:     []string{"Origin", "Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization", "Accept", "Cache-Control", "X-Requested-With", "Set-Cookie"},
			AllowCredentials: true,
		}))
		log.Println("Starting in prod mode")
	}
}
