package calendars

import (
	"encoding/json"
	"fmt"
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

	"golang.org/x/oauth2/google"
	"google.golang.org/api/calendar/v3"
	"google.golang.org/api/option"
)

func Routes(route *gin.Engine) {
	calendars := route.Group("/calendars")
	{
		calendars.GET("", get_calendars)
		calendars.GET("/api", get_calendar_api)
		calendars.DELETE("/:id", delete_calendar)
		calendars.PUT("/state/:id", change_IsActive_state)
		calendars.POST("/token", get_token)
	}
}

// get_calendars récupère et retourne tous les calendriers de la base de données
// @Summary Récupère tous les calendriers
// @Description Récupère une liste de tous les calendriers depuis la DB
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
	//var alarm []models.Alarm

	context.JSON(http.StatusOK, calendar)
}

// get_calendar_api récupère la liste des calendriers de l'utilisateur et leurs événements à partir de l'API Google Calendar
// @Summary Récupère les calendriers et leurs événements
// @Description Récupère tous les calendriers associés à l'utilisateur via l'API Google Calendar, ainsi que leurs événements à venir.
// @Tags Calendriers
// @Produce json
// @Success 200 {object} string "Calendriers et événements récupérés avec succès"
// @Failure 400 "Erreur dans la récupération des données"
// @Failure 500 "Erreur interne du serveur"
// @Router /calendars/api [get]
func get_calendar_api(c *gin.Context) {
	var calendars []models.Calendar
	ctx := context.Background()
	b, err := os.ReadFile("credentials.json")
	if err != nil {
		log.Printf("Unable to read client secret file: %v", err)
	}

	config, err := google.ConfigFromJSON(b, calendar.CalendarReadonlyScope)
	if err != nil {
		log.Printf("Unable to parse client secret file to config: %v", err)
	}
	//code := c.Query("code")
	client := middleware.GetClient(config)

	srv, err := calendar.NewService(ctx, option.WithHTTPClient(client))
	if err != nil {
		log.Printf("Unable to retrieve Calendar client: %v", err)
	}

	calendarList, err := srv.CalendarList.List().Do()
	if err != nil {
		log.Printf("Unable to retrieve calendar list: %v", err)
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
			log.Print("Could not create calendar :", err)
		}

		events, err := srv.Events.List(calendarItem.Id).
			ShowDeleted(false).
			SingleEvents(true).
			TimeMin(t).
			MaxResults(20).
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
				date, err := time.Parse(time.RFC3339, item.Start.DateTime)
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

				user := models.User{}
				initializers.DB.First(&user, 1)
				event := models.Alarm{
					CalendarID:    calendar.ID,
					RingtoneID:    user.RingtoneID,
					Name:          item.Summary,
					Description:   item.Description,
					RingDate:      date,
					LocationStart: "",
					LocationEnd:   item.Location,
					IsActive:      true,
					PreparationTime: uint(user.PreparationTime),
				}
				errA := initializers.DB.Create(&event).Error
				if errA != nil {
					log.Print("Could not create alarm :", err)
				}

				allEvents = append(allEvents, event)
			}

		}
		if err := initializers.DB.Order("is_active desc, created_at asc").Find(&calendars).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		//c.JSON(http.StatusOK, gin.H{"calendars":calendars,"events":allEvents,"token":tokenForUser})

	}
	tokenForUser, err := os.ReadFile("token.json")
	c.JSON(http.StatusOK, gin.H{"token": tokenForUser})

}

type Token struct {
	Access_token string `json:access_token`
}

// get_token récupère un token JSON envoyé dans la requête et le sauvegarde dans un fichier local
// @Summary Sauvegarde un token envoyé dans la requête
// @Description Récupère un token sous format JSON envoyé dans la requête et l'enregistre dans un fichier local "token.json".
// @Tags Calendriers
// @Accept  json
// @Produce json
// @Param token body Token true "Token à enregistrer"
// @Success 200 {string} string "Token sauvegardé avec succès"
// @Failure 400 "Erreur de traitement du token"
// @Failure 500 "Erreur lors de l'enregistrement du token"
// @Router /token [post]
func get_token(c *gin.Context) {
	token := Token{Access_token: ""}
	if err := c.BindJSON(&token.Access_token); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Print("Could not bind token :", err, token)
	}
	log.Print("Token:", token)
	jsonToken, _ := json.Marshal(token)
	log.Print("jsonToken:", jsonToken)
	err := os.WriteFile("token.json", []byte(jsonToken), 0666)
	if err != nil {
		log.Print("Could not write token :", err)
	}
	fmt.Println("Token saved successfully")
}
