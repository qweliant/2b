CREATE TABLE
  IF NOT EXISTS object_type (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    color TEXT NOT NULL,
    icon TEXT NOT NULL,
    fixed BOOLEAN NOT NULL,
    base_object_type TEXT NOT NULL, -- This could be an ENUM or TEXT field
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  IF NOT EXISTS property_type (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL, -- ENUM-like behavior can be handled in the application
    name TEXT NOT NULL,
    ai_automated BOOLEAN NOT NULL DEFAULT FALSE,
    visibility TEXT,
    icon TEXT,
    default_value TEXT,
    is_object_reference BOOLEAN DEFAULT FALSE, -- Indicates if this property is an object reference
    object_type_id TEXT REFERENCES object_type (id) ON DELETE SET NULL -- Foreign key to object_type, allows referencing an object
  );

CREATE TABLE
  IF NOT EXISTS object (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT,
    icon TEXT,
    fixed BOOLEAN NOT NULL DEFAULT FALSE,
    object_type_id TEXT REFERENCES object_type (id) ON DELETE CASCADE, -- Foreign key to object_type
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  IF NOT EXISTS property (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    object_id TEXT REFERENCES object (id) ON DELETE CASCADE, -- Foreign key to object
    property_type_id TEXT REFERENCES property_type (id) ON DELETE CASCADE, -- Foreign key to property_type
    value TEXT,
    value_number REAL,
    value_boolean BOOLEAN DEFAULT FALSE,
    value_date DATETIME,
    referenced_object_id TEXT REFERENCES object (id) ON DELETE SET NULL -- Optional: references another object if this property is an object reference
  );