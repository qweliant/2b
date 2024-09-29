import {
  GetAllObjectTypeFiles,
  ReadObjectTypeFile,
  WriteObjectTypeFile,
} from "../../wailsjs/go/main/App";
import { useQueries, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { v4 as uuid } from "uuid";
import { ObjectType, ObjectTypeSchema } from "@/types/objectTypes";
import { create } from "zustand";

const ALL_OBJECT_TYPE_QUERY_KEY = "objectTypes";
const OBJECT_TYPE_QUERY_KEY = "objectType";
function useAllObjectTypesIDs() {
  return useQuery<string[]>({
    queryKey: [ALL_OBJECT_TYPE_QUERY_KEY],
    queryFn: async () => {
      const result = await GetAllObjectTypeFiles();
      if (result) {
        return result;
      }
      return [];
    },
  });
}

function useAllObjectTypes(ids: string[] | undefined) {
  const objectTypeQueries = useQueries<UseQueryOptions<ObjectType>[]>({
    queries: ids
      ? ids.map((id) => ({
          queryKey: [OBJECT_TYPE_QUERY_KEY, id],
          queryFn: async () => {
            const data = await ReadObjectTypeFile(id);
            console.log(data);
            const result = ObjectTypeSchema.safeParse(
              JSON.parse(data)
            );
            if (result.success) {
              console.log(result.data);
              return result.data;
            } else {
              console.log(result.error.errors);
              throw result.error.errors;
            }
          },
          retry: 0,
          enabled: !!id,
        }))
      : [],
  });
  return objectTypeQueries;
}

function useCreateObjectType(newId: string) {
  return async (newState: Omit<ObjectType, "id">) => {
    const newObjectType: ObjectType = {
      ...newState,
      id: newId,
      baseType: "page",
    };
    await WriteObjectTypeFile(newId, JSON.stringify(newObjectType));
  };
}

const useObjectTypesUnsavedStore = create<{
  objectTypesMap: Record<string, ObjectType>;
  addObjectType: (objectType: ObjectType) => void;
  updateObjectType: (objectType: ObjectType) => void;
  deleteObjectType: (objectType: ObjectType) => void;
}>((set) => ({
  objectTypesMap: {},
  addObjectType: (objectType) =>
    set((state) => ({
      objectTypesMap: {
        ...state.objectTypesMap,
        [objectType.id]: objectType,
      },
    })),
  updateObjectType: (objectType) =>
    set((state) => ({
      objectTypesMap: {
        ...state.objectTypesMap,
        [objectType.id]: objectType,
      },
    })),
  deleteObjectType: (objectType) =>
    set((state) => {
      const { [objectType.id]: _, ...rest } = state.objectTypesMap;
      return {
        objectTypesMap: rest,
      };
    }),
}));

export {
  useAllObjectTypesIDs,
  useAllObjectTypes,
  useCreateObjectType,
  useObjectTypesUnsavedStore,
  ALL_OBJECT_TYPE_QUERY_KEY,
  //   useObjectTypesStore,
};
