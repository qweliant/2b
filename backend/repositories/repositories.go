package repositories

import "database/sql"

type Repositories struct {
	ObjectTypeRepository   *ObjectTypeRepository
	PropertyTypeRepository *PropertyTypeRepository
	ObjectRepository       *ObjectRepository
}

func NewRepositories(db *sql.DB) *Repositories {
	return &Repositories{
		ObjectTypeRepository:   NewObjectTypeRepository(db),
		PropertyTypeRepository: NewPropertyTypeRepository(db),
		ObjectRepository:       NewObjectRepository(db),
	}
}
