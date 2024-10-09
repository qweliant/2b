package handlers

import (
	"app/backend/repositories"
)

type Handlers struct {
	ObjectTypeHandler *ObjectTypeHandler
}

func NewHandlers(repositories *repositories.Repositories) *Handlers {
	return &Handlers{
		ObjectTypeHandler: NewObjectTypeHandler(
			repositories.ObjectTypeRepository,
			repositories.PropertyTypeRepository,
		),
	}
}
