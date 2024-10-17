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

// delete_calendar deletes a calendar by ID
// @Summary Delete a calendar
// @Description Delete a calendar by ID from DB
// @Tags Calendars
// @Produce json
// @Param id path int true "Calendar ID"
// @Success 200 {string} string "Calendar deleted successfully"
// @Failure 404 "Calendar not found"
// @Failure 500 "Internal Server Error"
// @Router /calendars/{id} [delete]
func delete_calendar(context *gin.Context) {
	id := context.Param("id")
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

// change_IsActive_state toggles the IsActive field of a calendar by ID
// @Summary Toggle IsActive field of a calendar
// @Description Toggle the IsActive field of a calendar by ID
// @Tags Calendars
// @Produce json
// @Param id path int true "Calendar ID"
// @Success 200 {object} models.Calendar "Calendar updated successfully"
// @Failure 404 "Calendar not found"
// @Failure 500 "Internal Server Error"
// @Router /calendars/state/{id} [put]
func change_IsActive_state(context *gin.Context) {
	id := context.Param("id")
	var calendar models.Calendar

	if err := initializers.DB.First(&calendar, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			context.JSON(http.StatusNotFound, gin.H{"error": "Calendar not found"})
		} else {
			context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	calendar.IsActive = !calendar.IsActive

	if err := initializers.DB.Save(&calendar).Error; err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, calendar)
}
