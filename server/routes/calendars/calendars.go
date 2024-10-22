package calendars

import (
	"net/http"
	"server/initializers"
	"server/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Routes(route *gin.Engine) {
	calendars := route.Group("/calendars")
	{
		calendars.GET("", get_calendars)
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
