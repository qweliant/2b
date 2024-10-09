package models

import (
	"time"

	"github.com/google/uuid"
)

type Object struct {
	ID           uuid.UUID `json:"id" db:"id"`
	Name         string    `json:"name" db:"name"`
	Description  string    `json:"description,omitempty" db:"description"`
	Color        string    `json:"color,omitempty" db:"color"`
	Icon         string    `json:"icon,omitempty" db:"icon"`
	Fixed        bool      `json:"fixed" db:"fixed"`
	ObjectTypeID uuid.UUID `json:"objectTypeId" db:"object_type_id"` // Foreign key to ObjectType
}

// Property represents the structure of the Property table.
type Property struct {
	ID                 int        `json:"id" db:"id"`                                             // Autoincrement field
	ObjectID           uuid.UUID  `json:"objectId" db:"object_id"`                                // Foreign key to Object
	PropertyTypeID     uuid.UUID  `json:"propertyTypeId" db:"property_type_id"`                   // Foreign key to PropertyType
	Value              *string    `json:"value,omitempty" db:"value"`                             // Optional string value
	ValueNumber        *float64   `json:"valueNumber,omitempty" db:"value_number"`                // Optional numeric value
	ValueBoolean       *bool      `json:"valueBoolean,omitempty" db:"value_boolean"`              // Optional boolean value
	ValueDate          *time.Time `json:"valueDate,omitempty" db:"value_date"`                    // Optional date value
	ReferencedObjectID *uuid.UUID `json:"referencedObjectId,omitempty" db:"referenced_object_id"` // Optional reference to another Object
}
