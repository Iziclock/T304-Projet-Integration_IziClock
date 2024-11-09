package calendars

import (
	"net/http"
	"server/initializers"
	"server/models"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"context"
	"log"
	"os"
	"server/middleware"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/calendar/v3"
	"google.golang.org/api/option"
)

func Routes(route *gin.Engine) {
	calendars := route.Group("/calendars")
	{
		calendars.GET("", get_calendars)
		calendars.GET("/api", get_calendar_api)
		calendars.GET("/login", get_login)
		calendars.DELETE("/:id", delete_calendar)
		calendars.PUT("/state/:id", change_IsActive_state)
	}
}

// get_calendars récupère et retourne tous les calendriers de la base de données
// @Summary Récupère tous les calendriers
// @Description Récupère une liste de toutes les alarmes depuis la DB
// @Tags Calendriers
// @Produce json
// @Success 200 {array} models.Calendar "Calendars send successfully"
// @Failure 500 "Internal Server Error"
// @Router /calendars [get]
func get_calendars(context *gin.Context) {
	var calendars []models.Calendar

	// Récupère tous les calendriers triés par leur état d'activité et ensuite par date de création
	if err := initializers.DB.Order("is_active desc, created_at asc").Find(&calendars).Error; err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, calendars)
}

// delete_calendar Efface un calendrier via son ID
// @Summary Efface un calendrier
// @Description Efface un calendrier via son ID
// @Tags Calendriers
// @Produce json
// @Param id path int true "Calendar ID"
// @Success 200 {string} string "Calendar deleted successfully"
// @Failure 404 "Calendar not found"
// @Failure 500 "Internal Server Error"
// @Router /calendars/{id} [delete]
func delete_calendar(context *gin.Context) {
	id := context.Param("id")

	// Supprime le calendrier à partir de son ID
	if err := initializers.DB.Delete(&models.Calendar{}, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			context.JSON(http.StatusNotFound, gin.H{"error": "Calendar not found"})
		} else {
			context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Calendar deleted successfully"})
}

// change_IsActive_state change l'attribut d'activité d'un calendrier
// @Summary Change l'attribut d'activité d'un calendrier
// @Description Change l'attribut d'activité d'un calendrier via l'identifiant de celui-ci
// @Tags Calendriers
// @Produce json
// @Param id path int true "Calendar ID"
// @Success 200 {object} models.Calendar "Calendar updated successfully"
// @Failure 404 "Calendar not found"
// @Failure 500 "Internal Server Error"
// @Router /calendars/state/{id} [put]
func change_IsActive_state(context *gin.Context) {
	id := context.Param("id")
	log.Print("L'id récup des params du gin context :", id)
	var calendar models.Calendar

	// Récupère le calendrier à partir de son ID
	if err := initializers.DB.First(&calendar, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			context.JSON(http.StatusNotFound, gin.H{"error": "Calendar not found"})
		} else {
			context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	// Inverse l'état IsActive du calendrier
	calendar.IsActive = !calendar.IsActive

	// Sauvegarde les modifications
	if err := initializers.DB.Save(&calendar).Error; err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, calendar)
}

// events_from_api
// @Summary Récupère les événements du calendrier
// @Description Récupère une liste des événements à venir depuis le calendrier Google de l'utilisateur.
// @Tags Calendrier
// @Accept json
// @Produce json
// @Param code query string true "Code d'autorisation pour l'API Google"
// @Success 200 {object} map[string]interface{} "Liste des événements"
// @Failure 400 {object} map[string]string "Requête incorrecte"
// @Failure 500 {object} map[string]string "Erreur interne du serveur"
// @Router /calendar [get]
func events_from_api(c *gin.Context) {
	ctx := context.Background()
	b, err := os.ReadFile("credentials.json")
	if err != nil {
		log.Fatalf("Unable to read client secret file: %v", err)
	}

	config, err := google.ConfigFromJSON(b, calendar.CalendarReadonlyScope)
	if err != nil {
		log.Fatalf("Unable to parse client secret file to config: %v", err)
	}
	code := c.Query("code")
	client := middleware.GetClient(config, code)

	srv, err := calendar.NewService(ctx, option.WithHTTPClient(client))
	if err != nil {
		log.Fatalf("Unable to retrieve Calendar client: %v", err)
	}

	calendarList, err := srv.CalendarList.List().Do()
	if err != nil {
		log.Fatalf("Unable to retrieve calendar list: %v", err)
	}

	t := time.Now().Format(time.RFC3339)
	var allEvents []models.Alarm

	for _, calendarItem := range calendarList.Items {
		events, err := srv.Events.List(calendarItem.Id).
			ShowDeleted(false).
			SingleEvents(true).
			TimeMin(t).
			MaxResults(10).
			OrderBy("startTime").Do()

		if err != nil {
			log.Printf("Unable to retrieve events for calendar %s: %v", calendarItem.Id, err)
			continue
		}

		if len(events.Items) == 0 {
			log.Printf("No upcoming events found for calendar %s", calendarItem.Summary)
		} else {
			for _, item := range events.Items {
				//date := item.Start.DateTime
				log.Printf("date time de google :%v", item.Start.DateTime)
				date, err := time.Parse(time.DateTime, item.Start.DateTime)
				log.Printf("date time :%v", date)
				if date.IsZero() {
					date, err = time.Parse(time.DateOnly, item.Start.Date)
					log.Printf("date:%v", date)
					if err != nil {
						log.Printf("Erreur de parsing de date : %v", err)
					}
				}
				if err != nil {
					log.Printf("Erreur de parsing de date time: %v", err)
				}

				var calendar models.Calendar
				initializers.DB.Where("id_google = ?", calendarItem.Id).First(&calendar)
				log.Print("Calendrier actuel de la boucle:", calendarItem.Id)
				log.Print("calndar:", calendar)
				log.Print("calendar.ID:", calendar.ID)
				event := models.Alarm{
					CalendarID:  calendar.ID,
					Name:        item.Summary,
					Description: item.Description,
					RingDate:    date,
					Location:    item.Location,
					Ringtone:    "",
					IsActive:    true,
				}
				errA := initializers.DB.Create(&event).Error
				if errA != nil {
					log.Fatal("Could not create alarm :", err)
				}

				allEvents = append(allEvents, event)
			}
		}

	}

	c.JSON(http.StatusOK, gin.H{"events": allEvents})
}

// get_login
// @Summary Génère un lien d'autorisation Google
// @Description Fournit un lien permettant à l'utilisateur de se connecter et d'autoriser l'accès en lecture seule à son calendrier Google.
// @Tags Authentification
// @Accept json
// @Produce plain
// @Success 200 {string} string "URL d'autorisation Google pour l'utilisateur"
// @Failure 500 {object} map[string]string "Erreur interne du serveur"
// @Router /loginCalendar [get]
func get_login(c *gin.Context) {
	b, err := os.ReadFile("credentials.json")
	if err != nil {
		log.Fatalf("Unable to read client secret file: %v", err)
	}

	// If modifying these scopes, delete your previously saved token.json.
	config, err := google.ConfigFromJSON(b, calendar.CalendarReadonlyScope)
	if err != nil {
		log.Fatalf("Unable to parse client secret file to config: %v", err)
	}

	authURL := config.AuthCodeURL("state-token", oauth2.AccessTypeOffline)

	c.String(http.StatusOK, authURL)

}

func get_calendar_api(c *gin.Context) {
	var calendars []models.Calendar
	ctx := context.Background()
	b, err := os.ReadFile("credentials.json")
	if err != nil {
		log.Fatalf("Unable to read client secret file: %v", err)
	}

	config, err := google.ConfigFromJSON(b, calendar.CalendarReadonlyScope)
	if err != nil {
		log.Fatalf("Unable to parse client secret file to config: %v", err)
	}
	code := c.Query("code")
	client := middleware.GetClient(config, code)

	srv, err := calendar.NewService(ctx, option.WithHTTPClient(client))
	if err != nil {
		log.Fatalf("Unable to retrieve Calendar client: %v", err)
	}

	calendarList, err := srv.CalendarList.List().Do()
	if err != nil {
		log.Fatalf("Unable to retrieve calendar list: %v", err)
	}
	t := time.Now().Format(time.RFC3339)
	var allEvents []models.Alarm

	for _, calendarItem := range calendarList.Items {
		calendar := models.Calendar{
			UserID:      1,
			Name:        calendarItem.Summary,
			IDGoogle:    calendarItem.Id,
			Description: calendarItem.Description,
			IsActive:    true,
		}
		calendars = append(calendars, calendar)
		err := initializers.DB.Create(&calendar).Error
		if err != nil {
			log.Fatal("Could not create calendar :", err)
		}

		events, err := srv.Events.List(calendarItem.Id).
			ShowDeleted(false).
			SingleEvents(true).
			TimeMin(t).
			MaxResults(10).
			OrderBy("startTime").Do()

		if err != nil {
			log.Printf("Unable to retrieve events for calendar %s: %v", calendarItem.Id, err)
			continue
		}

		if len(events.Items) == 0 {
			log.Printf("No upcoming events found for calendar %s", calendarItem.Summary)
		} else {
			for _, item := range events.Items {
				log.Printf("date time de google :%v", item.Start.DateTime)
				date, err := time.Parse(time.DateTime, item.Start.DateTime)
				log.Printf("date time :%v", date)
				if date.IsZero() {
					date, err = time.Parse(time.DateOnly, item.Start.Date)
					log.Printf("date:%v", date)
					if err != nil {
						log.Printf("Erreur de parsing de date : %v", err)
					}
				}
				if err != nil {
					log.Printf("Erreur de parsing de date time: %v", err)
				}

				var calendar models.Calendar
				initializers.DB.Where("id_google = ?", calendarItem.Id).First(&calendar)
				log.Print("Calendrier actuel de la boucle:", calendarItem.Id)
				log.Print("calndar:", calendar)
				log.Print("calendar.ID:", calendar.ID)
				event := models.Alarm{
					CalendarID:  calendar.ID,
					Name:        item.Summary,
					Description: item.Description,
					RingDate:    date,
					Location:    item.Location,
					Ringtone:    "",
					IsActive:    true,
				}
				errA := initializers.DB.Create(&event).Error
				if errA != nil {
					log.Fatal("Could not create alarm :", err)
				}

				allEvents = append(allEvents, event)
			}

		}
		if err := initializers.DB.Order("is_active desc, created_at asc").Find(&calendars).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"calendars": calendars, "events": allEvents})

	}
}
