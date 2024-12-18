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
		alarms.PUT("/state/:id", update_alarm_state)
		alarms.GET("/:id", get_alarm_by_id)
		alarms.PUT("/:id", update_alarm_details)
	}
}

// get_alarms récupère et retourne toutes les alarmes de la base de données
// @Summary Récupère toutes les alarmes
// @Description Récupère une liste de toutes les alarmes depuis la DB
// @Tags Alarmes
// @Produce json
// @Success 200 {array} models.Alarm "Alarms send successfully"
// @Failure 500 "Internal Server Error"
// @Router /alarms [get]
func get_alarms(context *gin.Context) {
	var alarms []models.Alarm

	// Précharge le calendrier et le ringtone associé pour chaque alarme.
	if err := initializers.DB.Preload("Calendar").Preload("Ringtone").Joins("JOIN calendars ON calendars.id = alarms.calendar_id").Where("calendars.is_active = true").Order("ring_date asc").Find(&alarms).Error; err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, alarms)
}

// update_alarm_state modifie l'état d'activité d'une alarme à partir de son ID
// @Summary Modifie l'état d'activité d'une alarme
// @Description Modifie l'état d'activité d'une alarme en DB à partir de son ID
// @Tags Alarmes
// @Produce json
// @Param id path int true "Alarm ID"
// @Success 200 {object} models.Alarm "Alarm updated successfully"
// @Failure 404 "Alarm not found"
// @Failure 500 "Internal Server Error"
// @Router /alarms/state/{id} [put]
func update_alarm_state(context *gin.Context) {
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

// get_alarm_by_id récupère et retourne une alarme à partir de son ID
// @Summary Récupère une alarme
// @Description Récupère une alarme depuis la DB à partir de son ID
// @Tags Alarmes
// @Produce json
// @Param id path int true "Alarm ID"
// @Success 200 {object} models.Alarm "Alarm send successfully"
// @Failure 404 "Alarm not found"
// @Failure 500 "Internal Server Error"
// @Router /alarms [get]
func get_alarm_by_id(context *gin.Context) {
	id := context.Param("id")
	var alarm models.Alarm

	if err := initializers.DB.First(&alarm, id).Error; err != nil {
		context.JSON(http.StatusNotFound, gin.H{"error": "Alarm not found"})
		return
	}

	context.JSON(http.StatusOK, alarm)
}

// update_alarm_details met à jour les détails de l'alarme
// @Summary Met à jour les détails de l'alarme
// @Description Met à jour les détails d'une alarme par ID
// @Tags Alarmes
// @Accept json
// @Produce json
// @Param id path int true "ID de l'alarme"
// @Param alarm body models.Alarm true "Détails de l'alarme"
// @Success 200 {object} models.Alarm
// @Failure 400 {object} string
// @Failure 404 {object} string
// @Failure 500 {object} string
// @Router /alarms/{id} [put]
func update_alarm_details(context *gin.Context) {
	id := context.Param("id")
	var alarm models.Alarm

	// Rechercher l'alarme par ID
	if err := initializers.DB.First(&alarm, id).Error; err != nil {
		context.JSON(http.StatusNotFound, gin.H{"error": "Alarm not found"})
		return
	}

	// Mettre à jour les détails de l'alarme avec les données reçues
	if err := context.ShouldBindJSON(&alarm); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Sauvegarder les modifications dans la base de données
	if err := initializers.DB.Save(&alarm).Error; err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, alarm)
}
