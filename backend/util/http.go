package util

import (
	"fmt"
	"io/ioutil"
	"net/http"
)

func SendRequest(
	url string,
) ([]byte, error) {
	// Create a new HTTP client
	client := &http.Client{}

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		fmt.Println("Error creating request:", err)
		return nil, err
	}

	// Send the request
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error sending request:", err)
		return nil, err
	}
	defer resp.Body.Close()

	// Check for a successful status code
	if resp.StatusCode != http.StatusOK {
		fmt.Println("Error: Status code", resp.StatusCode)
		return nil, fmt.Errorf("Error: Status code %d", resp.StatusCode)
	}

	// Read the response body
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading response body:", err)
		return nil, err
	}
	return body, nil
}
