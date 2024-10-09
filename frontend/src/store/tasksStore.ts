import {
  ObjectInstanceSchema,
  useAllObjects,
  useAllObjectsIDs,
  useCreateObject,
} from "./objectsStore";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import { ReadObjectFile } from "../../wailsjs/go/main/App";
import { useQuery } from "@tanstack/react-query";

const TASK_DUE_DATE_UUID = "4224f22e-a9f4-489c-b49b-00f4d5a05e01";
const TASK_STATUS_UUID = "09148277-0efc-4405-a8a2-d8d777606c35";
const TASK_PRIORITY_UUID = "22163f4f-75c5-40ac-bd5c-32a030d70557";



const TaskStatusEnum = z.enum(["todo", "in-progress", "done"]);

const TaskInstanceSchema = ObjectInstanceSchema.extend({
  properties: z.object({
    [TASK_DUE_DATE_UUID]: z.string(),
    [TASK_STATUS_UUID]: TaskStatusEnum,
    [TASK_PRIORITY_UUID]: z.string(),
  }),
});

type TaskInstance = z.infer<typeof TaskInstanceSchema>;

function useAllTasks() {
  const { data: objectIDs } = useAllObjectsIDs();
  if (!objectIDs) {
    return [];
  }
  const objectQueries = useAllObjects(objectIDs);
  const tasks = objectQueries
    .map((query) => query.data)
    .filter(
      (task): task is TaskInstance => task !== undefined && task.type === "task"
    );
  return tasks;
}

function useCreateTask() {
  const create = useCreateObject();
  return async (
    newState: Omit<
      TaskInstance,
      "id" | "type" | "contents" | "pinned" | "pageCustomization" | "aiReady"
    >
  ) => {
    const newId = uuid();
    const newTask: TaskInstance = {
      ...newState,
      id: newId,
      type: "task",
      contents: {},
      pinned: false,
      pageCustomization: {
        backgroundColor: "",
        backgroundImage: "",
        defaultFont: "ui-sans-serif",
        freeDrag: false,
      },
      aiReady: false,
    };
    await create(newId, newTask);
  };
}

function useTask(id: string) {
  const query = useQuery({
    queryKey: ["object", id],
    queryFn: async () => {
      const data = await ReadObjectFile(id);
      if (data) {
        return JSON.parse(data) as TaskInstance;
      }
    },
  });
  return query;
}

export {
  TASK_DUE_DATE_UUID,
  TASK_STATUS_UUID,
  TASK_PRIORITY_UUID,
  TaskInstanceSchema,
  type TaskInstance,
  useAllTasks,
  useCreateTask,
};
