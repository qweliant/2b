import { z } from "zod";
import { create } from "zustand";
import {
  DeleteObjectFile,
  GetAllObjects,
  ReadObjectFile,
  WriteObjectFile,
} from "../../wailsjs/go/main/App";
import { useQueryWrapper } from "./util";
import {
  useQueries,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";

const ContentTypes = z.enum([
  "text",
  "image",
  "video",
  "audio",
  "file",
  "drawing",
  "bookmark",
]);

const ContentTypeSchema = z.object({
  type: ContentTypes,
  content: z.any(),
  id: z.string().uuid(),
  x: z.number().default(0),
  y: z.number().default(0),
  w: z.number().default(0),
  h: z.number().default(0),
});
type ObjectContent = z.infer<typeof ContentTypeSchema>;

const PropertyValueMapSchema = z.record(z.string());

const ObjectInstanceSchema = z.object({
  id: z.string().uuid(),
  type: z.string(),
  title: z.string(),
  description: z.string().optional(),
  contents: z.record(ContentTypeSchema),
  properties: PropertyValueMapSchema,
  aiReady: z.boolean().default(false).optional(),
});

type ObjectInstance = z.infer<typeof ObjectInstanceSchema>;

function useCreateObject() {
  const queryClient = useQueryClient();
  return async (newId: string, newState: Omit<ObjectInstance, "id">) => {
    const newObject: ObjectInstance = {
      ...newState,
      id: newId,
    };
    await WriteObjectFile(newId, JSON.stringify(newObject));
    queryClient.invalidateQueries({
      queryKey: ["objects"],
    });
  };
}

function useAllObjectsIDs() {
  return useQuery<string[]>({
    queryKey: ["objects"],
    queryFn: async () => {
      const result = await GetAllObjects();
      if (result) {
        return result;
      }
      return [];
    },
  });
}

function useAllObjects(ids: string[] | undefined) {
  const objectQueries = useQueries<UseQueryOptions<ObjectInstance>[]>({
    queries: ids
      ? ids.map((id) => ({
          queryKey: ["object", id],
          queryFn: async () => {
            const data = await ReadObjectFile(id);
            const result = ObjectInstanceSchema.safeParse(JSON.parse(data));
            if (result.success) {
              return result.data;
            } else {
              throw result.error.errors;
            }
          },
          retry: 0,
          enabled: !!id,
        }))
      : [],
  });
  return objectQueries;
}

function useObject(id: string) {
  return useQueryWrapper<ObjectInstance>({
    queryKey: ["object", id],
    queryFn: async () => {
      return JSON.parse(await ReadObjectFile(id));
    },
    editFn: (old: ObjectInstance, newState: ObjectInstance) => {
      return { ...old, ...newState };
    },
    mutateFn: (newState: ObjectInstance) => {
      return WriteObjectFile(newState.id, JSON.stringify(newState));
    },
  });
}

function useDeleteObject() {
  const queryClient = useQueryClient();
  return async (id: string) => {
    await DeleteObjectFile(id);
    queryClient.invalidateQueries({
      queryKey: ["objects", "object", id],
    });
  };
}

export type { ObjectInstance, ObjectContent };
export {
  ObjectInstanceSchema,
  ContentTypes,
  useCreateObject,
  useObject,
  useAllObjects,
  useAllObjectsIDs,
  useDeleteObject
};
