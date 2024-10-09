package models

import (
	"github.com/google/uuid"
)

type BaseObjectType string
type BasePropertyType string

const (
	BasePropertyTypeString  BasePropertyType = "String"
	BasePropertyTypeNumber  BasePropertyType = "Number"
	BasePropertyTypeBoolean BasePropertyType = "Boolean"
	BasePropertyTypeDate    BasePropertyType = "Date"
	BasePropertyTypeObject  BasePropertyType = "Object"
)

const (
	BaseObjectTypeA BaseObjectType = "TypeA"
	BaseObjectTypeB BaseObjectType = "TypeB"
	BaseObjectTypeC BaseObjectType = "TypeC"
)

type ObjectType struct {
	ID             uuid.UUID      `json:"id" db:"id"`
	Name           string         `json:"name" db:"name"`
	Description    string         `json:"description" db:"description"`
	Color          string         `json:"color" db:"color"`
	Icon           string         `json:"icon" db:"icon"`
	Fixed          bool           `json:"fixed" db:"fixed"`
	BaseObjectType BaseObjectType `json:"baseType" db:"base_object_type"`
	PropertyTypes  []PropertyType `json:"properties" db:"-"` // derived field
}

type PropertyType struct {
	ID                uuid.UUID        `json:"id" db:"id"`
	Type              BasePropertyType `json:"type" db:"type"`
	Name              string           `json:"name" db:"name"`
	AIAutomated       bool             `json:"aiAutomated" db:"ai_automated"`
	Visibility        string           `json:"visibility" db:"visibility"`
	Icon              string           `json:"icon" db:"icon"`
	DefaultValue      string           `json:"defaultValue" db:"default_value"`
	IsObjectReference bool             `json:"isObjectReference" db:"is_object_reference"`
	ObjectTypeID      *uuid.UUID       `json:"objectTypeId,omitempty" db:"object_type_id"`
}
