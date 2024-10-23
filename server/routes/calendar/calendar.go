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

func get_calendar(c *gin.Context) {
	ctx := context.Background()
	b, err := os.ReadFile("credentials.json")
	if err != nil {
		log.Fatalf("Unable to read client secret file: %v", err)
	}

	// If modifying these scopes, delete your previously saved token.json.
	config, err := google.ConfigFromJSON(b, calendar.CalendarReadonlyScope)
	if err != nil {
		log.Fatalf("Unable to parse client secret file to config: %v", err)
	}
	client := middleware.GetClient(config)

	srv, err := calendar.NewService(ctx, option.WithHTTPClient(client))
	if err != nil {
		log.Fatalf("Unable to retrieve Calendar client: %v", err)
	}

	t := time.Now().Format(time.RFC3339)
	events, err := srv.Events.List("primary").ShowDeleted(false).
		SingleEvents(true).TimeMin(t).MaxResults(10).OrderBy("startTime").Do()
	if err != nil {
		log.Fatalf("Unable to retrieve next ten of the user's events: %v", err)
	}

	if len(events.Items) == 0 {
		c.JSON(http.StatusOK, gin.H{"message": "No upcoming events found."})
	} else {
		var eventList []gin.H
		for _, item := range events.Items {
			date := item.Start.DateTime
			if date == "" {
				date = item.Start.Date
			}
			event := gin.H{
				"summary": item.Summary,
				"date":    date,
			}
			eventList = append(eventList, event)
		}
		c.JSON(http.StatusOK, gin.H{"events": eventList})
	}
}
