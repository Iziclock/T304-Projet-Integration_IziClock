package models

import (
	"time"
)

// Calendar représente le modèle d'un calendrier
type Calendar struct {
	ID uint `gorm:"primaryKey;autoIncrement"`
	//ID string `gorm:"primaryKey;size 255;"` test abandonné
	//UserID uint   `gorm:"not null; uniqueIndex:idx_calendar_name; uniqueIndex:idx_calendar_idgoogle"`
	UserID uint   `gorm:"not null; uniqueIndex:idx_calendar_name;uniqueIndex:idx_calendar_idgoogle"`
	Name   string `gorm:"size:255; not null; uniqueIndex:idx_calendar_name"`
	//	Url       string    `gorm:"size:255; not null; uniqueIndex:idx_calendar_url"`
	IDGoogle    string    `gorm:"size:255;column:id_google;not null;unique;uniqueIndex:idx_calendar_idgoogle"`
	Description string    `gorm:"size:255"`
	CreatedAt   time.Time `gorm:"autoCreateTime"`
	IsActive    bool      `gorm:"default:true"`
}
