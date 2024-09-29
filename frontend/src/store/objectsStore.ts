import { z } from "zod";
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
import { produce } from "immer";

const ContentTypes = z.enum(["text", "image", "file", "drawing", "bookmark"]);

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
  pageCustomization: z.object({
    backgroundColor: z.string().optional(),
    backgroundImage: z.string().optional(),
    defaultFont: z.string().optional(),
    freeDrag: z.boolean().optional(),
  }),
});

type ObjectInstance = z.infer<typeof ObjectInstanceSchema>;

const DEFAULT_OBJECT: ObjectInstance = {
  id: "",
  type: "",
  title: "",
  description: "",
  contents: {},
  properties: {},
  aiReady: false,
  pageCustomization: {
    backgroundColor: "",
    backgroundImage: "",
    defaultFont: "ui-sans-serif",
    freeDrag: false,
  },
};

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

function useDefaultFont(id: string) {
  const { data, mutate } = useObject(id);
  const setDefaultFont = (font: string) => {
    if (!data) {
      return;
    }
    const newData = produce(data, (draft) => {
      draft.pageCustomization.defaultFont = font;
    });
    mutate(newData);
  };
  return {
    defaultFont: data?.pageCustomization.defaultFont ?? "ui-sans-serif",
    setDefaultFont,
  }
}

function useBackgroundColor(id: string) {
  const { data, mutate } = useObject(id);
  const setBackgroundColor = (color: string) => {
    if (!data) {
      return;
    }
    const newData = produce(data, (draft) => {
      draft.pageCustomization.backgroundColor = color;
    });
    mutate(newData);
  };
  return {
    backgroundColor: data?.pageCustomization.backgroundColor ?? "",
    setBackgroundColor,
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
  useDeleteObject,
  useDefaultFont,
  useBackgroundColor,
  DEFAULT_OBJECT,
};
