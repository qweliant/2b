package main

import (
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
	path, err := getObjectFilePath(objectID)
	if err != nil {
		a.logger.Error("Error getting object file path", zap.Error(err))
		return "", err
	}
	a.logger.Info("Reading object file", zap.String("path", path))
	return readJSONFile(path)
}
