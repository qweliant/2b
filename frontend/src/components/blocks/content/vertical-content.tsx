import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import TextEditor, { Extensions } from "./text/text-editor";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../../ui/resizable";
import {
  ChevronsUpDown,
  GripVertical,
  LucidePanelLeft,
  LucidePanelRight,
  LucidePin,
  LucidePinOff,
  LucideSparkles,
} from "lucide-react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import OptionsSidebar from "./options-siderbar";
import { Separator } from "../../ui/separator";
import { ReactFrameworkOutput } from "@remirror/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  ObjectContent,
  useBackgroundColor,
  useDefaultFont,
  useObject,
} from "@/store/objectsStore";
import { useQuery } from "@tanstack/react-query";
import { ObjectType } from "@/types/objectTypes";
import { produce } from "immer";
import ContentTag from "./content-tags";
import { v4 as uuid } from "uuid";
import { useMessageStore } from "../../../store/chatStore";
import { GetSummary } from "../../../../wailsjs/go/main/App";
import { ImperativePanelHandle } from "react-resizable-panels";
import PropertiesSidebar from "./properties-sidebar";
const ResponsiveGridLayout = WidthProvider(Responsive);
const VerticalContent = ({ tabId }: { tabId: string }) => {
  const {
    data: object,
    mutate,
    isError,
    isPending,
    isSuccess,
  } = useObject(tabId);
  const objectTypeID = object?.type;
  const { data: objectType } = useQuery<ObjectType>({
    queryKey: ["objectType", objectTypeID],
    enabled: !!objectTypeID,
  });
  const editorRef = useRef<ReactFrameworkOutput<Extensions>>(null);
  const { backgroundColor, setBackgroundColor } = useBackgroundColor(tabId);
  const { defaultFont, setDefaultFont } = useDefaultFont(tabId);
  const [freeDrag, setFreeDrag] = useState(false);
  const { addMessage, messages } = useMessageStore();

  const propertiesSidebarRef = useRef<ImperativePanelHandle>(null);
  const optionsSidebarRef = useRef<ImperativePanelHandle>(null);
  const [propertiesSidebarOpen, setPropertiesSidebarOpen] = useState(true);
  const [optionsSidebarOpen, setOptionsSidebarOpen] = useState(false);

  useEffect(() => {
    if (propertiesSidebarRef.current && propertiesSidebarOpen) {
      propertiesSidebarRef.current.expand();
    } else if (propertiesSidebarRef.current && !propertiesSidebarOpen) {
      propertiesSidebarRef.current.collapse();
    }
  }, [propertiesSidebarOpen]);

  useEffect(() => {
    if (optionsSidebarRef.current && optionsSidebarOpen) {
      optionsSidebarRef.current.expand();
    } else if (optionsSidebarRef.current && !optionsSidebarOpen) {
      optionsSidebarRef.current.collapse();
    }
  }, [optionsSidebarOpen]);

  if (!object) return null;
  if (!objectType) return null;

  const generatedLayout = Object.entries(object.contents).map(
    ([key, value]) => {
      const contentObj = value;
      return {
        i: key,
        x: contentObj.x,
        y: contentObj.y,
        w: contentObj.w,
        h: contentObj.h,
      };
    }
  );
  return (
    <div
      className={cn(
        "bg-background min-h-full h-full border rounded-md shadow-sm",
        objectType?.color !== "" &&
          `border-${objectType?.color.replace("bg-", "")}`
      )}
    >
      <ResizablePanelGroup direction={"horizontal"} className="h-full">
        <ResizablePanel
          defaultSize={propertiesSidebarOpen ? 20 : 0}
          collapsible
          className="h-full transition-all ease-in-out duration-100"
          collapsedSize={0}
          minSize={20}
          maxSize={30}
          ref={propertiesSidebarRef}
        >
          <PropertiesSidebar id={tabId} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel className={cn("overflow-y-scroll py-2 h-full")}>
          <div className="flex justify-between items-center px-4">
            <div className="flex gap-1 items-center w-[50%]">
              <Button
                variant={"ghost"}
                size={"iconSm"}
                onClick={() => {
                  setPropertiesSidebarOpen(!propertiesSidebarOpen);
                }}
              >
                <LucidePanelLeft size={18} />
              </Button>
              <Button
                variant={"ghost"}
                size={"iconSm"}
                className="text-muted-foreground"
                onClick={() => {
                  const newObject = produce(object, (draft) => {
                    draft.pinned = !draft.pinned;
                  });
                  mutate(newObject);
                }}
              >
                {object.pinned ? (
                  <LucidePin size={18} />
                ) : (
                  <LucidePinOff size={18} />
                )}
              </Button>
              <Input
                className="border-none text-xl font-semibold w-full focus:border focus:border-border "
                placeholder="Enter Title here"
                value={object.title}
                onChange={(e) => {
                  const newObject = produce(object, (draft) => {
                    draft.title = e.target.value;
                  });
                  mutate(newObject);
                }}
              />
            </div>
            <div className="flex gap-1 items-center">
              {/* <ContentTag
                type={object.aiReady ? "AI Ready" : "Not AI Ready"}
                className="mr-2"
              /> */}
              <ContentTag
                type={
                  isError
                    ? "Error"
                    : isPending
                    ? "Saving"
                    : isSuccess
                    ? "Saved"
                    : "Loading"
                }
                className="mr-2"
              />
              <Button
                variant={"ghost"}
                size={"iconSm"}
                onClick={() => {
                  setOptionsSidebarOpen(!optionsSidebarOpen);
                }}
              >
                <LucidePanelRight size={18} />
              </Button>
            </div>
          </div>
          <Separator />
          <div
            className={cn(
              "h-full  overflow-y-scroll pb-10",
              backgroundColor === "" && "bg-background"
            )}
            style={{ backgroundColor: backgroundColor }}
          >
            <ResponsiveGridLayout
              className="layout overflow-x-clip"
              layouts={{ lg: generatedLayout }}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
              rowHeight={50}
              isResizable={true}
              resizeHandles={freeDrag ? ["se"] : ["s"]}
              resizeHandle={
                !freeDrag && (
                  <ChevronsUpDown
                    className="handle-s bottom-3 left-[50%] absolute cursor-ns-resize hover:text-muted-foreground opacity-0 group-hover:opacity-100 "
                    size={16}
                  />
                )
              }
              isDraggable={true}
              isDroppable={true}
              onDrop={(layout, layoutItem, e) => {
                //@ts-expect-error Wrong typing for the event by react-grid-layout
                const data = e.dataTransfer.getData("text/plain");
                const newObject = produce(object, (draft) => {
                  const newContentItem: ObjectContent = {
                    type: data,
                    content: "",
                    x: layoutItem.x,
                    y: layoutItem.y,
                    w: 12,
                    h: 12,
                    id: uuid(),
                  };
                  draft.contents[newContentItem.id] = newContentItem;
                });
                mutate(newObject);
              }}
              width={window.innerWidth - 40} // Subtracting padding
              compactType="vertical"
              preventCollision={false}
              draggableHandle=".drag-handle"
              onLayoutChange={(layout) => {
                const newObject = produce(object, (draft) => {
                  Object.entries(draft.contents).forEach(([key, value]) => {
                    const contentObj = value;
                    const newLayoutItem = layout.find((item) => item.i === key);
                    if (!newLayoutItem) return;
                    contentObj.x = newLayoutItem.x;
                    contentObj.y = newLayoutItem.y;
                    contentObj.w = newLayoutItem.w;
                    contentObj.h = newLayoutItem.h;
                  });
                });
                mutate(newObject);
              }}
            >
              {Object.entries(object.contents).map(([key, value]) => {
                const contentObj = value;
                if (contentObj.type !== "text") return null;
                return (
                  <div
                    key={key}
                    className={cn(
                      "content-block relative group",
                      freeDrag && "shadow-md rounded-lg border"
                    )}
                  >
                    <Button
                      variant={"ghost"}
                      size={"iconSm"}
                      className=" absolute top-2 right-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      onClick={() => {
                        addMessage({
                          id: messages.length,
                          role: "user",
                          content: `Summarize some content for me: \n${contentObj.content.slice(
                            0,
                            15
                          )}...`,
                          timestamp: "Just now",
                          reference: {
                            title: object.title,
                            id: object.id,
                          },
                        });
                        GetSummary(contentObj.content).then((response) => {
                          addMessage({
                            id: messages.length,
                            role: "ai",
                            content: response,
                            timestamp: "Just now",
                          });
                        });
                      }}
                    >
                      <LucideSparkles
                        className="text-muted-foreground"
                        size={18}
                      />
                    </Button>
                    <TextEditor
                      ref={editorRef}
                      mutate={(newState) => {
                        const newObject = produce(object, (draft) => {
                          draft.contents[key].content = newState;
                        });
                        mutate(newObject);
                      }}
                      content={contentObj.content}
                      defaultFont={defaultFont}
                    />
                    <GripVertical
                      className="drag-handle left-0 top-[50%] absolute cursor-move text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                      size={20}
                    />
                  </div>
                );
              })}
            </ResponsiveGridLayout>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={optionsSidebarOpen ? 15 : 0}
          collapsible
          className="h-full transition-all ease-in-out duration-100"
          collapsedSize={0}
          minSize={20}
          maxSize={40}
          ref={optionsSidebarRef}
        >
          <OptionsSidebar
            editorRef={editorRef}
            backgroundColor={backgroundColor}
            setBackgroundColor={setBackgroundColor}
            defaultFont={defaultFont}
            setDefaultFont={setDefaultFont}
            freeDrag={freeDrag}
            setFreeDrag={setFreeDrag}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default VerticalContent;
