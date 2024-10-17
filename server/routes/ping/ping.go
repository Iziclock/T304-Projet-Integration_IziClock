package ping

import (
	"github.com/gin-gonic/gin"
)

func Routes(route *gin.Engine) {
	ping := route.Group("/ping")
	{
		ping.GET("", send_ping)
	}
}

// send_ping renvoie un message 'pong'
// @Summary Envoie un ping
// @Description Renvoie un message 'pong' pour vérifier que le serveur est en ligne
// @Tags Ping
// @Produce json
// @Success 200 "Ping Pong"
// @Router /ping [get]
func send_ping(context *gin.Context) {
	context.JSON(200, gin.H{
		"message": "pong",
	})
}
