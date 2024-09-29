import React, { useState } from "react";
import { Separator } from "../../../ui/separator";
import { Button } from "../../../ui/button";
import {
  Bot,
  LucideCuboid,
  LucideSettings2,
  Search,
  Send,
  User,
} from "lucide-react";
import { ScrollArea } from "../../../ui/scroll-area";
import { Avatar } from "../../../ui/avatar";
import { Input } from "../../../ui/input";

type MessageRole = "user" | "ai" | "reference";

type Message = {
  id: number;
  role: MessageRole;
  content: string;
  timestamp: string;
  reference?: {
    title: string;
  };
};

const chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "user",
      content: "Hello, can you tell me about React?",
      timestamp: "10:00 AM",
    },
    {
      id: 2,
      role: "ai",
      content:
        "React is a popular JavaScript library for building user interfaces. It was developed by Facebook and is widely used for creating interactive web applications.",
      timestamp: "10:01 AM",
      reference: {
        title: "React Official Documentation",
      },
    },
  ]);
  return (
    <div
      className="flex flex-col px-4 py-4 justify-between"
      style={{
        height: "calc(100vh - 42px)",
      }}
    >
      <div>
        <div>
          <div className="flex justify-between">
            <p className="text-xl font-bold">Chat</p>
            <Button size={"iconSm"} variant={"outline"}>
              <LucideSettings2 size={14} />
            </Button>
          </div>
          <p className="text-muted-foreground text-sm">Using LM Studio...</p>
        </div>
        <Separator />
        <ScrollArea>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col mb-4 ${
                message.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div className="flex items-center mb-1">
                <span className="text-sm font-medium">
                  {message.role === "user"
                    ? "You"
                    : message.role === "ai"
                    ? "AI"
                    : "Reference"}
                </span>
                <span className="text-xs text-muted-foreground ml-2">
                  {message.timestamp}
                </span>
              </div>
              <div
                className={`rounded-lg p-2 max-w-[80%] ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : message.role === "ai"
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-muted"
                }`}
              >
                {message.content}
                {message.reference && (
                  <div className="flex flex-col mt-2 p-2 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Reference</p>
                    <div className="flex gap-2 mt-2 cursor-pointer">
                      <LucideCuboid size={18} />
                      <p className="text-sm">{message.reference.title}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
      <div className="flex gap-2">
        <Input placeholder="Type a message..." />
        <Button>
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
};

export default chat;
