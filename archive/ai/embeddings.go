package ai

import (
	"log"
	"os"
	"os/signal"
	"sync"
	"syscall"

	"github.com/fsnotify/fsnotify"
)

// Replace with your actual API key and endpoint
const (
	embeddingAPIURL = "https://api.openai.com/v1/embeddings"
	apiKey          = "YOUR_OPENAI_API_KEY"
)

type EmbeddingRequest struct {
	Input string `json:"input"`
	Model string `json:"model"`
}

type EmbeddingResponse struct {
	Data []struct {
		Embedding []float64 `json:"embedding"`
		Index     int       `json:"index"`
	} `json:"data"`
	Model string `json:"model"`
	Usage struct {
		PromptTokens int `json:"prompt_tokens"`
		TotalTokens  int `json:"total_tokens"`
	} `json:"usage"`
}

func storeEmbedding(filePath string, embedding []float64) error {
	// Store the embedding in a database or file
	return nil
}

func generateEmbedding(filePath string) ([]float64, error) {
	//TODO: Implement embedding generation
	return []float64{}, nil
}

func EmbeddingGenerator() {
	// Directory to watch
	watchDir := "./json_files"

	// Ensure the directory exists
	if _, err := os.Stat(watchDir); os.IsNotExist(err) {
		os.Mkdir(watchDir, 0755)
	}

	// Initialize watcher
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		log.Fatal(err)
	}
	defer watcher.Close()

	// Channels for job queue and results
	jobChan := make(chan string, 100)
	resultChan := make(chan string, 100)

	// Start watching the directory
	go watchDirectory(watcher, watchDir, jobChan)

	// Start worker pool
	numWorkers := 5
	var wg sync.WaitGroup
	for i := 1; i <= numWorkers; i++ {
		wg.Add(1)
		go func(workerID int) {
			defer wg.Done()
			worker(workerID, jobChan, resultChan)
		}(i)
	}

	// Handle graceful shutdown
	done := make(chan struct{})
	go func() {
		sigs := make(chan os.Signal, 1)
		signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)
		<-sigs
		log.Println("Shutting down...")
		close(jobChan)
		wg.Wait()
		close(done)
	}()

	// Optionally handle results
	go func() {
		for filePath := range resultChan {
			log.Printf("Successfully processed: %s", filePath)
		}
	}()

	<-done
	log.Println("Exited gracefully")
}
