package ringtones

import (
	"fmt"
	"net/http"
	"os/exec"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func Routes(route *gin.Engine) {
	alarms := route.Group("/ringtones")
	{
		alarms.POST("/upload", upload_ringtone)
	}
}

func upload_ringtone(context *gin.Context) {
	file, err := context.FormFile("file")
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "No file is received"})
		return
	}

	savePath := filepath.Join("uploads", file.Filename)
	if err := context.SaveUploadedFile(file, savePath); err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save the file"})
		return
	}

	vpsPath := "iziclock@185.216.27.36:/home/iziclock/iziclock/ringtones"
	scpCommand := fmt.Sprintf("scp -P 53152 %s %s", savePath, vpsPath)

	cmd := exec.Command("sh", "-c", scpCommand)
	if err := cmd.Run(); err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Error transferring file to VPS"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "File uploaded and transferred successfully"})
}
