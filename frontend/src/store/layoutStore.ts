import { produce } from "immer";
import { ReadStateFile, WriteStateFile } from "../../wailsjs/go/main/App";
import { useQueryWrapper } from "./util";
import { z } from "zod";

const tabTypes = z.enum([
  "object",
  "createObject",
  "objectType",
  "createObjectType",
]);

type TabType = z.infer<typeof tabTypes>;

const tabSchema = z.object({
  type: tabTypes.default("object"),
  id: z.string(),
});

const tabsSchema = z.object({
  activeTab: z.string().nullable(),
  tabs: z.array(tabSchema).default([]),
});

const stateSchema = z.object({
  isSidebarOpen: z.boolean(),
  tabsState: tabsSchema,
  isBotSidebarOpen: z.boolean().optional(),
});

type UIState = z.infer<typeof stateSchema>;

function useStateFile() {
  return useQueryWrapper<UIState>({
    queryKey: ["state"],
    queryFn: async () => {
      return JSON.parse(await ReadStateFile());
    },
    editFn: (old: UIState, newState: UIState) => {
      return { ...old, ...newState };
    },
    mutateFn: (newState: UIState) => {
      return WriteStateFile(JSON.stringify(newState));
    },
  });
}

// Tabs state

const createTab = (
  tabId: string,
  tabType: TabType,
  data: UIState,
  mutate: (newState: UIState) => void
) => {
  if (data.tabsState.tabs.find((tab) => tab.id === tabId)) {
    setActiveTab(tabId, data, mutate);
    return;
  }
  const newState = produce(data, (draft) => {
    draft.tabsState.tabs.push({ type: tabType, id: tabId });
    draft.tabsState.activeTab = tabId;
  });
  mutate(newState);
};

const removeTab = (
  tabId: string,
  data: UIState,
  mutate: (newState: UIState) => void
) => {
  const newState = produce(data, (draft) => {
    draft.tabsState.tabs = draft.tabsState.tabs.filter(
      (tab) => tab.id !== tabId
    );
    if (draft.tabsState.activeTab === tabId) {
      draft.tabsState.activeTab = draft.tabsState.tabs[0]?.id ?? null;
    }
  });
  mutate(newState);
};

const setActiveTab = (
  tabId: string,
  data: UIState,
  mutate: (newState: UIState) => void
) => {
  if (data.tabsState.activeTab === tabId) return;
  const newState = produce(data, (draft) => {
    draft.tabsState.activeTab = tabId;
  });
  mutate(newState);
};

function useTabsState(): {
  tabsState: UIState["tabsState"];
  createTab: (
    tabId: string,
    tabType: "object" | "createObject" | "objectType" | "createObjectType"
  ) => void;
  removeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  isLoading: boolean;
  error: Error | null;
} {
  const { data, mutate, isLoading, error } = useStateFile();
  if (!data) {
    return {
      tabsState: { tabs: [], activeTab: null },
      createTab: () => {},
      removeTab: () => {},
      setActiveTab: () => {},
      isLoading,
      error,
    };
  }

  return {
    tabsState: data.tabsState,
    createTab: (tabId: string, tabType: string) =>
      createTab(tabId, tabType as any, data, mutate),
    removeTab: (tabId: string) => removeTab(tabId, data, mutate),
    setActiveTab: (tabId: string) => setActiveTab(tabId, data, mutate),
    isLoading,
    error,
  };
}

// Sidebar state

const setSidebarOpen = (
  isOpen: boolean,
  data: UIState,
  mutate: (newState: UIState) => void
) => {
  const newState = produce(data, (draft) => {
    draft.isSidebarOpen = isOpen;
  });
  mutate(newState);
};

function useSidebarState(): {
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  isLoading: boolean;
  error: Error | null;
} {
  const { data, mutate, isLoading, error } = useStateFile();

  if (!data) {
    return {
      isSidebarOpen: true,
      setSidebarOpen: () => {},
      isLoading,
      error,
    };
  }

  return {
    isSidebarOpen: data.isSidebarOpen,
    setSidebarOpen: (isOpen: boolean) => setSidebarOpen(isOpen, data, mutate),
    isLoading,
    error,
  };
}

function setBotSidebarOpen(
  isOpen: boolean,
  data: UIState,
  mutate: (newState: UIState) => void
) {
  const newState = produce(data, (draft) => {
    draft.isBotSidebarOpen = isOpen;
  });
  mutate(newState);
}

function useBotSidebarState(): {
  isBotSidebarOpen: boolean;
  setBotSidebarOpen: (isOpen: boolean) => void;
  isLoading: boolean;
  error: Error | null;
} {
  const { data, mutate, isLoading, error } = useStateFile();

  if (!data) {
    return {
      isBotSidebarOpen: true,
      setBotSidebarOpen: () => {},
      isLoading,
      error,
    };
  }

  return {
    isBotSidebarOpen: data.isBotSidebarOpen ?? false,
    setBotSidebarOpen: (isOpen: boolean) =>
      setBotSidebarOpen(isOpen, data, mutate),
    isLoading,
    error,
  };
}

export { useSidebarState, useTabsState, useBotSidebarState };
