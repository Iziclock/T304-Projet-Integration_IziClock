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
	if err := initializers.DB.Order("ring_date asc").Find(&alarms).Error; err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	context.JSON(http.StatusOK, alarms)
}
