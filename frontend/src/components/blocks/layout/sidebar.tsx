import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LucideCuboid,
  LucideHome,
  LucideInbox,
  LucidePanelLeftClose,
  LucidePin,
  LucidePlus,
} from "lucide-react";
// import { useObjectTypesStore } from "@/store/objectsStore";
import { Button } from "../../ui/button";
import { useSidebarState, useTabsState } from "@/store/layoutStore";
import { v4 as uuid } from "uuid";
import { cn } from "../../../lib/utils";
import { Separator } from "../../ui/separator";
import {
  useAllObjectTypes,
  useAllObjectTypesIDs,
  useObjectTypesUnsavedStore,
} from "../../../store/objectTypesStore";
import { ModeToggle } from "../../ui/theme-toggle";
import {
  DEFAULT_OBJECT,
  ObjectInstance,
  useAllObjects,
  useAllObjectsIDs,
  useCreateObject,
} from "../../../store/objectsStore";
import { ObjectType } from "../../../types/objectTypes";
import { useQueryClient } from "@tanstack/react-query";

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
  const createObject = useCreateObject();
  const queryClient = useQueryClient();
  return (
    <div className="h-full flex flex-col gap-4 px-3 py-2 disable-select  bg-muted">
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
      <Select>
        <SelectTrigger className="h-8">
          <SelectValue placeholder="Workspace" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Workspace 1</SelectItem>
          <SelectItem value="2">Workspace 2</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex flex-col gap-2">
        <Button
          variant={"ghost"}
          className={cn("justify-normal px-2 gap-2 ")}
          size={"sm"}
        >
          <LucideInbox size={16} />
          Inbox
        </Button>
        <Button
          variant={"default"}
          className={cn("justify-normal px-2 shadow-inner gap-2")}
          size={"sm"}
        >
          <LucideHome size={16} />
          Home
        </Button>
      </div>
      <Separator />
      <div className="flex items-center gap-2 px-2 text-sm text-muted-foreground">
        <LucidePin size={15} /> Pinned
      </div>
      <div className="flex items-center justify-between px-2 text-sm text-muted-foreground">
        <div className="flex gap-2 items-center">
          <LucideCuboid size={15} /> Objects
        </div>
        <Button
          size="iconSm"
          variant="outline"
          onClick={() => {
            const tabId = uuid();
            addObjectType({
              id: tabId,
              name: "",
              icon: "",
              baseType: "page",
              description: "",
              color: "",
              properties: {},
            });
            createTab(tabId, "createObjectType");
          }}
        >
          <LucidePlus size={15} />
        </Button>
      </div>
      <div className="ml-4">
        {/* {Object.values(objectTypes).map((objectType) => (
          <div key={objectType.id} className="flex items-center gap-2 text-sm">
            {objectType.name}
          </div>
        ))} */}
      </div>
      {allObjectTypes &&
        allObjectTypes.map((objectType) => (
          <div>
            <div className="flex items-center justify-between">
              {objectType?.name}
              <Button
                key={objectType?.id}
                variant={"ghost"}
                className={cn("justify-normal px-2  gap-2")}
                size={"iconSm"}
                onClick={() => {
                  const tabId = uuid();
                  const propertiesMap = Object.fromEntries(
                    Object.entries(objectType?.properties ?? {}).map(
                      ([key, value]) => [key, ""]
                    )
                  );
                  const contentUUID = uuid();
                  createObject(tabId, {
                    ...DEFAULT_OBJECT,
                    type: objectType?.id ?? "",
                    contents: {
                      contentUUID: {
                        type: "text",
                        content: "",
                        id: contentUUID,
                        x: 0,
                        y: 0,
                        w: 12,
                        h: 12,
                      },
                    },
                    properties: propertiesMap,
                  }).then(() => {
                    createTab(tabId, "object");
                  });
                }}
              >
                <LucidePlus />
              </Button>
            </div>
            {allObjects &&
              allObjects.map((object) => {
                if (!object) return null;
                if (object.type === objectType.id) {
                  return (
                    <div
                      key={object.id}
                      className="ml-4 cursor-pointer hover:bg-secondary"
                      onClick={() => {
                        createTab(object.id, "object");
                      }}
                    >
                      {object.title}
                    </div>
                  );
                } else {
                  return null;
                }
              })}
          </div>
        ))}
      <ModeToggle />
    </div>
  );
};

export default Sidebar;
