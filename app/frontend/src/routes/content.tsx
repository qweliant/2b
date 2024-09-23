import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { useTabsState } from "../store/layoutStore";
import CreateObjectType from "../components/blocks/CreateObject";

const Content = () => {
  const { tabsState, setActiveTab } = useTabsState();
  const activeTab = tabsState.activeTab;
  return (
    <div
      className="px-4 py-1"
      style={{
        height: "calc(100vh - 42px)",
      }}
    >
      <Tabs className="h-full" value={activeTab ?? ""}>
        <TabsList className="h-[4%]">
          {tabsState.tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.type === "createObjectType"
                ? "Create Object Type"
                : "Object Type"}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabsState.tabs.map((tab) => (
          <TabsContent
            key={tab.id}
            value={tab.id}
            className="bg-background rounded-md shadow-md h-[94%] overflow-y-scroll"
          >
            {tab.type === "createObjectType" ? (
              <CreateObjectType />
            ) : (
              "Object Type"
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Content;
