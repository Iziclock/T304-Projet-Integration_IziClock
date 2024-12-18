package users

import (
	"net/http"
	"server/initializers"
	"server/models"

	"github.com/gin-gonic/gin"
)

func Routes(route *gin.Engine) {
	ringtones := route.Group("/users")
	{
		ringtones.GET("", get_user)
		ringtones.PUT("", update_user)
	}
}

// @Summary Get the first user
// @Description Retrieve the first user from the database, ordered by creation date.
// @Tags Users
// @Produce json
// @Success 200
// @Failure 500  "Internal Server Error"
// @Router /users/first [get]
func get_user(context *gin.Context) {
	var users []models.User

	if err := initializers.DB.Order("created_at asc").Find(&users).Error; err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, users[0])
}

// @Summary Update user
// @Description Update the details of a user with a fixed ID (currently hardcoded as ID=1).
// @Tags Users
// @Accept json
// @Produce json
// @Param user  body      true  "Updated User Info"
// @Success 200
// @Failure 400  "Bad Request"
// @Failure 404  "User Not Found"
// @Failure 500  "Internal Server Error"
// @Router /users/{id} [put]
func update_user(context *gin.Context) {
	var user models.User

	if err := initializers.DB.First(&user, 1).Error; err != nil {
		context.JSON(http.StatusNotFound, gin.H{"error": "Alarm not found"})
		return
	}

	if err := context.ShouldBindJSON(&user); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := initializers.DB.Save(&user).Error; err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, user)
}
