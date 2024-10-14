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

// send_ping return a "pong" message
// @Summary Send a ping
// @Description Return a 'pong' message
// @Tags Ping
// @Produce json
// @Success 200 "Ping Pong"
// @Router /ping [get]
func send_ping(context *gin.Context) {
	context.JSON(200, gin.H{
		"message": "pong",
	})
}
