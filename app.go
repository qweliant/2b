package main

import (
	objectsAPI "app/backend/objects"
	stateAPI "app/backend/state"
	"context"

	"go.uber.org/zap"
)

// App struct
type App struct {
	ctx    context.Context
	logger *zap.Logger
}

// NewApp creates a new App application struct
func NewApp() *App {
	logger := zap.Must(zap.NewDevelopment())
	logger.Info("Creating App Struct")
	defer logger.Sync()
	// go ai.StartServer()

	return &App{
		logger: logger,
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) ReadObjectFile(objectID string) (string, error) {
	data, err := objectsAPI.ReadObjectFile(objectID, a.logger)
	if err != nil {
		return "", err
	}
	return data, nil
}

func (a *App) WriteObjectFile(objectID string, object string) error {
	err := objectsAPI.WriteObjectFile(objectID, object, a.logger)
	if err != nil {
		a.logger.Error("Error writing object file", zap.Error(err))
		return err
	}
	return nil
}

func (a *App) DeleteObjectFile(objectID string) error {
	err := objectsAPI.DeleteObjectFile(objectID, a.logger)
	if err != nil {
		a.logger.Error("Error deleting object file", zap.Error(err))
		return err
	}
	return nil
}

func (a *App) GetAllObjects() ([]string, error) {
	data, err := objectsAPI.GetAllObjects(a.logger)
	if err != nil {
		a.logger.Error("Error getting all objects", zap.Error(err))
		return nil, err
	}
	return data, nil
}

func (a *App) ReadStateFile() (string, error) {
	data, err := stateAPI.ReadStateFile(a.logger)
	if err != nil {
		return "", err
	}
	return data, nil
}

func (a *App) WriteStateFile(state string) error {
	err := stateAPI.WriteStateFile(state, a.logger)
	if err != nil {
		a.logger.Error("Error writing state file", zap.Error(err))
		return err
	}
	return nil
}

func (a *App) ReadObjectTypeFile(objectTypeID string) (string, error) {
	data, err := objectsAPI.ReadObjectTypeFile(objectTypeID, a.logger)
	if err != nil {
		a.logger.Error("Error reading object type file", zap.Error(err))
		return "", err
	}
	a.logger.Info(data)
	return data, nil
}

func (a *App) WriteObjectTypeFile(objectTypeID string, objectType string) error {
	err := objectsAPI.WriteObjectTypeFile(objectTypeID, objectType, a.logger)
	if err != nil {
		a.logger.Error("Error writing object type file", zap.Error(err))
		return err
	}
	return nil
}

func (a *App) GetAllObjectTypeFiles() ([]string, error) {
	data, err := objectsAPI.GetAllObjectTypeFiles(a.logger)
	if err != nil {
		a.logger.Error("Error getting all object type files", zap.Error(err))
		return nil, err
	}
	return data, nil
}
