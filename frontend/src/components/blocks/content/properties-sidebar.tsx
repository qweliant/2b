import React from "react";
import { useObject } from "@/store/objectsStore";
import { useQuery } from "@tanstack/react-query";
import { ObjectType } from "../../../types/objectTypes";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Checkbox } from "../../ui/checkbox";
import { Calendar } from "../../ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { CalendarIcon, HashIcon } from "lucide-react";
import { Switch } from "../../ui/switch";

interface PropertiesSidebarProps {
  id: string;
}

const PropertiesSidebar = ({ id }: PropertiesSidebarProps): JSX.Element => {
  const { data: object } = useObject(id);
  const objectTypeId = object?.type;
  const { data: objectType } = useQuery<ObjectType>({
    queryKey: ["objectType", objectTypeId],
    enabled: !!objectTypeId,
  });

  if (!object || !objectType) {
    return <div>Loading...</div>;
  }
  return (
    <div className="px-2 py-4 flex flex-col gap-2">
      {Object.entries(object.properties).map(
        ([key, value]) => {
          if (objectType.properties[key].type === "text") {
            return (
              <div>
                <Label>{objectType.properties[key].name}</Label>
                <Input
                  value={value}
                  onChange={() => {
                    console.log("change");
                  }}
                />
              </div>
            );
          } else if (objectType.properties[key].type === "boolean") {
            return (
              <div className="flex flex-col gap-2 py-2">
                <Label>{objectType.properties[key].name}</Label>
                {/* <Checkbox checked={value === "true"} /> */}
                <Switch />
              </div>
            );
          } else if (objectType.properties[key].type === "number") {
            return (
              <div>
                <Label>{objectType.properties[key].name}</Label>
                <div className="relative">
                  <Input
                    value={value}
                    type="number"
                    className="pl-10"
                    onChange={() => {
                      console.log("change");
                    }}
                  />
                  <HashIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 " size={12} />
                </div>
              </div>
            );
          } else if (objectType.properties[key].type === "date") {
            return (
              <div>
                <Label>{objectType.properties[key].name}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal text-muted-foreground"
                    >
                      <CalendarIcon className="mr-2" size={12} />
                      {"Pick a date"}{" "}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            );
          }
          return (
            <div>
              <Label>{objectType.properties[key].name}</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a value" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Option 1">Option 1</SelectItem>
                </SelectContent>
              </Select>
            </div>
          );
        }
        //   (
        //     <p>
        //       {objectType && objectType.properties[key].name}: {value} -{" "}
        //       {objectType && objectType.properties[key].type}
        //     </p>
        //   )
      )}
      <Button>Add Property</Button>
    </div>
  );
};

export default PropertiesSidebar;
