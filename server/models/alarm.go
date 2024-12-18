package models

import (
	"time"
)

// Alarm représente le modèle d'alarme
type Alarm struct {
	ID              uint      `gorm:"primaryKey;autoIncrement"`
	CalendarID      uint      `gorm:"not null;"`
	Calendar        Calendar  `gorm:"foreignKey:CalendarID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	RingtoneID      uint      `gorm:"not null;default:1"`
	Ringtone        Ringtone  `gorm:"foreignKey:RingtoneID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Name            string    `gorm:"size:255; not null; uniqueIndex:idx_alarm"`
	Description     string    `gorm:"size:255;"`
	RingDate        time.Time `gorm:"not null; uniqueIndex:idx_alarm"`
	PreparationTime uint      `gorm:"not null;default:0"`
	CreatedAt       time.Time `gorm:"autoCreateTime"`
	Update          time.Time `gorm:""`
	LastUpdate      time.Time `gorm:"autoUpdateTime"`
	LocationStart   string    `gorm:"size:255; not null"`
	LocationEnd     string    `gorm:"size:255; not null"`
	Transport       string    `gorm:"size:255; not null"`
	IsActive        bool      `gorm:"default:false"`
}
