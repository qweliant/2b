package ai

import (
	"log"

	"github.com/fsnotify/fsnotify"
)

func watchDirectory(watcher *fsnotify.Watcher, directory string, jobChan chan<- string) {
	err := watcher.Add(directory)
	if err != nil {
		log.Fatalf("Failed to add directory to watcher: %v", err)
	}

	for {
		select {
		case event, ok := <-watcher.Events:
			if !ok {
				return
			}
			if event.Op&fsnotify.Create == fsnotify.Create || event.Op&fsnotify.Write == fsnotify.Write {
				log.Printf("Detected file: %s", event.Name)
				jobChan <- event.Name
			}
		case err, ok := <-watcher.Errors:
			if !ok {
				return
			}
			log.Printf("Watcher error: %v", err)
		}
	}
}
