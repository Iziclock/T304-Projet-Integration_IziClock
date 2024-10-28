package logincalendargoogle

import (
	"log"
	"net/http"
	"os"

	"golang.org/x/oauth2"

	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/calendar/v3"
)

func Routes(route *gin.Engine) {
	loginCalendar := route.Group("/loginCalendar")
	{
		loginCalendar.GET("", get_login)
	}
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
