package api

import "github.com/adrg/xdg"

func getObjectFilePath(objectID string) (string, error) {
	filepath, err := xdg.DataFile("liha/" + objectID + ".json")
	if err != nil {
		return "", err
	}
	return filepath, nil
}

func getStateFilePath() (string, error) {
	filepath, err := xdg.DataFile("liha/state.json")
	if err != nil {
		return "", err
	}
	return filepath, nil
}
