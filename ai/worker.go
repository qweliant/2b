package ai

import (
	"log"
)

func worker(id int, jobChan <-chan string, resultChan chan<- string) {
	for filePath := range jobChan {
		log.Printf("Worker %d processing file: %s", id, filePath)
		embedding, err := generateEmbedding(filePath)
		if err != nil {
			log.Printf("Error generating embedding for %s: %v", filePath, err)
			continue
		}
		// Store the embedding
		err = storeEmbedding(filePath, embedding)
		if err != nil {
			log.Printf("Error storing embedding for %s: %v", filePath, err)
			continue
		}
		resultChan <- filePath
	}
}
