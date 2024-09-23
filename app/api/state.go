package api

import (
	"context"
	"os"

	"go.uber.org/zap"
)

type App struct {
	logger *zap.Logger
	ctx    context.Context
}

func (a *App) ReadStateFile() (string, error) {
	var state string
	path, err := getStateFilePath()
	if err != nil {
		a.logger.Error("Error getting state file path", zap.Error(err))
		return state, err
	}
	a.logger.Info("Reading state file", zap.String("path", path))
	content, err := readJSONFile(path)
	if err != nil {
		a.logger.Error("Error reading state file", zap.Error(err))
		a.logger.Info("Creating default state")
		os.WriteFile(path, []byte(DEFAULT_UI_STATE), 0644)
		return DEFAULT_UI_STATE, nil
	}
	// err = json.Unmarshal([]byte(content), &state)
	// if err != nil {
	// 	a.logger.Error("Error unmarshalling state", zap.Error(err))
	// 	return state, err
	// }
	return content, nil
}

func (a *App) WriteStateFile(state string) error {
	path, err := getStateFilePath()
	if err != nil {
		a.logger.Error("Error getting state file path", zap.Error(err))
		return err
	}
	a.logger.Info("Writing state file", zap.String("path", path), zap.String("state", state))
	// data, err := json.Marshal(state)
	// if err != nil {
	// 	a.logger.Error("Error marshalling state", zap.Error(err))
	// 	return err
	// }
	err = os.WriteFile(path, []byte(state), 0644)
	if err != nil {
		a.logger.Error("Error writing state file", zap.Error(err))
		return err
	}
	return nil
}
