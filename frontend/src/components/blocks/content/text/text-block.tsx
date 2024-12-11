import React from "react";
import { ObjectContent, ObjectInstance } from "../../../../store/objectsStore";
import { ReactFrameworkOutput } from "@remirror/react";
import TextEditor, { Extensions } from "./text-editor";
import { Button } from "../../../ui/button";
import { GripVertical, LucideSparkles } from "lucide-react";
import { produce } from "immer";
import { cn } from "../../../../lib/utils";

interface TextBlockProps {
  editorRef: React.MutableRefObject<ReactFrameworkOutput<Extensions> | null>;
  object: ObjectInstance;
  contentObject: ObjectContent;
  contentKey: string;
  defaultFont: string;
  freeDrag: boolean;
  mutate: (newObject: ObjectInstance) => void;
}

const TextBlock: React.FC<TextBlockProps> = ({
  // editorRef,
  object,
  contentObject,
  defaultFont,
  contentKey,
  freeDrag,
  mutate,
}) => {
  return (
    <>
      <Button
        variant={"ghost"}
        size={"iconSm"}
        className={cn(
          " absolute top-2 right-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-10"
        )}
        onClick={() => {
          // addMessage({
          //   id: messages.length,
          //   role: "user",
          //   content: `Summarize some content for me: \n${contentObj.content.slice(
          //     0,
          //     15
          //   )}...`,
          //   timestamp: "Just now",
          //   reference: {
          //     title: object.title,
          //     id: object.id,
          //   },
          // });
          // GetSummary(contentObj.content).then((response) => {
          //   addMessage({
          //     id: messages.length,
          //     role: "ai",
          //     content: response,
          //     timestamp: "Just now",
          //   });
          // });
        }}
      >
        <LucideSparkles className="text-muted-foreground" size={18} />
      </Button>
      <TextEditor
        mutate={(newState) => {
          const newObject = produce(object, (draft) => {
            if (!draft.contents) draft.contents = {};
            draft.contents[contentKey].content = newState;
          });
          mutate(newObject);
        }}
        freeDrag={freeDrag}
        content={contentObject.content}
        defaultFont={defaultFont}
      />
      <GripVertical
        className="drag-handle left-0 top-[50%] absolute cursor-move text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
        size={20}
      />
    </>
  );
};

export default React.memo(TextBlock);
