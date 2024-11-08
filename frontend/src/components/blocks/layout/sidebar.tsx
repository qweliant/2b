import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  GalleryThumbnails,
  LucideCalendar,
  LucideCuboid,
  LucideEllipsis,
  LucideHome,
  LucideInbox,
  LucideListTodo,
  LucidePanelLeftClose,
  LucidePin,
  LucidePlus,
} from "lucide-react";
// import { useObjectTypesStore } from "@/store/objectsStore";
import { Button } from "../../ui/button";
import {
  DEFAULT_INBOX_TAB_ID,
  DEFAULT_TODO_LIST_TAB_ID,
  useSidebarState,
  useTabsState,
} from "@/store/layoutStore";
import { v4 as uuid } from "uuid";
import { cn } from "@/lib/utils";
import { Separator } from "../../ui/separator";
import {
  useAllObjectTypes,
  useAllObjectTypesIDs,
  useObjectTypesUnsavedStore,
} from "@/store/objectTypesStore";
import { ModeToggle } from "../../ui/theme-toggle";
import {
  DEFAULT_OBJECT,
  ObjectInstance,
  useAllObjects,
  useAllObjectsIDs,
  useCreateObject,
} from "@/store/objectsStore";
import { ObjectType } from "@/types/objectTypes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Sidebar = () => {
  const { createTab } = useTabsState();
  const { setSidebarOpen } = useSidebarState();
  const { addObjectType } = useObjectTypesUnsavedStore();
  const { data: ids } = useAllObjectTypesIDs();
  const allObjectTypesQueries = useAllObjectTypes(ids);
  const allObjectTypes = allObjectTypesQueries.map(
    (query) => query.data
  ) as ObjectType[];
  const { data: objectIDs } = useAllObjectsIDs();
  const allObjectQueries = useAllObjects(objectIDs);
  const allObjects = allObjectQueries.map(
    (query) => query.data
  ) as ObjectInstance[];
  const pinnedObjects = allObjects?.filter((object) => object?.pinned);
  const createObject = useCreateObject();

  const handleCreateTab = () => {
    const tabId = uuid();
    addObjectType({
      id: tabId,
      name: "",
      icon: "",
      baseType: "page",
      description: "",
      color: "",
      properties: {},
      fixed: false,
    });
    createTab(tabId, "createObjectType");
  };

  const handleCreateObject = (objectType: ObjectType) => {
    if (!objectType) return;
    const tabId = uuid();
    const contentUUID = uuid();
    createObject(tabId, {
      ...DEFAULT_OBJECT,
      type: objectType?.id ?? "",
      contents: {
        [contentUUID]: {
          type: "text",
          content: "",
          id: contentUUID,
          x: 0,
          y: 0,
          w: 12,
          h: 12,
        },
      },
    }).then(() => {
      // createTab(tabId, "object");
    });
  };

  return (
    <div className="h-full flex flex-col gap-4 px-3 py-2 disable-select bg-muted">
      <div className="flex h-[22px] justify-between">
        <div />
        <Button
          size={"iconSm"}
          variant={"ghost"}
          onClick={() => setSidebarOpen(false)}
        >
          <LucidePanelLeftClose size={18} />
        </Button>
      </div>
      {/* <Select>
        <SelectTrigger className="h-8">
          <SelectValue placeholder="Workspace" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Workspace 1</SelectItem>
          <SelectItem value="2">Workspace 2</SelectItem>
        </SelectContent>
      </Select> */}

      <div className="flex flex-col gap-2">
        <Button
          variant={"ghost"}
          className={cn("justify-normal px-2 gap-2 ")}
          size={"sm"}
          onClick={() => {
            createTab(DEFAULT_INBOX_TAB_ID, "inbox");
          }}
        >
          <LucideInbox size={16} />
          Inbox
        </Button>
        <Button
          variant={"ghost"}
          className={cn("justify-normal px-2 gap-2")}
          size={"sm"}
          disabled
        >
          <LucideCalendar size={16} />
          Calendar
        </Button>
      </div>
      <Separator />
      <div className="flex items-center gap-2 px-2 text-sm text-muted-foreground">
        <LucidePin size={15} /> Pinned
      </div>
      <div className="ml-4 border-l w-full px-2 pr-4">
        {pinnedObjects &&
          pinnedObjects.map((object) => {
            if (!object) return null;
            return (
              <Button
                key={object.id}
                variant="ghost"
                size={"iconSm"}
                className="text-sm h-fit text-muted-foreground w-full justify-start pl-4 rounded-none"
                onClick={() => {
                  createTab(object.id, "object");
                }}
              >
                {object.title}
              </Button>
            );
          })}
      </div>
      <div className="flex flex-col px-2 ">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex gap-2 items-center">
            <LucideCuboid size={15} /> Objects
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <LucideEllipsis size={15} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleCreateTab}>
                Create new object type
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="pl-4">
          <Accordion type="multiple">
            {allObjectTypes &&
              allObjectTypes.map((objectType) => {
                if (objectType?.baseType !== "page") return null;
                return (
                  <AccordionItem
                    value={objectType.id}
                    className="text-sm"
                    hideBorder
                  >
                    <AccordionTrigger
                      hideChevron
                      hideUnderline
                      className="pb-1 w-full"
                    >
                      <div className="flex items-center justify-between w-full group">
                        <div className="flex gap-1">
                          <p>{objectType?.icon}</p>
                          <p>{objectType?.name}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="group-hover:opacity-100 opacity-0">
                            <LucideEllipsis size={15} />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCreateObject(objectType);
                              }}
                            >
                              Create new {objectType?.name}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="border-l pb-0">
                      <div className="flex flex-col gap-1">
                        {allObjects &&
                          allObjects.map((object) => {
                            if (!object) return null;
                            if (
                              object.type === objectType?.id &&
                              objectType?.baseType === "page"
                            ) {
                              return (
                                <div
                                  key={object.id}
                                  className="ml-4 cursor-pointer hover:bg-secondary p-1 rounded-sm transition-colors ease-in-out duration-150 group flex justify-between items-center"
                                  onClick={() => {
                                    createTab(object.id, "object");
                                  }}
                                >
                                  <p className="w-full text-ellipsis whitespace-nowrap overflow-x-clip">
                                    {object.title}
                                  </p>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger className="group-hover:opacity-100 opacity-0">
                                      <LucideEllipsis size={15} />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem>Open</DropdownMenuItem>
                                      <DropdownMenuItem>
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              );
                            } else {
                              return null;
                            }
                          })}
                        {allObjects &&
                          allObjects.filter(
                            (object) => object?.type === objectType?.id
                          ).length === 0 && (
                            <div className="ml-4 text-muted-foreground">
                              No objects
                            </div>
                          )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
          </Accordion>
        </div>
      </div>

      <ModeToggle />
    </div>
  );
};

export default Sidebar;
