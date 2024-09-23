import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CardTitle } from "@/components/ui/card";
import {
  LightbulbIcon,
  TagIcon,
  FileTextIcon,
  ImageIcon,
  PlusIcon,
  ChevronDownIcon,
} from "lucide-react";
import { Separator } from "../ui/separator";

const ColorPicker = ({
  color,
  onChange,
}: {
  color: string;
  onChange: (color: string) => void;
}) => {
  const colors = [
    "bg-red-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-gray-500",
  ];

  return (
    <div className="flex space-x-2 mt-2">
      {colors.map((bgColor) => (
        <button
          key={bgColor}
          className={`w-6 h-6 rounded-full ${bgColor} transition-all duration-200 ease-in-out ${
            color === bgColor ? "ring-2 ring-offset-2 ring-gray-400" : ""
          }`}
          onClick={() => onChange(bgColor)}
        />
      ))}
    </div>
  );
};
export default function CreateObjectType() {
  const [color, setColor] = useState("bg-blue-500");
  const [properties, setProperties] = useState([
    {
      name: "Title",
      type: "Text",
      icon: <LightbulbIcon className="w-4 h-4" />,
    },
    {
      name: "Description",
      type: "Text",
      icon: <FileTextIcon className="w-4 h-4" />,
    },
    {
      name: "Tags",
      type: "Multi-select",
      icon: <TagIcon className="w-4 h-4" />,
    },
    {
      name: "Notes",
      type: "Rich text",
      icon: <FileTextIcon className="w-4 h-4" />,
    },
    {
      name: "Cover Image",
      type: "Image",
      icon: <ImageIcon className="w-4 h-4" />,
    },
  ]);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <CardTitle>Create Object Type</CardTitle>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="icon">Icon</Label>
            <Input id="icon" placeholder="Select an icon" />
          </div>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter name" defaultValue="Zettel" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="plural">Plural of name</Label>
            <Input
              id="plural"
              placeholder="Enter plural name"
              defaultValue="Zettels"
            />
          </div>
          <div>
            <Label htmlFor="color">Color</Label>
            <ColorPicker color={color} onChange={setColor} />{" "}
          </div>
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Your description for this object type"
          />
        </div>
      </div>
      <Separator />
      <CardTitle>Edit properties</CardTitle>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Add, remove, and customize the properties of this object type.{" "}
          <a href="#" className="text-primary hover:underline">
            Learn more
          </a>
          .
        </p>
        {properties.map((prop, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {prop.icon}
              <span>{prop.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">{prop.type}</span>
              <Button variant="ghost" size="icon">
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        <Button variant="outline" className="w-full">
          <PlusIcon className="mr-2 h-4 w-4" /> Add property
        </Button>
      </div>
    </div>
  );
}
