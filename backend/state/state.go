package state

import (
	"os"

	"app/backend/util"

	"github.com/adrg/xdg"
	"go.uber.org/zap"
)

const DEFAULT_UI_STATE = `{"isSidebarOpen":true, "tabsState": {"tabs": []}}`

func getStateFilePath() (string, error) {
	filepath, err := xdg.DataFile("liha/state.json")
	if err != nil {
		return "", err
	}
	return filepath, nil
}

func ReadStateFile(logger *zap.Logger) (string, error) {
	var state string
	path, err := getStateFilePath()
	if err != nil {
		logger.Error("Error getting state file path", zap.Error(err))
		return state, err
	}
	content, err := util.ReadJSONFile(path, logger)
	if err != nil {
		logger.Error("Error reading state file", zap.Error(err))
		logger.Info("Creating default state")
		os.WriteFile(path, []byte(DEFAULT_UI_STATE), 0644)
		return DEFAULT_UI_STATE, nil
	}
	return content, nil
}

func WriteStateFile(state string, logger *zap.Logger) error {
	path, err := getStateFilePath()
	if err != nil {
		logger.Error("Error getting state file path", zap.Error(err))
		return err
	}
	err = util.WriteJSONFile(path, state, logger)
	if err != nil {
		logger.Error("Error writing state file", zap.Error(err))
		return err
	}
	return nil
}
