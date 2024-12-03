import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  DEFAULT_OBJECT,
  ObjectInstance,
  useCreateObject,
  useObjectsOfType,
} from "../store/objectsStore";
import { useObjectType } from "../store/objectTypesStore";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ObjectType } from "../types/objectTypes";
import { v4 as uuid } from "uuid";
import { memo, useState } from "react";

const ObjectSelectItems = ({
  objects,
  objectTypeID,
  objectType,
  searchTerm,
  createObject,
  value,
}: {
  objects: ObjectInstance[];
  objectTypeID: string;
  objectType: ObjectType;
  searchTerm: string;
  value: string;
  createObject: (id: string, object: any) => void;
}) => {
  const filteredObjects =
    searchTerm !== ""
      ? objects.filter((object) =>
          object.title
            .toLocaleLowerCase()
            .includes(searchTerm.toLocaleLowerCase()) || object.id === value
        )
      : objects;
  const otherObjects = objects.filter(
    (object) =>
      !filteredObjects.find((filteredObject) => filteredObject.id === object.id)
  );
  return (
    <>
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
                title: searchTerm,
              });
            }}
          >
            Create {objectType.name}
          </Button>
        </>
      )}
    </>
  );
};

const ObjectSelectFilteredObjects = memo(
  ({
    objectTypeID,
    objectType,
    value
  }: {
    objectTypeID: string;
    objectType: ObjectType;
    value: string;
  }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const objects = useObjectsOfType(objectTypeID);
    if (!objects) {
      return null;
    }

    const createObject = useCreateObject();
    return (
      <>
        <Input
          key={"search" + objectTypeID}
          placeholder="Search"
          className="mb-1"
          onChange={(e) => {
            setSearchTerm(e.target.value);
            e.preventDefault();
            e.stopPropagation();
          }}
          value={searchTerm}
          autoFocus={true}
        />
        <ObjectSelectItems
          objects={objects}
          objectTypeID={objectTypeID}
          objectType={objectType}
          searchTerm={searchTerm}
          createObject={createObject}
          value={value}
        />
      </>
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
            value ? objects.find((object) => object.id === value)?.id : ""
          }
        />
      </SelectTrigger>
      <SelectContent>
        <ObjectSelectFilteredObjects
          value={value}
          objectTypeID={objectTypeID}
          objectType={objectType}
        />
      </SelectContent>
    </Select>
  );
};

export default ObjectSelect;
