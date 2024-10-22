package alarms

import (
	"net/http"
	"server/initializers"
	"server/models"

	"github.com/gin-gonic/gin"
)

func Routes(route *gin.Engine) {
	alarms := route.Group("/alarms")
	{
		alarms.GET("", get_alarms)
		alarms.PUT("/state/:id", update_alarms)
	}
}

// get_alarms récupère et retourne toutes les alarmes de la base de données
// @Summary Récupère toutes les alarmes
// @Description Récupère une liste de toutes les alarmes et les renvoie dans l'ordre de leur date de sonnerie
// @Tags Alarmes
// @Produce json
// @Success 200 {array} models.Alarm "Alarms send successfully"
// @Failure 500 "Internal Server Error"
// @Router /alarms [get]
func get_alarms(context *gin.Context) {
	var alarms []models.Alarm

	// Récupère toutes les alarmes triées par date de sonnerie
	if err := initializers.DB.Joins("JOIN calendars ON calendars.id = alarms.calendar_id").Where("calendars.is_active = true").Order("ring_date asc").Find(&alarms).Error; err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, alarms)
}

// update_alarms met à jour l'état actif d'une alarme
// @Summary Update alarm status
// @Description Met à jour l'état IsActive d'une alarme spécifiée par son ID
// @Tags Alarmes
// @Param id path int true "Alarm ID"
// @Produce json
// @Success 200 {object} models.Alarm
// @Failure 404 {object} map[string]string "Alarm not found"
// @Failure 500 {object} map[string]string "Erreur interne du serveur"
// @Router /alarms/state/{id} [put]
func update_alarms(context *gin.Context) {
	id := context.Param("id")
	var alarm models.Alarm

	if err := initializers.DB.First(&alarm, id).Error; err != nil {
		context.JSON(http.StatusNotFound, gin.H{"error": "Alarm not found"})
		return
	}

	alarm.IsActive = !alarm.IsActive

	if err := initializers.DB.Save(&alarm).Error; err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, alarm)
}
