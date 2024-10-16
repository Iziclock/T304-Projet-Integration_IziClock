package initializers

import (
	"log"
	"os"
	"server/models"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func InitEnv() {
	// Load the .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

var DB *gorm.DB

func ConnectDB() {
	user := os.Getenv("POSTGRES_USER")
	password := os.Getenv("POSTGRES_PASSWORD")
	dbname := os.Getenv("POSTGRES_DB")
	port := os.Getenv("POSTGRES_PORT")
	var host string
	if os.Getenv("PROFILE") == "prod" {
		host = os.Getenv("POSTGRES_HOST")
	} else {
		host = "localhost"
	}
	sslmode := "disable"
	timezone := "Europe/Paris"
	dsn := "postgresql://" + user + ":" + password + "@" + host + ":" + port + "/" + dbname + "?sslmode=" + sslmode + "&TimeZone=" + timezone

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	log.Println("dsn", dsn)
	if err != nil {
		log.Fatal("Could not initialize DB connection :", err)
	}

	sqlDB, err := DB.DB() // Accès à la base de données
	if err != nil {
		log.Fatal("Could not access DB :", err)
	}
	err = sqlDB.Ping()
	if err != nil {
		log.Fatal("Could not connect to DB :", err)
	}

	log.Println("DB connection initialized", DB)
}

func SyncDB() {
	err := DB.AutoMigrate(&models.Alarm{}) // Ajoute les tables à la base de données
	if err != nil {
		log.Fatal("Could not migrate tables :", err)
	}
}
