import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  BoxSelect,
  CheckSquare,
  Code,
  ImageIcon,
  Italic,
  List,
  ListOrdered,
  LucideBookmarkPlus,
  LucideFilePlus,
  LucideGripVertical,
  LucideImagePlus,
  LucideInfo,
  LucideLetterText,
  LucidePaintbrush,
  LucidePlus,
  Play,
  Underline,
} from "lucide-react";
import {
  ContentTypes,
  ObjectInstance,
  useDeleteObject,
  useObject,
  useWriteObject,
} from "../../../store/objectsStore";
import { Button } from "../../ui/button";
import { Separator } from "@radix-ui/react-select";
import { Switch } from "../../ui/switch";
import { ReactFrameworkOutput } from "@remirror/react";
import { Extensions } from "./text/text-editor";
import { RefObject, useEffect, useMemo, useState } from "react";
import { cn } from "../../../lib/utils";
import { ColorPicker } from "../../ui/color-picker";
import { useTabsState } from "../../../store/miscStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import objectToMarkdown from "./utils";

const OptionsSidebar = ({
  editorRef,
  backgroundColor,
  setBackgroundColor,
  freeDrag,
  setFreeDrag,
  defaultFont,
  setDefaultFont,
}: {
  editorRef: RefObject<ReactFrameworkOutput<Extensions>>;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  freeDrag: boolean;
  setFreeDrag: (value: boolean) => void;
  defaultFont: string;
  setDefaultFont: (font: string) => void;
}) => {
  const [isTextSelected, setIsTextSelected] = useState(false);
  const [selectedTextAttributes, setSelectedTextAttributes] = useState({
    bold: false,
    italic: false,
    underline: false,
    code: false,
    list: false,
    orderedList: false,
    // alignLeft: false,
    // alignCenter: false,
    // alignRight: false,
    // alignJustify: false,
  });
  const [html, setHtml] = useState<string>("");
  const { tabsState } = useTabsState();
  const deleteObject = useDeleteObject();
  const writeObject = useWriteObject();

  const obj = useObject(tabsState.activeTab || "NONE");
  useEffect(() => {
    if (editorRef.current) {
      const editorContext = editorRef.current;

      // Function to check if text is selected
      const checkTextSelection = () => {
        const selected = !editorContext.getState().selection.empty;
        if (selected) {
          const active = editorContext.active;
          setSelectedTextAttributes({
            bold: active.bold(),
            italic: active.italic(),
            underline: active.underline(),
            code: active.code(),
            list: active.bulletList(),
            orderedList: active.orderedList(),
            // alignLeft: active.alignLeft(),
            // alignCenter: active.alignCenter(),
            // alignRight: active.alignRight(),
            // alignJustify: active.alignJustify(),
          });
        }
        setIsTextSelected(selected);
      };

      // Check selection on editor updates
      const unsubscribe = editorContext.addHandler("updated", ({ state }) => {
        checkTextSelection();
      });

      // Initial check
      checkTextSelection();

      // Clean up
      return () => unsubscribe();
    }
  }, []);

  useEffect(() => {
    if (editorRef.current) {
      const html = prosemirrorNodeToHtml(editorRef.current?.getState().doc);
      setHtml(html);
    }
  }, []);
  return (
    <Tabs defaultValue="add">
      <TabsList className="w-full shadow-inner rounded-none h-[50px]">
        <TabsTrigger value="add">
          <LucidePlus size={18} />
        </TabsTrigger>
        <TabsTrigger value="text">
          <LucideLetterText size={18} />
        </TabsTrigger>
        <TabsTrigger value="customize">
          <LucidePaintbrush size={18} />
        </TabsTrigger>
        <TabsTrigger value="info">
          <LucideInfo size={18} />
        </TabsTrigger>
      </TabsList>
      <TabsContent value="add" className="h-full flex flex-col px-3 gap-">
        <p>Insert</p>
        <p className="text-sm text-muted-foreground">
          Drag and drop any type of block
        </p>
        <div className="flex flex-col gap-2 items-center w-ful px-8 py-4">
          {ContentTypes.options.map((type) => (
            <div
              key={type}
              draggable
              unselectable="on"
              className={cn(
                "flex justify-between items-center w-full border rounded-md p-2 cursor-move",
                type !== "text" &&
                  type !== "image" &&
                  type !== "drawing" &&
                  "pointer-events-none opacity-30"
              )}
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", type);
              }}
            >
              <div className="flex gap-4 items-center">
                {type === "text" && <LucideLetterText size={18} />}
                {type === "image" && <LucideImagePlus size={18} />}
                {type === "drawing" && <LucidePaintbrush size={18} />}
                {type === "file" && <LucideFilePlus size={18} />}
                {type === "bookmark" && <LucideBookmarkPlus size={18} />}
                <p>{type.charAt(0).toLocaleUpperCase() + type.slice(1)}</p>
              </div>
              <LucideGripVertical size={18} />
            </div>
          ))}
        </div>
      </TabsContent>
      <TabsContent
        value="text"
        className={cn("h-full flex flex-col px-3 gap-2 overflow-y-auto")}
      >
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-2">TITLES</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (editorRef && editorRef.current) {
                    editorRef.current.commands.toggleHeading({ level: 1 });
                  }
                }}
              >
                H1
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (editorRef && editorRef.current) {
                    editorRef.current.commands.toggleHeading({ level: 2 });
                  }
                }}
              >
                H2
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (editorRef && editorRef.current) {
                    editorRef.current.commands.toggleHeading({ level: 3 });
                  }
                }}
              >
                H3
              </Button>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">STYLING</h3>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedTextAttributes.bold ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  if (editorRef && editorRef.current) {
                    editorRef.current.commands.toggleBold();
                  }
                }}
              >
                <Bold size={16} />
              </Button>
              <Button
                variant={selectedTextAttributes.italic ? "default" : "outline"}
                size="icon"
                onClick={() => {
                  if (editorRef && editorRef.current) {
                    editorRef.current.commands.toggleItalic();
                  }
                }}
              >
                <Italic size={16} />
              </Button>
              <Button
                variant={
                  selectedTextAttributes.underline ? "default" : "outline"
                }
                size="icon"
                onClick={() => {
                  if (editorRef && editorRef.current) {
                    editorRef.current.commands.toggleUnderline();
                  }
                }}
              >
                <Underline size={16} />
              </Button>
              <Button
                variant={selectedTextAttributes.code ? "default" : "outline"}
                size="icon"
                onClick={() => {
                  if (editorRef && editorRef.current) {
                    editorRef.current.commands.toggleCode();
                  }
                }}
              >
                <Code size={16} />
              </Button>
              {/* TODO: Add lists */}
              {/* <Button variant="outline" size="icon">
                <CheckSquare size={16} />
              </Button>
              <Button variant="outline" size="icon">
                <Play size={16} />
              </Button> */}
              <Button
                variant={selectedTextAttributes.list ? "default" : "outline"}
                size="icon"
                onClick={() => {
                  if (editorRef && editorRef.current) {
                    editorRef.current.commands.toggleBulletList();
                  }
                }}
              >
                <List size={16} />
              </Button>
              <Button
                variant={
                  selectedTextAttributes.orderedList ? "default" : "outline"
                }
                size="icon"
                onClick={() => {
                  if (editorRef && editorRef.current) {
                    editorRef.current.commands.toggleOrderedList();
                  }
                }}
              >
                <ListOrdered size={16} />
              </Button>
              {/* <Button variant="outline" size="icon">
                <AlignLeft size={16} />
              </Button>
              <Button variant="outline" size="icon">
                <AlignCenter size={16} />
              </Button>
              <Button variant="outline" size="icon">
                <AlignRight size={16} />
              </Button>
              <Button variant="outline" size="icon">
                <AlignJustify size={16} />
              </Button> */}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">TEXT COLOR</h3>
            <div className="grid grid-cols-6 gap-2">
              {[
                "#000000",
                "#4B5563",
                "#9CA3AF",
                "#3B82F6",
                "#2563EB",
                "#60A5FA",
                "#10B981",
                "#8B5CF6",
                "#EF4444",
                "#F97316",
                "#92400E",
                "#A855F7",
              ].map((color) => (
                <Button
                  key={color}
                  className="w-8 h-8 rounded-full p-0"
                  style={{ backgroundColor: color }}
                  onClick={() =>
                    editorRef.current?.commands.setTextColor(color)
                  }
                />
              ))}
            </div>
          </div>
          <div className={cn("flex flex-col gap-2")}>
            <h3 className="text-sm font-semibold mb-2">FONT</h3>
            <div className="flex gap-2 w-full justify-between">
              <Button
                variant="outline"
                size="sm"
                className="w-1/2"
                onClick={() => {
                  if (editorRef && editorRef.current) {
                    editorRef.current.commands.setFontFamily("sans-serif");
                  }
                }}
              >
                <span className="font-sans">Aa</span>
                <span className="text-xs ml-1">Default</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-1/2"
                onClick={() => {
                  if (editorRef && editorRef.current) {
                    editorRef.current.commands.setFontFamily("serif");
                  }
                }}
              >
                <span className="font-serif">Ss</span>
                <span className="text-xs ml-1">Serif</span>
              </Button>
            </div>
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                className="w-1/2"
                onClick={() => {
                  if (editorRef && editorRef.current) {
                    editorRef.current.commands.setFontFamily("monospace");
                  }
                }}
              >
                <span className="font-mono">00</span>
                <span className="text-xs ml-1">Mono</span>
              </Button>
              {/* <Button
                variant="secondary"
                size="sm"
                className="w-1/2"
                onClick={() => {
                  if (editorRef && editorRef.current) {
                    editorRef.current.commands.setFontFamily("round");
                  }
                }}
              >
                <span className="font-sans">Rr</span>
                <span className="text-xs ml-1">Round</span>
              </Button> */}
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent
        value="customize"
        className="h-full flex flex-col px-3 gap-4"
      >
        <div className="w-full">
          <h3 className="text-sm font-semibold mb-2">BACKGROUND</h3>
          <div className="flex gap-2 w-full">
            <Tabs defaultValue="none" className="w-full">
              <TabsList className="w-full shadow-inner rounded-md sm:flex-wrap sm:h-fit">
                <TabsTrigger
                  value="none"
                  onClick={() => {
                    //TODO: Fix this for dark mode
                    setBackgroundColor("#fff");
                  }}
                >
                  <BoxSelect size={16} className="mr-2" />
                  None
                </TabsTrigger>
                <TabsTrigger value="solid">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-2" />
                  Solid
                </TabsTrigger>
                <TabsTrigger value="image" disabled>
                  <ImageIcon size={16} className="mr-2" />
                  Image
                </TabsTrigger>
              </TabsList>
              <TabsContent value="none">
                <p>No background selected.</p>
              </TabsContent>
              <TabsContent
                value="solid"
                className="flex justify-between items-center mt-2"
              >
                <p>Change color</p>
                <ColorPicker
                  value={backgroundColor}
                  onChange={(color) => setBackgroundColor(color)}
                />
              </TabsContent>
              <TabsContent value="image">
                <p>Image background selected.</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <Separator />
        <div className="w-full">
          <h3 className="text-sm font-semibold mb-2">LAYOUT</h3>
          <div className="flex justify-between items-center">
            <p>Free drag</p>
            <Switch
              checked={freeDrag}
              onCheckedChange={(value) => setFreeDrag(value)}
            />
          </div>
        </div>
        <Separator />
        <div>
          <h3 className="text-sm font-semibold mb-2">DEFAULT FONT</h3>
          <div className="flex gap-2 sm:flex-wrap">
            <Button
              variant={defaultFont === "ui-sans-serif" ? "default" : "outline"}
              size="sm"
              className="flex-1"
              onClick={() => setDefaultFont("ui-sans-serif")}
            >
              <span className="font-sans">Aa</span>
              <span className="text-xs ml-1">Default</span>
            </Button>
            <Button
              variant={defaultFont === "ui-serif" ? "default" : "outline"}
              size="sm"
              className="flex-1"
              onClick={() => setDefaultFont("ui-serif")}
            >
              <span className="font-serif">Ss</span>
              <span className="text-xs ml-1">Serif</span>
            </Button>
            <Button
              variant={defaultFont === "ui-monospace" ? "default" : "outline"}
              size="sm"
              className="flex-1"
              onClick={() => setDefaultFont("ui-monospace")}
            >
              <span className="font-mono">00</span>
              <span className="text-xs ml-1">Mono</span>
            </Button>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="info" className="h-full flex flex-col px-3 gap-4">
        <Button
          variant="default"
          onClick={() => {
            if (tabsState.activeTab) {
              const objMd = objectToMarkdown(
                obj.data as unknown as ObjectInstance
              );
              writeObject(
                tabsState.activeTab,
                objMd,
                obj.data?.title ?? "Title"
              );
            }
          }}
        >
          Export
        </Button>
        <Dialog>
          <DialogContent>
            <DialogTitle>
              Are you sure you want to delete this object?
            </DialogTitle>
            <DialogDescription>
              The object will be permanently deleted and cannot be recovered.
            </DialogDescription>
            <DialogFooter>
              <Button
                variant={"ghost"}
                onClick={() => {
                  if (tabsState.activeTab) {
                    deleteObject(tabsState.activeTab);
                  }
                }}
              >
                Delete
              </Button>
              <Button variant={"destructive"}>Cancel</Button>
            </DialogFooter>
          </DialogContent>

          <DialogTrigger asChild>
            <Button variant={"destructive"}>Delete Object</Button>
          </DialogTrigger>
        </Dialog>
      </TabsContent>
    </Tabs>
  );
};

export default OptionsSidebar;
