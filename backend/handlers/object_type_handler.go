package handlers

import (
	"app/backend/models"
	"app/backend/repositories"
	"app/backend/util"

	"github.com/adrg/xdg"
	"go.uber.org/zap"
)

type ObjectTypeHandler struct {
	objectTypeRepository   *repositories.ObjectTypeRepository
	propertyTypeRepository *repositories.PropertyTypeRepository
}

func NewObjectTypeHandler(objectTypeRepository *repositories.ObjectTypeRepository,
	propertyTypeRepository *repositories.PropertyTypeRepository,
) *ObjectTypeHandler {
	return &ObjectTypeHandler{objectTypeRepository, propertyTypeRepository}
}

func getObjectTypeFilePath(objectTypeID string) (string, error) {
	filepath, err := xdg.DataFile("liha/ot-" + objectTypeID + ".json")
	if err != nil {
		return "", err
	}
	return filepath, nil
}

func (o *ObjectTypeHandler) GetAllObjectTypeIDs(logger *zap.Logger) ([]string, error) {
	objectTypeIDs, err := o.objectTypeRepository.GetObjectTypesIDs("")
	if err != nil {
		logger.Error("Error getting object types", zap.Error(err))
		return nil, err
	}
	return objectTypeIDs, nil
}

func (o *ObjectTypeHandler) GetObjectType(objectTypeID string, logger *zap.Logger) (*models.ObjectType, error) {
	objectType, err := o.objectTypeRepository.GetObjectType(objectTypeID)
	if err != nil {
		logger.Error("Error getting object type", zap.Error(err))
		return nil, err
	}
	propertyTypes, err := o.propertyTypeRepository.GetPropertyTypesOfObjectType(objectTypeID)
	if err != nil {
		logger.Error("Error getting property types of object type", zap.Error(err))
		return nil, err
	}
	objectType.PropertyTypes = *propertyTypes
	return objectType, nil
}

func ReadObjectTypeFile(objectTypeID string, logger *zap.Logger) (string, error) {
	path, err := getObjectTypeFilePath(objectTypeID)
	if err != nil {
		return "", err
	}
	return util.ReadJSONFile(path, logger)
}

func WriteObjectTypeFile(objectTypeID string, objectType string, logger *zap.Logger) error {
	path, err := getObjectTypeFilePath(objectTypeID)
	if err != nil {
		logger.Error("Error getting object type file path", zap.Error(err))
		return err
	}
	return util.WriteJSONFile(path, objectType, logger)
}
