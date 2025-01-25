package handlers

import (
	"app/backend/models"
	"app/backend/repositories"
	"app/backend/util"
	"fmt"
	"os"
	"strings"

	"go.uber.org/zap"
)

type ObjectHandler struct {
	objectRepository       *repositories.ObjectRepository
	propertyTypeRepository *repositories.PropertyTypeRepository
}

func NewObjectHandler(
	objectRepository *repositories.ObjectRepository,
	propertyTypeRepository *repositories.PropertyTypeRepository,
) *ObjectHandler {
	return &ObjectHandler{objectRepository, propertyTypeRepository}
}

// sanitizeTitle removes unwanted characters and replaces spaces with underscores.
func sanitizeTitle(title string) string {
	// Replace spaces with underscores
	title = strings.ReplaceAll(title, " ", "_")
	// Remove all characters that are not letters, digits, underscores, or hyphens
	sanitized := strings.Map(func(r rune) rune {
		if (r >= 'a' && r <= 'z') || (r >= 'A' && r <= 'Z') || (r >= '0' && r <= '9') || r == '_' || r == '-' {
			return r
		}
		return -1
	}, title)
	return sanitized
}

// DEPRECATED

func getObjectFilePath(title string) (string, error) {
	// Define the base path for your content directory
	basePath := "/Users/qwelian/Programs/apps/blog/content/"

	// Sanitize the title
	title = sanitizeTitle(title)

	// Combine the base path and title with the desired file extension
	filePath := basePath + title + ".json"

	// Check if the directory exists
	if _, err := os.Stat(basePath); os.IsNotExist(err) {
		return "", fmt.Errorf("base path does not exist: %s", basePath)
	}

	return filePath, nil
}

func (o *ObjectHandler) GetAllObjectIDs(logger *zap.Logger) ([]string, error) {
	objectIDs, err := o.objectRepository.GetObjectIDs("")
	if err != nil {
		logger.Error("Error getting objects", zap.Error(err))
		return nil, err
	}
	return objectIDs, nil
}

func (o *ObjectHandler) CreateObject(object *models.Object, logger *zap.Logger) error {
	objectTypeId := object.ObjectTypeID
	propertyTypes, err := o.propertyTypeRepository.GetPropertyTypesOfObjectType(objectTypeId)
	if err != nil {
		logger.Error("Error getting property types of object type", zap.Error(err))
		return err
	}
	err = o.objectRepository.CreateObject(object, propertyTypes)
	if err != nil {
		logger.Error("Error creating object", zap.Error(err))
		return err
	}
	// Create the properties of the object
	return nil
}

func (o *ObjectHandler) GetObject(objectID string, logger *zap.Logger) (*models.Object, error) {
	object, err := o.objectRepository.GetObject(objectID)
	if err != nil {
		logger.Error("Error getting object", zap.Error(err))
		return nil, err
	}
	return &object, nil
}

func (o *ObjectHandler) UpdateObject(object *models.Object, logger *zap.Logger) error {
	objectTypeId := object.ObjectTypeID
	propertyTypes, err := o.propertyTypeRepository.GetPropertyTypesOfObjectType(objectTypeId)
	if err != nil {
		logger.Error("Error getting property types of object type", zap.Error(err))
		return err
	}
	err = o.objectRepository.UpdateObject(object, propertyTypes)
	if err != nil {
		logger.Error("Error updating object", zap.Error(err))
		return err
	}
	return nil
}

func (o *ObjectHandler) GetRepository() *repositories.ObjectRepository {
	return o.objectRepository
}

func ReadObjectFile(objectID string, logger *zap.Logger) (string, error) {
	path, err := getObjectFilePath(objectID)
	if err != nil {
		logger.Error("Error getting object file path", zap.Error(err))
		return "", err
	}
	return util.ReadJSONFile(path, logger)
}

func WriteObjectFile(id string, markdown string, title string, logger *zap.Logger) error {
	path, err := getObjectFilePath(title)
	if err != nil {
		logger.Error("Error getting object file path", zap.Error(err))
		return err
	}

	markdownPath := strings.Replace(path, ".json", ".mdx", 1)

	err = os.WriteFile(markdownPath, []byte(markdown), 0644)
	if err != nil {
		logger.Error("Error writing markdown file", zap.Error(err))
		return err
	}

	logger.Info("Exported to", zap.String("path", markdownPath))
	fmt.Printf("\n\nExported to: %s\n\n", markdownPath)
	return nil
}

func DeleteObjectFile(objectID string, logger *zap.Logger) error {
	path, err := getObjectFilePath(objectID)
	if err != nil {
		logger.Error("Error getting object file path", zap.Error(err))
		return err
	}
	return util.DeleteFile(path, logger)
}

func (o *ObjectHandler) GetRecentObjectsOfType(objectTypeID string, logger *zap.Logger) ([]string, error) {
	objectIDs, err := o.objectRepository.GetRecentObjectsOfType(objectTypeID)
	if err != nil {
		logger.Error("Error getting recent objects of type", zap.Error(err))
		return nil, err
	}
	return objectIDs, nil
}
