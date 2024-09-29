package ai

import (
	"fmt"
	"log"
	"net/http"
)

// Handler for the root route "/"
func helloHandler(w http.ResponseWriter, r *http.Request) {
	text := r.URL.Query().Get("text")
	data := summarize(text)
	fmt.Fprintf(w, data)
}

// Handler for the "/greet" route
func greetHandler(w http.ResponseWriter, r *http.Request) {
	name := r.URL.Query().Get("name")
	if name == "" {
		name = "Guest"
	}
	fmt.Fprintf(w, "Hello, %s!", name)
}

func chatHandler(w http.ResponseWriter, r *http.Request) {
	text := r.URL.Query().Get("text")
	data := chat(text)
	fmt.Fprintf(w, data)
}

func StartServer() {
	http.HandleFunc("/summarize", helloHandler)

	http.HandleFunc("/chat", chatHandler)

	// Handle /greet route
	http.HandleFunc("/greet", greetHandler)

	// Start the server on port 8080
	fmt.Println("Server is listening on port 8080...")
	log.Fatal(http.ListenAndServe(":8085", nil))
}
