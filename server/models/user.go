package models

import (
	"time"
)

// User représente un utilisateur
type User struct {
	ID        uint      `gorm:"primaryKey;autoIncrement"`
	Name			string    `gorm:"size:255; not null; unique"`
	PreparationTime      int    `gorm:"not null; default:10"`
	RingtoneID    uint      `gorm:"not null;default:1"`  
    Ringtone   Ringtone  `gorm:"foreignKey:RingtoneID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"` 
	CreatedAt time.Time `gorm:"autoCreateTime"`
}
