import dynamicIconImports from "lucide-react/dynamicIconImports";
import { z } from "zod";
import { create } from "zustand";


const ContentTypes = z.enum(["text", "image", "video", "drawing"]);

const BasePropertyType = z.object({
  type: z.string(),
  value: z.any(),
});

const PropertyTypes = z.union([
  BasePropertyType.merge(
    z.object({ type: z.literal("text"), value: z.string() })
  ),
  BasePropertyType.merge(
    z.object({ type: z.literal("number"), value: z.number() })
  ),
  BasePropertyType.merge(
    z.object({ type: z.literal("date"), value: z.string() })
  ),
  BasePropertyType.merge(
    z.object({ type: z.literal("boolean"), value: z.boolean() })
  ),
  BasePropertyType.merge(
    z.object({ type: z.literal("object"), value: z.string().uuid() })
  ),
]);

const ObjectTypeSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  icon: z.custom<keyof typeof dynamicIconImports>(),
  description: z.string().optional(),
  color: z.string(),
  properties: z.array(z.object({ name: z.string(), type: PropertyTypes })),
});

const ObjectInstanceSchema = z.object({
  id: z.string().uuid(),
  type: z.string(),
  title: z.string(),
  description: z.string().optional(),
  contents: z.array(ContentTypes),
  properties: z.record(PropertyTypes),
});

type ObjectInstance = z.infer<typeof ObjectInstanceSchema>;
type ObjectContent = z.infer<typeof ContentTypes>;
type ObjectProperty = z.infer<typeof PropertyTypes>;
type ObjectType = z.infer<typeof ObjectTypeSchema>;

const useObjectTypesStore = create<{
  objectTypes: Record<string, ObjectType>;
  addObjectType: (objectType: ObjectType) => void;
}>((set) => ({
  objectTypes: {
    '1': {
      id: "1",
      name: "Test",
      icon: 'airplay',
      description: "A simple text object",
      color: "#FFB6C1",
      properties: [
        { name: "text", type: { type: "text", value: "" } },
      ],
    },
  },
  addObjectType: (objectType) =>
    set((state) => ({
      objectTypes: { ...state.objectTypes, [objectType.id]: objectType },
    })),
}));

const useObjectsStore = create<{
  objects: Record<string, ObjectInstance>;
  addObject: (object: ObjectInstance) => void;
}>((set) => ({
  objects: {},
  addObject: (object) =>
    set((state) => ({
      objects: { ...state.objects, [object.id]: object },
    })),
}));

export type { ObjectInstance, ObjectContent, ObjectProperty, ObjectType };
export {
  useObjectsStore,
  ObjectInstanceSchema,
  useObjectTypesStore,
  ObjectTypeSchema,
};
