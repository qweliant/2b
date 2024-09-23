package objects

import (
	"app/backend/util"

	"github.com/adrg/xdg"
	"go.uber.org/zap"
)

func getObjectFilePath(objectID string) (string, error) {
	filepath, err := xdg.DataFile("liha/" + objectID + ".json")
	if err != nil {
		return "", err
	}
	return filepath, nil
}
func ReadObjectFile(objectID string, logger *zap.Logger) (string, error) {
	path, err := getObjectFilePath(objectID)
	if err != nil {
		logger.Error("Error getting object file path", zap.Error(err))
		return "", err
	}
	logger.Info("Reading object file", zap.String("path", path))
	return util.ReadJSONFile(path)
}
