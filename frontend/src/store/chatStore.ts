import { create } from "zustand";
import { GetChat } from "../../wailsjs/go/main/App";

type MessageRole = "user" | "ai" | "reference";

type Message = {
  id: number;
  role: MessageRole;
  content: string;
  timestamp: string;
  reference?: {
    title: string;
    id: string;
  };
};

const useMessageStore = create<{
  messages: Message[];
  addMessage: (message: Message) => void;
}>((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
}));

function useSendMessage() {
  const { messages, addMessage } = useMessageStore();
  return async (message: Message) => {
    addMessage(message);
    const response = await GetChat(JSON.stringify(messages));
    addMessage({
      id: messages.length + 1,
      role: "ai",
      content: response,
      timestamp: "Just now",
    });
  };
}

export type { MessageRole, Message };
export { useMessageStore, useSendMessage };
