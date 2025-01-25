import { memo, useState } from "react";
import { useObject } from "@/store/objectsStore";
import { useQuery } from "@tanstack/react-query";
import { ObjectType } from "../../../types/objectTypes";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Calendar } from "../../ui/calendar";
import { HashIcon } from "lucide-react";
import { Switch } from "../../ui/switch";
import { produce } from "immer";

import ObjectSelect from "../../object-select";
import { Checkbox } from "@/components/ui/checkbox";

interface PropertiesSidebarProps {
  id: string;
}

const PropertiesSidebar = memo(
  ({ id }: PropertiesSidebarProps): JSX.Element => {
    const { data: object, mutate } = useObject(id);
    const objectTypeId = object?.type;
    const { data: objectType } = useQuery<ObjectType>({
      queryKey: ["objectType", objectTypeId],
      enabled: !!objectTypeId,
    });

    const [month, setMonth] = useState(undefined);
    if (!object || !objectType || !object.properties) {
      return <div>Loading...</div>;
    }
    console.log("Object:", object);
    console.log("Object Properties:", object?.properties);
    return (
      <div className="px-2 py-4 flex flex-col gap-2">
        {Object.entries(object.properties).map(
          ([key, property]) => {
            if (objectType.properties[key].type === "text") {
              return (
                <div key={key}>
                  <Label>{objectType.properties[key].name}</Label>
                  <Input
                    value={property.value}
                    onChange={(e) => {
                      const draft = { ...object };
                      const newObject = produce(draft, (draft) => {
                        draft.properties[key].value = e.target.value;
                      });
                      mutate(newObject);
                    }}
                  />
                </div>
              );
            } else if (objectType.properties[key].type === "boolean") {
              return (
                <div key={key} className="flex flex-col gap-2 py-2">
                  <Label>{objectType.properties[key].name}</Label>
                  <Checkbox checked={true} />
                  <Switch />
                </div>
              );
            } else if (objectType.properties[key].type === "number") {
              return (
                <div key={key}>
                  <Label>{objectType.properties[key].name}</Label>
                  <div className="relative">
                    <Input
                      value={property.valueNumber}
                      type="number"
                      className="pl-10"
                      onChange={(e) => {
                        const draft = { ...object };
                        const newObject = produce(draft, (draft) => {
                          draft.properties[key].valueNumber = Number(
                            e.target.value
                          );
                        });
                        mutate(newObject);
                      }}
                    />
                    <HashIcon
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 "
                      size={12}
                    />
                  </div>
                </div>
              );
            } else if (objectType.properties[key].type === "date") {
              return (
                <div key={key}>
                  <Label>{objectType.properties[key].name}</Label>
                  <Calendar
                    mode="single"
                    selected={
                      property?.valueDate
                        ? new Date(property.valueDate)
                        : undefined
                    }
                    onSelect={(day) => {
                      if (!day) return; // If no day is selected, exit early.
                      const draft = { ...object };
                      const newObject = produce(draft, (draft) => {
                        draft.properties[key].valueDate = day.toISOString();
                      });
                      mutate(newObject);
                    }}
                    defaultMonth={
                      property?.valueDate
                        ? new Date(property.valueDate)
                        : undefined
                    }
                  />
                </div>
              );
            }
            return (
              <div key={key}>
                <Label>{objectType.properties[key].name}</Label>
                <ObjectSelect
                  key={key}
                  objectTypeID={objectType.properties[key].type}
                  onValueChange={(value) => {
                    if (
                      !value ||
                      value === "" ||
                      value === property.referencedObjectId
                    )
                      return;
                    const draft = { ...object };
                    const newObject = produce(draft, (draft) => {
                      draft.properties[key].referencedObjectId = value;
                    });
                    mutate(newObject);
                  }}
                  value={property.referencedObjectId ?? ""}
                />
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
        {/* <Button>Add Property</Button> */}
      </div>
    );
  }
);

export default PropertiesSidebar;
