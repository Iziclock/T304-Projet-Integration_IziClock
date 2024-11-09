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

// get_calendars récupère et retourne toutes les sonneries de la base de données
// @Summary Récupère toutes les sonneries
// @Description Récupère une liste de toutes les sonneries depuis la DB
// @Tags Sonneries
// @Produce json
// @Success 200 {array} models.Ringtone "Ringtones send successfully"
// @Failure 500 "Internal Server Error"
// @Router /ringtones [get]
func get_ringtones(context *gin.Context) {
	var ringtones []models.Ringtone

	if err := initializers.DB.Order("created_at asc").Find(&ringtones).Error; err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, ringtones)
}

// upload_ringtone upload une nouvelle sonnerie et sauve son url dans la base de données
// @Summary Upload une sonnerie
// @Description Upload une nouvelle sonnerie et sauve son url dans la base de données
// @Tags Sonneries
// @Accept mpfd
// @Produce json
// @Param file formData file true "Fichier audio de la sonnerie à upload"
// @Success 200 "File uploaded and transferred successfully"
// @Failure 400 "No file is received"
// @Failure 409 "Ringtone already exists"
// @Failure 500 "Unable to save the file"
// @Router /ringtones/upload [post]
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

	ringtone := models.Ringtone{Url: url}
	if err := initializers.DB.Create(&ringtone).Error; err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save the ringtone in the database"})
		return
	}

	savePath := filepath.Join("../../ringtones", filename)
	if err := context.SaveUploadedFile(file, savePath); err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save the file"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "File uploaded and transferred successfully"})
}
