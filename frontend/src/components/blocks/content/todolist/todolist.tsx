import { Separator } from "../../../ui/separator";
import { Tabs, TabsList, TabsTrigger } from "../../../ui/tabs";
import {
  LucideCalendarCheck,
  LucideKanbanSquare,
  LucideListCheck,
  LucidePanelRightClose,
  LucidePlus,
} from "lucide-react";
import { Button } from "../../../ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../../../ui/resizable";
import CreateTodoUI from "./createtodo";
import { TabsContent } from "@radix-ui/react-tabs";
import WeekList from "./weeklist";
import { useAllTasks } from "../../../../store/tasksStore";
import { useEffect, useRef, useState } from "react";
import { ImperativePanelHandle } from "react-resizable-panels";

const ToDoList = () => {
  const addTaskBarRef = useRef<ImperativePanelHandle>(null);
  const tasks = useAllTasks();
  const [addTaskBarOpen, setAddTaskBarOpen] = useState(tasks.length === 0);
  useEffect(() => {
    if (addTaskBarOpen) {
      addTaskBarRef.current?.expand();
    } else {
      addTaskBarRef.current?.collapse();
    }
  }, [addTaskBarOpen]);

  return (
    <div className=" bg-background rounded-md h-full shadow-md">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <Tabs className="px-4 flex flex-col gap-2 py-4" defaultValue="list">
            <div className="flex justify-between items-center">
              <p className="text-2xl font-bold">This week's overview</p>
              <div className="flex gap-2 items-center">
                <TabsList className="h-8">
                  <TabsTrigger value="list">
                    <LucideListCheck size={16} />
                  </TabsTrigger>
                  <TabsTrigger value="calendar" disabled>
                    <LucideCalendarCheck size={16} />
                  </TabsTrigger>
                  <TabsTrigger value="kanban" disabled>
                    <LucideKanbanSquare size={16} />
                  </TabsTrigger>
                </TabsList>
                <Button
                  size="sm"
                  className="flex gap-2 text-xs h-8"
                  onClick={() => setAddTaskBarOpen(!addTaskBarOpen)}
                  variant={addTaskBarOpen ? "ghost" : "default"}
                >
                  {addTaskBarOpen ? (
                    <LucidePanelRightClose size={16} />
                  ) : (
                    <>
                      <LucidePlus size={16} />
                      Add Task
                    </>
                  )}
                </Button>
              </div>
            </div>
            <Separator />
            <TabsContent value="list">
              <WeekList />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel
          defaultSize={addTaskBarOpen ? 40 : 0}
          className="py-4 transition-all ease-in-out duration-100"
          minSize={20}
          maxSize={40}
          collapsible
          ref={addTaskBarRef}
          onCollapse={() => setAddTaskBarOpen(false)}
          onExpand={() => setAddTaskBarOpen(true)}
        >
          <CreateTodoUI />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ToDoList;
