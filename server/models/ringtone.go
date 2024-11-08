package models

import (
	"time"
)

// Ringtone représente le modèle d'une sonnerie
type Ringtone struct {
	ID        uint      `gorm:"primaryKey"`
	Url       string    `gorm:"size:255; not null; consrtaint:Unique"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
}
