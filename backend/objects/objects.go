package objects

import (
	"app/backend/util"

	"github.com/adrg/xdg"
	"go.uber.org/zap"
)

func getObjectFilePath(objectID string) (string, error) {
	filepath, err := xdg.DataFile("liha/objects/" + objectID + ".json")
	if err != nil {
		return "", err
	}
	return filepath, nil
}

func GetAllObjects(logger *zap.Logger) ([]string, error) {
	path := xdg.DataHome + "/liha/objects"
	return util.GetFilesInDir(path, "", ".json", logger)
}

func ReadObjectFile(objectID string, logger *zap.Logger) (string, error) {
	path, err := getObjectFilePath(objectID)
	if err != nil {
		logger.Error("Error getting object file path", zap.Error(err))
		return "", err
	}
	return util.ReadJSONFile(path, logger)
}

func WriteObjectFile(objectID string, object string, logger *zap.Logger) error {
	path, err := getObjectFilePath(objectID)
	if err != nil {
		logger.Error("Error getting object file path", zap.Error(err))
		return err
	}
	return util.WriteJSONFile(path, object, logger)
}

func DeleteObjectFile(objectID string, logger *zap.Logger) error {
	path, err := getObjectFilePath(objectID)
	if err != nil {
		logger.Error("Error getting object file path", zap.Error(err))
		return err
	}
	return util.DeleteFile(path, logger)
}
