package ai

import (
	"context"
	"log"

	"github.com/tmc/langchaingo/llms"
	"github.com/tmc/langchaingo/llms/openai"
)

// Set OPEN AI URL and API KEY using environment variables
// set the environment variables in the code

func summarize(text string) string {
	llm, err := openai.New(
		openai.WithBaseURL("http://localhost:1234/v1"),
		openai.WithToken("your-api-key-here"),
	)
	if err != nil {
		log.Fatal(err)
	}
	ctx := context.Background()
	prompt := "Summarize the following text (keep it short): \n\n" + text
	completion, err := llm.Call(ctx, prompt,
		llms.WithTemperature(0.8),
	)
	if err != nil {
		log.Fatal(err)
	}
	return completion
}
