package ai

import (
	"context"
	"log"

	"github.com/tmc/langchaingo/llms"
	"github.com/tmc/langchaingo/llms/openai"
)

// Set OPEN AI URL and API KEY using environment variables
// set the environment variables in the code

func chat(text string) string {
	llm, err := openai.New(
		openai.WithBaseURL("http://localhost:1234/v1"),
		openai.WithToken("your-api-key-here"),
	)
	if err != nil {
		log.Fatal(err)
	}
	ctx := context.Background()
	content := []llms.MessageContent{
		llms.TextParts(llms.ChatMessageTypeSystem, "You are an helpful assistant. Here is the previous conversation and now you will work with the user to give a proper answer. Maybe the previous conversation and new message are not related so try you best to reply then with your own knowledge"),
		llms.TextParts(llms.ChatMessageTypeHuman, text),
	}
	res := ""
	completion, err := llm.GenerateContent(ctx, content, llms.WithStreamingFunc(func(ctx context.Context, chunk []byte) error {
		res += string(chunk)
		return nil
	}))
	if err != nil {
		log.Fatal(err)
	}
	return completion.Choices[0].Content
}
