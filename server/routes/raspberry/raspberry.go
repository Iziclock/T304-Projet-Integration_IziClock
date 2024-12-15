package raspberry
import (
	"net/http"
	"server/initializers"
	"server/models"
	"time"
    //"fmt"
	"github.com/gin-gonic/gin"
)

func Routes(route *gin.Engine) {
    raspberry := route.Group("/raspberry")
    {
        
        raspberry.GET("", get_update_data)
        
    }
}

type AlarmResponse struct {
    ID       uint          
    Name     string        
    RingDate time.Time     
    IsActive bool       
	RingtoneID uint   
    Ringtone RingtoneBrief 
}

type RingtoneBrief struct {
    ID   uint   
    Name string 
    Url  string 
}

// @Summary      Récupérer les alarmes mises à jour pour le Raspberry 
// @Description  Retourne une liste des alarmes mises à jour ou proches de sonner.
// @Tags         Raspberry
// @Accept       json
// @Produce      json
// @Success      200  {array}   AlarmResponse
// @Failure      500  {object}  string
// @Router       /raspberry [get]
func get_update_data(context *gin.Context) {
    var alarms []models.Alarm
    initializers.DB = initializers.DB.Debug()
    if err := initializers.DB.
        Preload("Ringtone").
        Table("alarms").
        Select("alarms.id, alarms.name, alarms.ring_date, alarms.is_active, alarms.ringtone_id, alarms.last_update,ringtones.id as ringtone_id, ringtones.name as ringtone_name, ringtones.url as ringtone_url").
        Joins("JOIN ringtones ON ringtones.id = alarms.ringtone_id").
        Where("update != last_update OR ring_date BETWEEN NOW() - INTERVAL '1 minute' AND NOW() + INTERVAL '10 minute'").
        Where("ring_date BETWEEN NOW() - INTERVAL '1 day' AND NOW() + INTERVAL '1 day'").
        Find(&alarms).
        Error; err != nil {
        context.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la vérification des mises à jour"})
        return
    }


    if len(alarms) == 0 {
        context.JSON(http.StatusOK, gin.H{"message": "Aucune mise à jour trouvée"})
        return
    }

    for _, alarm := range alarms {
        if err := initializers.DB.
            Table("alarms").
            Where("id = ?", alarm.ID).
            Update("update", alarm.LastUpdate).
            Error; err != nil {
            context.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la mise à jour des alarmes"})
            return
        }
    }

    var response []AlarmResponse
    for _, alarm := range alarms {
        response = append(response, AlarmResponse{
            ID:       alarm.ID,
            Name:     alarm.Name,
            RingDate: alarm.RingDate,
            IsActive: alarm.IsActive,
            RingtoneID: alarm.RingtoneID,
            Ringtone: RingtoneBrief{
                ID:   alarm.Ringtone.ID,
                Name: alarm.Ringtone.Name,
                Url:  alarm.Ringtone.Url,
            },
        })
    }

    context.JSON(http.StatusOK,response)
}


