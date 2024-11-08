import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  DEFAULT_OBJECT,
  useCreateObject,
  useObjectsOfType,
} from "../store/objectsStore";
import { useObjectType } from "../store/objectTypesStore";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ObjectType } from "../types/objectTypes";
import { v4 as uuid } from "uuid";
import { memo, useState } from "react";

const ObjectSelectFilteredObjects = memo(
  ({
    searchTerm,
    objectTypeID,
    objectType,
  }: {
    searchTerm: string;
    objectTypeID: string;
    objectType: ObjectType;
  }) => {
    const objects = useObjectsOfType(objectTypeID);
    if (!objects) {
      return null;
    }
    const filteredObjects =
      searchTerm !== ""
        ? objects.filter((object) => object.title.includes(searchTerm))
        : objects;

    const createObject = useCreateObject();
    return (
      <SelectContent className="flex flex-col gap-1">
        <Input placeholder="Search" className="mb-1" />
        {filteredObjects.map((object) => (
          <SelectItem key={object.id} value={object.id}>
            {object.title}
          </SelectItem>
        ))}
        {filteredObjects.length === 0 && (
          <>
            <SelectItem disabled value={"No objects"}>
              No objects of this type. You can create one.
            </SelectItem>
            {/* TODO: Create object code */}
            <Button
              size={"sm"}
              className="w-full"
              variant={"secondary"}
              onClick={(e) => {
                e.preventDefault();
                const objectID = uuid();
                createObject(objectID, {
                  ...DEFAULT_OBJECT,
                  type: objectTypeID,
                  title: "New " + objectType.name,
                });
              }}
            >
              Create {objectType.name}
            </Button>
          </>
        )}
      </SelectContent>
    );
  }
);

const ObjectSelect = ({
  objectTypeID,
  value,
  onValueChange,
}: {
  objectTypeID: string;
  value: string;
  onValueChange: (value: string) => void;
}) => {
  const { data: objectType } = useObjectType(objectTypeID);
  const [searchTerm, setSearchTerm] = useState("");

  if (!objectType) {
    return null;
  }
  const objects = useObjectsOfType(objectTypeID);
  if (!objects) {
    return null;
  }
  return (
    <Select onValueChange={onValueChange} value={value}>
      <SelectTrigger>
        <SelectValue
          placeholder={`Select a ${objectType.name}`}
          defaultValue={
            value ? objects.find((object) => object.id === value)?.title : ""
          }
        />
      </SelectTrigger>
      <SelectContent>
        <Input
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ObjectSelectFilteredObjects
          searchTerm={searchTerm}
          objectTypeID={objectTypeID}
          objectType={objectType}
        />
      </SelectContent>
    </Select>
  );
};

export default ObjectSelect;
