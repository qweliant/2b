package ai

import (
	"context"
	"fmt"
	"log"

	"github.com/tmc/langchaingo/llms"
	"github.com/tmc/langchaingo/llms/openai"
)

// Set OPEN AI URL and API KEY using environment variables
// set the environment variables in the code

func summarize() {
	llm, err := openai.New(
		openai.WithBaseURL("http://localhost:1234/v1"),
		openai.WithToken("your-api-key-here"),
	)
	if err != nil {
		log.Fatal(err)
	}
	ctx := context.Background()
	completion, err := llm.Call(ctx, "Hello there, how do you do?",
		llms.WithTemperature(0.8),
	)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(completion)
}
