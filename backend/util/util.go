package util

import (
	"os"

	"go.uber.org/zap"
)

func ReadJSONFile(filename string, logger *zap.Logger) (string, error) {
	logger.Info("Reading file", zap.String("filename", filename))
	file, err := os.ReadFile(filename)
	if err != nil {
		return "", err
	}
	return string(file), nil
}

func WriteJSONFile(filename string, content string, logger *zap.Logger) error {
	logger.Info("Writing file", zap.String("filename", filename))
	err := os.WriteFile(filename, []byte(content), 0644)
	if err != nil {
		return err
	}
	return nil
}

func DeleteFile(filename string, logger *zap.Logger) error {
	logger.Info("Deleting file", zap.String("filename", filename))
	err := os.Remove(filename)
	if err != nil {
		return err
	}
	return nil
}

func hasPrefix(s string, prefix string) bool {
	if len(s) < len(prefix) {
		return false
	}
	return s[:len(prefix)] == prefix
}

func hasSuffix(s string, suffix string) bool {
	if len(s) < len(suffix) {
		return false
	}
	return s[len(s)-len(suffix):] == suffix
}

func hasPrefixAndSuffix(s string, prefix string, suffix string) bool {
	if !hasPrefix(s, prefix) {
		return false
	}
	if !hasSuffix(s, suffix) {
		return false
	}
	return true
}

func GetFilesInDir(dir string, prefix string, suffix string, logger *zap.Logger) ([]string, error) {
	// logger.Info("Getting files in dir", zap.String("dir", dir))
	files, err := os.ReadDir(dir)
	if err != nil {
		return nil, err
	}

	var fileNames []string
	for _, file := range files {
		if file.IsDir() {
			continue
		}
		if !hasPrefixAndSuffix(file.Name(), prefix, suffix) {
			continue
		}
		// remove prefix and suffix
		fileName := file.Name()[len(prefix) : len(file.Name())-len(suffix)]
		fileNames = append(fileNames, fileName)
	}
	logger.Info("Got files in dir", zap.String("dir", dir), zap.Strings("files", fileNames))
	return fileNames, nil
}
