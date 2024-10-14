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

func send_ping(context *gin.Context) {
	context.JSON(200, gin.H{
		"message": "pong",
	})
}
