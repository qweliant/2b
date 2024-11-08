-- CREATE TABLE
--   IF NOT EXISTS object_type (
--     id UUID PRIMARY KEY,
--     name TEXT NOT NULL,
--     description TEXT NOT NULL,
--     color TEXT NOT NULL,
--     icon TEXT NOT NULL,
--     fixed BOOLEAN NOT NULL,
--     base_object_type TEXT NOT NULL, -- This could be an ENUM or TEXT field
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
--   );

-- CREATE TABLE
--   IF NOT EXISTS property_type (
--     id UUID PRIMARY KEY,
--     type TEXT NOT NULL, -- ENUM-like behavior can be handled in the application
--     ai_automated BOOLEAN,
--     visibility TEXT,
--     icon TEXT,
--     default_value TEXT,
--     is_object_reference BOOLEAN DEFAULT FALSE, -- Indicates if this property is an object reference
--     object_type_id UUID REFERENCES object_type (id) ON DELETE SET NULL -- Foreign key to object_type, allows referencing an object
--   );
-- Use the above table schema as refernece and create the following object type: 

-- {
--   "name": "Tag",
--   "icon": "",
--   "baseType": "tag",
--   "description": "Tags are used to tag all kinds of objects",
--   "color": "",
--   "properties": {
--     "ae29371b-1de4-4d3e-98f1-7328c76f562f": {
--       "type": "text",
--       "name": "Label",
--       "visibility": "visible",
--       "icon": "📝",
--       "defaultValue": ""
--     },
--     "fbd4bea1-0a76-4eb0-8d1b-91cc287ec934": {
--       "type": "text",
--       "name": "Description",
--       "visibility": "visible",
--       "icon": "📝",
--       "defaultValue": ""
--     }
--   },
--   "fixed": true,
--   "id": "25783033-91c1-40ec-88a4-b70ae302a7d0"
-- }
-- USE SQLLITE SYNTAX TO INSERT THE OBJECT TYPE INTO THE OBJECT_TYPE TABLE

INSERT INTO object_type (id, name, description, color, icon, fixed, base_object_type) VALUES ('25783033-91c1-40ec-88a4-b70ae302a7d0', 'Tag', 'Tags are used to tag all kinds of objects', '', '', 1, 'tag');
INSERT INTO property_type (id, type, name, visibility, icon, default_value, ai_automated, object_type_id) VALUES ('ae29371b-1de4-4d3e-98f1-7328c76f562f', 'text', 'Label', 'visible', '📝', '', 1, '25783033-91c1-40ec-88a4-b70ae302a7d0');
-- Delete the above inserted property type
DELETE FROM property_type WHERE id = 'ae29371b-1de4-4d3e-98f1-7328c76f562f';