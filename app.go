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
	return objectsAPI.ReadObjectFile(objectID, a.logger)
}

func (a *App) ReadStateFile() (string, error) {
	return stateAPI.ReadStateFile(a.logger)
}

func (a *App) WriteStateFile(state string) error {
	return stateAPI.WriteStateFile(state, a.logger)
}
