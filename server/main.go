package main

import (
	"log"
	"net/http"
	"os"
	"server/db"
	"server/models"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

func connectDB() *db.Database {
	postgres, err := db.NewDatabase()
	if err != nil {
		log.Fatalf("Could not initialize DB connection: %s", err)
	}
	log.Println("DB connection initialized", postgres.GetDB())
	return postgres
}

func getAlarms(db *db.Database) ([]models.Alarm, error) {
	var alarms []models.Alarm
	if err := db.GetDB().Order("ring_date asc").Find(&alarms).Error; err != nil {
		return nil, err
	}
	return alarms, nil
}

func main() {
	db := connectDB()
	defer db.Close()

	r := gin.Default()
	if os.Getenv("PROFILE") == "dev" {
		r.Use(cors.New(cors.Config{
			AllowOrigins:     []string{"http://localhost:8100"},
			AllowMethods:     []string{"PUT", "PATCH", "GET", "POST", "DELETE"},
			AllowHeaders:     []string{"Origin", "Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization", "Accept", "Cache-Control", "X-Requested-With", "Set-Cookie"},
			AllowCredentials: true,
		}))
		log.Println("Starting in dev mode")
	} else if os.Getenv("PROFILE") == "prod" {
		gin.SetMode(gin.ReleaseMode)
		r.Use(cors.New(cors.Config{
			AllowOrigins:     []string{"http://localhost:8100"},
			AllowMethods:     []string{"GET", "POST", "DELETE"},
			AllowHeaders:     []string{"Origin", "Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization", "Accept", "Cache-Control", "X-Requested-With", "Set-Cookie"},
			AllowCredentials: true,
		}))
		log.Println("Starting in prod mode")
	}

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	r.GET("/alarms", func(c *gin.Context) {
		alarms, err := getAlarms(db)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, alarms)
	})

	r.Run() // listen and serve on localhost:8080
}
