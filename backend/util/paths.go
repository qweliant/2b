package util

import (
	"path/filepath"

	"github.com/adrg/xdg"
)

const LIHA_FOLDER_NAME = "liha"
const LIHA_DB_NAME = "liha.db"

func GetDataDir() (string, error) {
	return filepath.Join(xdg.DataHome, LIHA_FOLDER_NAME), nil
}
