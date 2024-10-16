package calendars

import (
	"net/http"
	"server/initializers"
	"server/models"

	"github.com/gin-gonic/gin"
)

func Routes(route *gin.Engine) {
	calendars := route.Group("/calendars")
	{
		calendars.GET("", get_calendars)
	}
}

// get_calendars retrieve and return a list of all calendars
// @Summary Get all calendars
// @Description Retrieve a list of all calendars from DB
// @Tags Calendars
// @Produce json
// @Success 200 {array} models.Calendar "Calendars send successfully"
// @Failure 500 "Internal Server Error"
// @Router /calendars [get]
func get_calendars(context *gin.Context) {
	var calendars []models.Calendar
	if err := initializers.DB.Order("created_at asc").Find(&calendars).Error; err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	context.JSON(http.StatusOK, calendars)
}
