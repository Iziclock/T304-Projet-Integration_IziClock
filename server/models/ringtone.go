package models

import (
	"time"
)

// Ringtone représente le modèle d'une sonnerie
type Ringtone struct {
	ID        uint      `gorm:"primaryKey"`
	Name      string    `gorm:"size:255; not null; unique"`
	Url       string    `gorm:"size:255; not null; unique"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
}
