package db

import (
	"fmt"
	"log"
	"os"
	"server/mocks"
	"server/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	_ "github.com/lib/pq"
)

type Database struct {
	db *gorm.DB
}

func MigrateDatabase(db Database) error { // Migrer la base de données
	err := db.db.AutoMigrate(&models.Alarm{}) // Création de la table des alarmes dans la base de données
	if err != nil {                           // Vérification d'une erreur lors de la création de la table des alarmes
		return err
	}
	return nil
}

func InsertMockedAlarms(db Database) error { // Insérer des alarmes mockées dans la base de données
	err := db.db.Where("1 = 1").Delete(models.Alarm{}).Error // Effece toutes les alarmes mockées pour les regénérer.
	if err != nil {
		return err
	}

	alarms := mocks.ALARM_LIST     // Récupérer la liste d'alarmes mockées
	for _, alarm := range alarms { // Pour chaque alarme de la liste d'alarmes
		err := db.db.Create(&alarm).Error // Créer l'alarme dans la base de données
		if err != nil {                   // Vérification d'une erreur lors de la création de l'alarme
			return err
		}
	}
	return nil
}

func NewDatabase() (*Database, error) {
	user := os.Getenv("POSTGRES_USER")
	password := os.Getenv("POSTGRES_PASSWORD")
	dbname := os.Getenv("POSTGRES_DB")
	port := os.Getenv("POSTGRES_PORT")
	host := "localhost" // os.Getenv("POSTGRES_HOST")
	sslmode := "disable"
	timezone := "Europe/Paris"
	dsn := "postgresql://" + user + ":" + password + "@" + host + ":" + port + "/" + dbname + "?sslmode=" + sslmode + "&TimeZone=" + timezone

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{}) // Ouverture, via la requête DSN et l'ORM Go GORM, d'une connexion à la base de données PostgreSQL
	log.Println("dsn", dsn)
	if err != nil { // Vérification d'une erreur lors de l'ouverture de la base de données'
		fmt.Println("Could not initialize DB connection :", err)
		return nil, err
	}

	database := &Database{db: db}

	err = MigrateDatabase(*database) // Migrer la base de données
	if err != nil {
		return nil, err
	}
	fmt.Println("Database migrated")

	err = InsertMockedAlarms(*database) // Insérer des alarmes mockées dans la base de données
	if err != nil {
		return nil, err
	}
	fmt.Println("Mocked alarms inserted")

	sqlDB, err := db.DB()
	if err != nil { // Vérification d'une erreur lors de l'accès à la base de données
		return nil, err
	}
	err = sqlDB.Ping()
	if err != nil { // Vérification d'une erreur lors de la connexion à la base de données
		return nil, err
	}
	return &Database{db: db}, nil
}

func (d *Database) Close() error { // Fermer la connexion à la base de données
	sqlDB, err := d.db.DB()
	if err != nil {
		return err
	}
	return sqlDB.Close()
}

func (d *Database) GetDB() *gorm.DB { // Récupérer la base de données
	return d.db
}
