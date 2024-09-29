import { z } from "zod";

const VisibilitySchema = z.enum(["visible", "hidden", "hidden_empty"]);

const PropertyType = z.enum(["text", "number", "date", "boolean", "object"]);

const BasePropertySchema = z.object({
  type: z.union([PropertyType, z.string()]),
  name: z.string(),
  aiAutomated: z.boolean().optional(),
  visibility: VisibilitySchema.default("visible"),
  icon: z.string().optional(),
  defaultValue: z.any().optional(),
});

const NumberFormats = z.enum(["number", "currency", "percent", "phone"]);

const DateDisplayFormats = z.enum([
  "date",
  "date_time",
  "time",
  "month_year",
  "year",
]);

const PropertySchema = z.union([
  BasePropertySchema.extend({
    type: z.literal("text"),
    name: z.string().default("Text"),
    defaultValue: z.string().optional().default(""),
  }),
  BasePropertySchema.extend({
    type: z.literal("number"),
    format: NumberFormats.default("number"), // Assuming NumberFormats is a Zod schema
    name: z.string().default("Number"),
    defaultValue: z.number().optional().default(0),
  }),
  BasePropertySchema.extend({
    type: z.literal("date"),
    format: DateDisplayFormats, // Assuming DateDisplayFormats is a Zod schema
    name: z.string().default("Date"),
    defaultValue: z.date().optional().default(new Date()),
  }),
  BasePropertySchema.extend({
    type: z.literal("boolean"),
    name: z.string().default("Boolean"),
    defaultValue: z.boolean().optional().default(false),
  }),
  BasePropertySchema.extend({
    type: z.literal("object"),
    name: z.string().default("Object"),
    defaultValue: z.object({}).optional().default({}),
  }),
  BasePropertySchema,
]);

const DEFAULT_PROPERTY_VALUE = PropertySchema.parse({
  type: "text",
  name: "Text",
  visibility: "visible",
  icon: "📝",
});

const PropertyMapSchema = z.record(PropertySchema);

const BaseObjectTypes = z.enum([
  "page",
  "file",
  "video",
  "drawing",
  "task",
  "link",
  "note",
  "tag",
]);

const ObjectTypeSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters long",
  }),
  icon: z.string(),
  baseType: BaseObjectTypes,
  description: z.string().optional(),
  color: z.string(),
  properties: PropertyMapSchema,
});

type ObjectProperty = z.infer<typeof PropertySchema>;
type ObjectPropertyMap = z.infer<typeof PropertyMapSchema>;
type ObjectType = z.infer<typeof ObjectTypeSchema>;
type PropertyTypeEnum = z.infer<typeof PropertyType>;

export type { ObjectProperty, ObjectType, ObjectPropertyMap, PropertyTypeEnum };

export {
  PropertyType,
  BasePropertySchema,
  PropertySchema,
  ObjectTypeSchema,
  DEFAULT_PROPERTY_VALUE,
  //   useObjectTypesStore,
};
