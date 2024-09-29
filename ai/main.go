package ai

import (
	"fmt"
	"log"
	"net/http"
)

// Handler for the root route "/"
func helloHandler(w http.ResponseWriter, r *http.Request) {
	summarize()
}

// Handler for the "/greet" route
func greetHandler(w http.ResponseWriter, r *http.Request) {
	name := r.URL.Query().Get("name")
	if name == "" {
		name = "Guest"
	}
	fmt.Fprintf(w, "Hello, %s!", name)
}

func StartServer() {
	// Handle root route
	http.HandleFunc("/", helloHandler)

	// Handle /greet route
	http.HandleFunc("/greet", greetHandler)

	// Start the server on port 8080
	fmt.Println("Server is listening on port 8080...")
	log.Fatal(http.ListenAndServe(":8085", nil))
}
