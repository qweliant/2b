package handlers

import (
	"app/backend/repositories"
)

type Handlers struct {
	ObjectTypeHandler *ObjectTypeHandler
	ObjectHandler     *ObjectHandler
}

func NewHandlers(repositories *repositories.Repositories) *Handlers {
	return &Handlers{
		ObjectTypeHandler: NewObjectTypeHandler(
			repositories.ObjectTypeRepository,
			repositories.PropertyTypeRepository,
		),
		ObjectHandler: NewObjectHandler(
			repositories.ObjectRepository,
			repositories.PropertyTypeRepository,
		),
	}
}
