package db

import (
	"database/sql"
	"log"
	"os"
)

func CreateTables(db *sql.DB) {
	// Read the SQL file
	sqlFile, err := os.ReadFile("./backend/db/tables.sql")
	if err != nil {
		log.Fatalf("Failed to read SQL file: %v", err)
	}

	// Execute the SQL commands
	_, err = db.Exec(string(sqlFile))
	if err != nil {
		log.Fatalf("Failed to execute SQL commands: %v", err)
	}
}

func PopulateObjects(db *sql.DB) {
	// Read the SQL file
	sqlFile, err := os.ReadFile("./objects.sql")
	if err != nil {
		log.Fatalf("Failed to read SQL file: %v", err)
	}

	// Execute the SQL commands
	_, err = db.Exec(string(sqlFile))
	if err != nil {
		log.Fatalf("Failed to execute SQL commands: %v", err)
	}
}
