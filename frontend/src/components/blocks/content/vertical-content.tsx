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
} from "lucide-react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import OptionsSidebar from "./options-siderbar";
import { Separator } from "../../ui/separator";
import { ReactFrameworkOutput } from "@remirror/react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useObject } from "@/store/objectsStore";
import { useQuery } from "@tanstack/react-query";
import { ObjectType } from "@/types/objectTypes";
import { produce } from "immer";
import ContentTag from "./content-tags";

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
  const [backgroundColor, setBackgroundColor] = useState("#fff");
  const [freeDrag, setFreeDrag] = useState(false);
  if (!object) return null;

  const generatedLayout = Object.entries(object.contents).map(
    ([key, value]) => {
      const contentObj = value;
      return {
        i: key,
        x: contentObj.x,
        y: contentObj.y,
        w: contentObj.w,
        h: contentObj.h,
        maxH: 15,
      };
    }
  );

  return (
    <div className="bg-background min-h-full h-full border rounded-md shadow-sm  ">
      <ResizablePanelGroup direction={"horizontal"} className="h-full">
        <ResizablePanel
          defaultSize={10}
          collapsible
          className="h-full"
          collapsedSize={0}
          minSize={20}
          maxSize={30}
        >
          {Object.entries(object.properties).map(([key, value]) => (
            <p>
              {objectType && objectType.properties[key].name}: {value} -{" "}
              {objectType && objectType.properties[key].type}
            </p>
          ))}
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel className={cn("overflow-y-scroll py-2 h-full")}>
          <div className="flex justify-between items-center px-4">
            <div className="flex gap-1 items-center w-[50%]">
              <Button variant={"ghost"} size={"iconSm"}>
                <LucidePanelLeft size={18} />
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
              <ContentTag
                type={object.aiReady ? "AI Ready" : "Not AI Ready"}
                className="mr-2"
              />
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
              <Button variant={"ghost"} size={"iconSm"}>
                <LucidePanelRight size={18} />
              </Button>
            </div>
          </div>
          <Separator />
          <div
            className="h-full"
            style={{
              backgroundColor: backgroundColor,
            }}
          >
            <ResponsiveGridLayout
              className="layout overflow-x-clip "
              layouts={{ lg: generatedLayout }}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
              rowHeight={50}
              isResizable={true}
              resizeHandles={freeDrag ? ["se"] : ["s"]}
              resizeHandle={
                !freeDrag && (
                  <ChevronsUpDown
                    className="handle-s bottom-3 left-[50%] absolute cursor-ns-resize hover:text-muted-foreground opacity-0 group-hover:opacity-100"
                    size={16}
                  />
                )
              }
              isDraggable={true}
              width={window.innerWidth - 40} // Subtracting padding
              compactType="vertical"
              preventCollision={false}
              draggableHandle=".drag-handle"
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
                    <TextEditor
                      ref={editorRef}
                      mutate={(newState) => {
                        const newObject = produce(object, (draft) => {
                          draft.contents[key].content = newState;
                        });
                        mutate(newObject);
                      }}
                      content={contentObj.content}
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
          defaultSize={10}
          collapsible
          className="h-full"
          collapsedSize={0}
          minSize={20}
          maxSize={40}
        >
          <OptionsSidebar
            editorRef={editorRef}
            backgroundColor={backgroundColor}
            setBackgroundColor={setBackgroundColor}
            freeDrag={freeDrag}
            setFreeDrag={setFreeDrag}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default VerticalContent;
