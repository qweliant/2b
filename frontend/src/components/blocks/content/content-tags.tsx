import React from "react";
import { Badge } from "../../ui/badge";
import { cn } from "@/lib/utils"; // Assuming you have a cn utility function

type ContentTags =
  | "Saving"
  | "Saved"
  | "Error"
  | "Not AI Ready"
  | "Loading"
  | "AI Ready";

interface ContentTagsProps {
  type: ContentTags;
  className?: string;
}

const ContentTag: React.FC<ContentTagsProps> = ({ type, className }) => {
  if (type === "Saved") {
    return (
      <Badge
        className={cn(
          "bg-green-500 hover:bg-green-600 text-primary-foreground",
          className
        )}
      >
        <span className="inline-block w-2 h-2 mr-2 bg-green-700 rounded-full"></span>
        Saved
      </Badge>
    );
  } else if (type === "Saving") {
    return (
      <Badge
        className={cn(
          "bg-blue-500 hover:bg-blue-600 text-primary-foreground",
          className
        )}
      >
        <span className="inline-block w-2 h-2 mr-2 bg-blue-700 rounded-full"></span>
        Saving
      </Badge>
    );
  } else if (type === "Error") {
    return (
      <Badge
        className={cn(
          "bg-red-500 hover:bg-red-600 text-primary-foreground",
          className
        )}
      >
        <span className="inline-block w-2 h-2 mr-2 bg-red-700 rounded-full"></span>
        Error
      </Badge>
    );
  } else if (type === "Not AI Ready") {
    return (
      <Badge
        className={cn(
          "bg-gray-500 hover:bg-gray-600 text-primary-foreground flex items-center w-fit",
          className
        )}
      >
        <span className="inline-block w-2 h-2 mr-2 bg-gray-700 rounded-full"></span>
        <p className="text-nowrap w-full">Not AI Ready</p>
      </Badge>
    );
  } else if (type === "Loading") {
    return (
      <Badge
        className={cn(
          "bg-yellow-500 hover:bg-yellow-600 text-primary-foreground",
          className
        )}
      >
        <span className="inline-block w-2 h-2 mr-2 bg-yellow-700 rounded-full"></span>
        Loading
      </Badge>
    );
  } else if (type === "AI Ready") {
    return (
      <Badge
        className={cn(
          "bg-purple-500 hover:bg-purple-600 text-primary-foreground",
          className
        )}
      >
        <span className="inline-block w-2 h-2 mr-2 bg-green-700 rounded-full"></span>
        AI Ready
      </Badge>
    );
  }
  return null;
};

export default ContentTag;
