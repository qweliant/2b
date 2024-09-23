import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LucideCuboid,
  LucidePanelLeftClose,
  LucidePin,
  LucidePlus,
} from "lucide-react";
import { useObjectTypesStore } from "@/store/objectsStore";
import { Button } from "../../ui/button";
import { useSidebarState, useTabsState } from "@/store/layoutStore";
import { v4 as uuid } from "uuid";
import { cn } from "../../../lib/utils";
// import Icon from "@/components/ui/icon";

const Sidebar = () => {
  const { objectTypes } = useObjectTypesStore();
  const { createTab } = useTabsState();
  const { setSidebarOpen } = useSidebarState();

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
      <Button variant={"secondary"} className={cn("justify-normal px-2 shadow-inner")} size={"sm"}>
        Dashboard
      </Button>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <LucidePin size={15} /> Pinned
      </div>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex gap-2 items-center">
          <LucideCuboid size={15} /> Objects
        </div>
        <Button
          size="iconSm"
          variant="outline"
          onClick={() => createTab(uuid(), "createObjectType")}
        >
          <LucidePlus size={15} />
        </Button>
      </div>
      <div className="ml-4">
        {Object.values(objectTypes).map((objectType) => (
          <div key={objectType.id} className="flex items-center gap-2 text-sm">
            {objectType.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
