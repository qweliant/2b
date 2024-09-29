import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  CheckSquare,
  Code,
  ImageIcon,
  Italic,
  LayoutTemplate,
  List,
  ListOrdered,
  LucideGripVertical,
  LucideInfo,
  LucideLetterText,
  LucidePaintbrush,
  LucidePlus,
  LucideText,
  Play,
  Underline,
} from "lucide-react";
import { ContentTypes, useDeleteObject } from "../../../store/objectsStore";
import { Button } from "../../ui/button";
import { Separator } from "@radix-ui/react-select";
import { Switch } from "../../ui/switch";
import { ReactFrameworkOutput } from "@remirror/react";
import { Extensions } from "./text/text-editor";
import { RefObject, useEffect, useState } from "react";
import { cn } from "../../../lib/utils";
import { ColorPicker } from "../../ui/color-picker";
import { useTabsState } from "../../../store/layoutStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
const OptionsSidebar = ({
  editorRef,
  backgroundColor,
  setBackgroundColor,
  freeDrag,
  setFreeDrag,
}: {
  editorRef: RefObject<ReactFrameworkOutput<Extensions>>;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  freeDrag: boolean;
  setFreeDrag: (value: boolean) => void;
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
  const { tabsState } = useTabsState();
  const deleteObject = useDeleteObject();

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
  return (
    <Tabs defaultValue="add">
      <TabsList className="w-full shadow-inner rounded-none">
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
              className="flex justify-between items-center w-full border rounded-md p-2"
            >
              <div className="flex gap-4 items-center">
                <LucideText size={18} />
                <p>{type.charAt(0).toLocaleUpperCase() + type.slice(1)}</p>
              </div>
              <LucideGripVertical size={18} className="cursor-move" />
            </div>
          ))}
        </div>
      </TabsContent>
      <TabsContent
        value="text"
        className={cn(
          "h-full flex flex-col px-3 gap-2 overflow-y-auto",
          !isTextSelected &&
            "text-muted-foreground pointer-events-none opacity-30"
        )}
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
              <Button variant="outline" size="sm">
                H2
              </Button>
              <Button variant="outline" size="sm">
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
              <Button variant="outline" size="icon">
                <Code size={16} />
              </Button>
              <Button variant="outline" size="icon">
                <CheckSquare size={16} />
              </Button>
              <Button variant="outline" size="icon">
                <Play size={16} />
              </Button>
              <Button variant="outline" size="icon">
                <List size={16} />
              </Button>
              <Button variant="outline" size="icon">
                <ListOrdered size={16} />
              </Button>
              <Button variant="outline" size="icon">
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
              </Button>
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
                />
              ))}
            </div>
          </div>
          <div className={cn("flex flex-col gap-2")}>
            <h3 className="text-sm font-semibold mb-2">FONT</h3>
            <div className="flex gap-2 w-full justify-between">
              <Button variant="outline" size="sm" className="w-1/2">
                <span className="font-sans">Aa</span>
                <span className="text-xs ml-1">Default</span>
              </Button>
              <Button variant="outline" size="sm" className="w-1/2">
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
              <Button variant="secondary" size="sm" className="w-1/2">
                <span className="font-sans">Rr</span>
                <span className="text-xs ml-1">Round</span>
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent
        value="customize"
        className="h-full flex flex-col px-3 gap-4"
      >
        <div>
          <h3 className="text-sm font-semibold mb-2">COVER IMAGE</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="w-full h-20 flex flex-col items-center justify-center"
            >
              <ImageIcon size={24} className="mb-1" />
              <span className="text-xs">No Cover</span>
            </Button>
            <Button
              variant="outline"
              className="w-full h-20 flex flex-col items-center justify-center"
            >
              <ImageIcon size={24} className="mb-1" />
              <span className="text-xs">Cover Image</span>
            </Button>
          </div>
        </div>
        <Separator />
        <div className="w-full">
          <h3 className="text-sm font-semibold mb-2">BACKGROUND</h3>
          <div className="flex gap-2 w-full">
            <Tabs defaultValue="none" className="w-full">
              <TabsList className="w-full shadow-inner rounded-md">
                <TabsTrigger
                  value="none"
                  onClick={() => {
                    //TODO: Fix this for dark mode
                    setBackgroundColor("#fff");
                  }}
                >
                  <LayoutTemplate size={16} className="mr-2" />
                  None
                </TabsTrigger>
                <TabsTrigger value="solid">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-2" />
                  Solid
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
              <TabsContent value="gradient">
                <p>Gradient background selected.</p>
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
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <span className="font-sans">Aa</span>
              <span className="text-xs ml-1">Default</span>
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <span className="font-serif">Ss</span>
              <span className="text-xs ml-1">Serif</span>
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <span className="font-mono">00</span>
              <span className="text-xs ml-1">Mono</span>
            </Button>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="info" className="h-full flex flex-col px-3 gap-4">
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
