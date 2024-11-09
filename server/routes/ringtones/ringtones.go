package ringtones

import (
	"net/http"
	"path/filepath"
	"server/initializers"
	"server/models"

	"github.com/gin-gonic/gin"
)

func Routes(route *gin.Engine) {
	alarms := route.Group("/ringtones")
	{
		alarms.GET("", get_ringtones)
		alarms.POST("/upload", upload_ringtone)
	}
}

func get_ringtones(context *gin.Context) {
	var ringtones []models.Ringtone

	if err := initializers.DB.Order("created_at asc").Find(&ringtones).Error; err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, ringtones)
}

func upload_ringtone(context *gin.Context) {
	file, err := context.FormFile("file")
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "No file is received"})
		return
	}

	filename := file.Filename
	url := "https://www.iziclock.be/audio/" + filename

	var existingRingtone models.Ringtone
	if err := initializers.DB.Where("url = ?", url).First(&existingRingtone).Error; err == nil {
		context.JSON(http.StatusConflict, gin.H{"error": "Ringtone already exists"})
		return
	}

	savePath := filepath.Join("../../ringtones", filename)
	if err := context.SaveUploadedFile(file, savePath); err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save the file"})
		return
	}

	ringtone := models.Ringtone{Url: url}
	if err := initializers.DB.Create(&ringtone).Error; err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save the ringtone in the database"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "File uploaded and transferred successfully"})
}
