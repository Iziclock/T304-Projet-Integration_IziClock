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
	}
}

// get_alarms retrieve and return a list of all alarms sorted by ascending ring date
// @Summary Get all alarms
// @Description Retrieve a list of all alarms from DB and return it sorted by ascending ring date
// @Tags Alarms
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
