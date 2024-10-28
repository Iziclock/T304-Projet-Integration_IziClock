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
        alarms.GET("/:id", get_alarm_by_id) // Nouvelle route pour récupérer une alarme par ID
    }
}

func get_alarms(context *gin.Context) {
    var alarms []models.Alarm

    if err := initializers.DB.Joins("JOIN calendars ON calendars.id = alarms.calendar_id").Where("calendars.is_active = true").Order("ring_date asc").Find(&alarms).Error; err != nil {
        context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    context.JSON(http.StatusOK, alarms)
}

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

// Nouvelle fonction pour obtenir une alarme par ID
func get_alarm_by_id(context *gin.Context) {
    id := context.Param("id")
    var alarm models.Alarm

    if err := initializers.DB.First(&alarm, id).Error; err != nil {
        context.JSON(http.StatusNotFound, gin.H{"error": "Alarm not found"})
        return
    }

    context.JSON(http.StatusOK, alarm)
}