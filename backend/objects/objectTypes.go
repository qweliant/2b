package objects

import (
	"app/backend/util"

	"github.com/adrg/xdg"
	"go.uber.org/zap"
)

func getObjectTypeFilePath(objectTypeID string) (string, error) {
	filepath, err := xdg.DataFile("liha/ot-" + objectTypeID + ".json")
	if err != nil {
		return "", err
	}
	return filepath, nil
}

func GetAllObjectTypeFiles(logger *zap.Logger) ([]string, error) {
	path := xdg.DataHome + "/liha"
	return util.GetFilesInDir(path, "ot-", ".json", logger)
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
