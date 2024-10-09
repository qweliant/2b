import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../ui/accordion";
import { Checkbox } from "../../../ui/checkbox";
import { Badge } from "../../../ui/badge";
import { cn } from "@/lib/utils";
import {
  TASK_DUE_DATE_UUID,
  TASK_PRIORITY_UUID,
  TASK_STATUS_UUID,
  useAllTasks,
} from "@/store/tasksStore";
import { getPriorityFromId } from "@/store/tagsStore";
import { Separator } from "../../../ui/separator";
import { ScrollArea } from "../../../ui/scroll-area";
import { humanizeDate } from "@/lib/time";
import { motion, AnimatePresence } from "framer-motion";
import { useObject } from "../../../../store/objectsStore";
import { produce } from "immer";
const Todo = ({ id }: { id: string }) => {
  const { data, mutate } = useObject(id);
  const onCheckedChange = (value: boolean) => {
    if (!data) return;
    const newData = produce(data, (draft) => {
      draft.properties[TASK_STATUS_UUID] = value ? "done" : "todo";
    });
    mutate(newData);
  };
  if (!data) return null;
  const checked = data.properties[TASK_STATUS_UUID] === "done";
  const title = data.title;
  const description = data.description ?? "";
  const priority = getPriorityFromId(data.properties[TASK_PRIORITY_UUID]);
  const isOverdue =
    new Date(data.properties[TASK_DUE_DATE_UUID]).toDateString() <
    new Date().toDateString();
  const time = humanizeDate(data.properties[TASK_DUE_DATE_UUID], false);
  return (
    <div
      className={cn(
        checked ? "opacity-50" : "",
        "flex justify-between items-center"
      )}
    >
      <div className="flex flex-col gap-2">
        <div className="flex gap-4 items-center">
          <Checkbox
            checked={checked}
            onCheckedChange={(value) => {
              onCheckedChange(value as boolean);
            }}
          />
          <p
            className={cn(
              "text-base",
              checked ? "line-through" : "",
              isOverdue ? "text-red-500" : "text-primary"
            )}
          >
            {title}
            <p className="text-sm text-muted-foreground">{description}</p>
          </p>
        </div>
      </div>
      <div className="align-middle items-end flex flex-col gap-1">
        {priority === "Low" && (
          <Badge className="bg-green-500">{priority}</Badge>
        )}
        {priority === "Medium" && (
          <Badge className="bg-purple-500">{priority}</Badge>
        )}
        {priority === "High" && (
          <Badge className="bg-red-500">{priority}</Badge>
        )}
        {new Date(data.properties[TASK_DUE_DATE_UUID]).toDateString() !==
          new Date().toDateString() && (
          <p className="text-muted-foreground">{time}</p>
        )}
      </div>
    </div>
  );
};
const WeekList = () => {
  const tasks = useAllTasks();
  const doneTasks = tasks.filter(
    (task) => task.properties[TASK_STATUS_UUID] === "done"
  );

  const todaysTasks = tasks.filter(
    (task) =>
      new Date(task.properties[TASK_DUE_DATE_UUID]).toDateString() ===
        new Date().toDateString() && !doneTasks.includes(task)
  );

  const tomorrowTasks = tasks.filter(
    (task) =>
      new Date(task.properties[TASK_DUE_DATE_UUID]).toDateString() ===
        new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toDateString() &&
      !todaysTasks.includes(task) &&
      !doneTasks.includes(task)
  );
  const overdueTasks = tasks.filter(
    (task) =>
      new Date(task.properties[TASK_DUE_DATE_UUID]) < new Date() &&
      !todaysTasks.includes(task) &&
      !doneTasks.includes(task)
  );
  const upcomingTasks = tasks.filter(
    (task) =>
      new Date(task.properties[TASK_DUE_DATE_UUID]) > new Date() &&
      !todaysTasks.includes(task) &&
      !overdueTasks.includes(task) &&
      !tomorrowTasks.includes(task) &&
      !doneTasks.includes(task)
  );

  return (
    <>
      <Accordion type="multiple" defaultValue={["overdue", "today"]}>
        <AccordionItem value="overdue">
          <AccordionTrigger className="text-xl">
            <div className="flex items-center gap-2 justify-between w-[12%]">
              <p>Overdue</p>
              <Badge className="bg-primary">{overdueTasks.length}</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-1">
            <ScrollArea className="flex flex-col py-1 px-4">
              <AnimatePresence>
                {overdueTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    {index !== 0 && <Separator className="my-3" />}
                    <Todo id={task.id} key={task.id} />
                  </motion.div>
                ))}
              </AnimatePresence>
              {overdueTasks.length === 0 && (
                <p className="text-muted-foreground text-center">
                  Hooraay! No overdue tasks
                </p>
              )}
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="today">
          <AccordionTrigger className="text-xl">
            <div className="flex items-center gap-2 justify-between w-[12%]">
              <p>Today</p>
              <Badge className="bg-primary">{todaysTasks.length}</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-1">
            <ScrollArea className="flex flex-col py-2 px-4">
              <AnimatePresence>
                {todaysTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="mb-2"
                  >
                    {index !== 0 && <Separator className="my-2" />}
                    <Todo id={task.id} key={task.id} />
                  </motion.div>
                ))}
              </AnimatePresence>
              {todaysTasks.length === 0 && (
                <p className="text-muted-foreground text-center">
                  No tasks for today
                </p>
              )}
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="tomorrow">
          <AccordionTrigger className="text-xl">
            <div className="flex items-center gap-2 justify-between w-[12%]">
              <p>Tomorrow</p>
              <Badge className="bg-primary">{tomorrowTasks.length}</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ScrollArea className="flex flex-col py-2 px-4">
              <AnimatePresence>
                {tomorrowTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="mb-2"
                  >
                    {index !== 0 && <Separator className="my-2" />}
                    <Todo id={task.id} key={task.id} />
                  </motion.div>
                ))}
              </AnimatePresence>
              {tomorrowTasks.length === 0 && (
                <p className="text-muted-foreground text-center">
                  No tasks for tomorrow
                </p>
              )}
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="week">
          <AccordionTrigger className="text-xl">
            <div className="flex items-center gap-2 justify-between w-[12%]">
              <p>Upcoming</p>
              <Badge className="bg-primary">{upcomingTasks.length}</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-1">
            <ScrollArea className="flex flex-col py-2 px-4">
              <AnimatePresence>
                {upcomingTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="mb-2"
                  >
                    {index !== 0 && <Separator className="my-2" />}
                    <Todo id={task.id} key={task.id} />
                  </motion.div>
                ))}
              </AnimatePresence>
              {upcomingTasks.length === 0 && (
                <p className="text-muted-foreground text-center">
                  No upcoming tasks
                </p>
              )}
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="done">
          <AccordionTrigger className="text-xl">
            <div className="flex items-center gap-2 justify-between w-[12%]">
              <p>Done</p>
              <Badge className="bg-primary">{doneTasks.length}</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-1">
            <ScrollArea className="flex flex-col py-2 px-4">
              <AnimatePresence>
                {doneTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="mb-2"
                  >
                    {index !== 0 && <Separator className="my-2" />}
                    <Todo id={task.id} key={task.id} />
                  </motion.div>
                ))}
              </AnimatePresence>
              {doneTasks.length === 0 && (
                <p className="text-muted-foreground text-center">
                  No tasks done yet
                </p>
              )}
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
      </Accordion>{" "}
    </>
  );
};

export default WeekList;
