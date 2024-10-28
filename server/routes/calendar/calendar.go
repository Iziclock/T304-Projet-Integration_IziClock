package calendar

import (
	"context"
	"log"
	"net/http"
	"os"
	"server/middleware"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/calendar/v3"
	"google.golang.org/api/option"
)

func Routes(route *gin.Engine) {
	calendar := route.Group("/calendar")
	{
		calendar.GET("", get_calendar)
	}
}

// get_calendar
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
func get_calendar(c *gin.Context) {
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
	var allEvents []gin.H

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

		// Vérifie s'il y a des événements dans ce calendrier
		if len(events.Items) == 0 {
			log.Printf("No upcoming events found for calendar %s", calendarItem.Summary)
		} else {
			// Récupère les événements et ajoute le nom du calendrier pour différencier
			for _, item := range events.Items {
				date := item.Start.DateTime
				if date == "" {
					date = item.Start.Date
				}
				event := gin.H{
					"calendar": calendarItem.Summary,
					"summary":  item.Summary,
					"date":     date,
				}
				allEvents = append(allEvents, event)
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{"events": allEvents})
}
