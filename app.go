package main

import (
	"app/ai"
	objectsAPI "app/backend/objects"
	stateAPI "app/backend/state"
	"app/backend/util"
	"context"
	"fmt"
	"net/url"

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
	go ai.StartServer()

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

func (a *App) GetSummary(text string) (string, error) {
	a.logger.Info("Getting summary for", zap.String("text", text))
	baseURL := "http://localhost:8085/summarize?text="
	// URL-encode the query string to make it safe
	encodedQuery := url.QueryEscape(text)

	// Build the full URL with the encoded query
	fullURL := fmt.Sprintf("%s?text=%s", baseURL, encodedQuery)

	summary, err := util.SendRequest(fullURL)
	if err != nil {
		a.logger.Error("Error getting summary", zap.Error(err))
		return "", err
	}
	return string(summary), nil
}

func (a *App) GetChat(text string) (string, error) {
	a.logger.Info("Getting chat for", zap.String("text", text))
	baseURL := "http://localhost:8085/chat"
	// URL-encode the query string to make it safe
	encodedQuery := url.QueryEscape(text)

	// Build the full URL with the encoded query
	fullURL := fmt.Sprintf("%s?text=%s", baseURL, encodedQuery)
	// Build the full URL with the encoded query

	chat, err := util.SendRequest(fullURL)
	if err != nil {
		a.logger.Error("Error getting chat", zap.Error(err))
		return "", err
	}
	return string(chat), nil
}
