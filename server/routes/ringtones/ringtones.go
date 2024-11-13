package ringtones

import (
	"net/http"
	"path/filepath"
	"regexp"
	"server/initializers"
	"server/models"
	"strings"

	"github.com/gin-gonic/gin"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

func Routes(route *gin.Engine) {
	ringtones := route.Group("/ringtones")
	{
		ringtones.GET("", get_ringtones)
		ringtones.POST("/upload", upload_ringtone)
		ringtones.PUT("/name/:id", update_ringtone_name)
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

	re := regexp.MustCompile(`[-_]|(\.\w+$)`)
	name := re.ReplaceAllString(filename, " ")

	c := cases.Title(language.Und)
	words := strings.Fields(name)
	for i, word := range words {
		words[i] = c.String(word)
	}
	name = strings.Join(words, " ")

	ringtone := models.Ringtone{Url: url, Name: name}
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

// update_ringtone_name modifie le nom d'une sonnerie à partir de son ID
// @Summary Modifie le nom d'une sonnerie
// @Description Modifie le nom d'une sonnerie en DB à partir de son ID
// @Tags Sonneries
// @Produce json
// @Param id path int true "Ringtone ID"
// @Success 200 {object} models.Ringtone "Ringtone updated successfully"
// @Failure 404 "Ringtone not found"
// @Failure 500 "Internal Server Error"
// @Router /ringtones/name/{id} [put]
func update_ringtone_name(context *gin.Context) {
	var ringtone models.Ringtone
	id := context.Param("id")

	if err := initializers.DB.First(&ringtone, id).Error; err != nil {
		context.JSON(http.StatusNotFound, gin.H{"error": "Ringtone not found"})
		return
	}

	var input struct {
		Name string `json:"name"`
	}

	if err := context.ShouldBindJSON(&input); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ringtone.Name = input.Name

	if err := initializers.DB.Save(&ringtone).Error; err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Ringtone updated successfully"})
}
