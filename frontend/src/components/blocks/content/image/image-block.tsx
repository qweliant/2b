import { GripVertical } from "lucide-react";
import React from "react";
import { Button } from "../../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../../../ui/dialog";
import { Input } from "../../../ui/input";
import { ObjectInstance, ObjectContent } from "../../../../store/objectsStore";
import { produce } from "immer";

interface ImageBlockProps {
  object: ObjectInstance;
  contentObject: ObjectContent;
  contentKey: string;
  mutate: (newObject: ObjectInstance) => void;
}

const ImageBlock: React.FC<ImageBlockProps> = ({
  object,
  contentObject,
  contentKey,
  mutate,
}) => {
  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    // # read file as a base64 encoded string

    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      const newObject = produce(object, (draft) => {
        if (!draft.contents) draft.contents = {};
        draft.contents[contentKey].content = imageUrl;
      });
      mutate(newObject);
    };
    reader.readAsDataURL(file);
  };
  return (
    <div className="relative w-full h-full">
      <img
        src={contentObject?.content || "https://placehold.co/600x400"}
        alt="placeholder"
        className="w-full h-full object-cover"
      />
      <GripVertical
        className="drag-handle left-0 top-[50%] absolute cursor-move text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
        size={20}
      />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            size="sm"
          >
            Upload Image
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>Upload Image</DialogHeader>
          <Button
            onClick={() => {
              const newObject = produce(object, (draft) => {
                if (!draft.contents) draft.contents = {};
                delete draft.contents[contentKey];
              });
              mutate(newObject);
            }}
          >
            Delete Image
          </Button>
          <Input type="file" accept="image/*" onChange={onUpload} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default React.memo(ImageBlock);
