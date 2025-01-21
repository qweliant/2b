package util

import (
	"fmt"
	"path/filepath"

	"github.com/adrg/xdg"
)

const LIHA_FOLDER_NAME = "liha"
const LIHA_DB_NAME = "liha.db"

func GetDataDir() (string, error) {
	fmt.Printf("Kiha is %s", filepath.Join(xdg.DataHome, LIHA_FOLDER_NAME))
	return filepath.Join(xdg.DataHome, LIHA_FOLDER_NAME), nil
}
