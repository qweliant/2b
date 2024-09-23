import React, { useEffect, useRef } from "react";
import Sidebar from "@/components/blocks/layout/sidebar";
import Header from "@/components/blocks/layout/header";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ImperativePanelHandle } from "react-resizable-panels";
import { useSidebarState } from "../store/layoutStore";
import Content from "./content";

const Root = () => {
  const { setSidebarOpen, isSidebarOpen } = useSidebarState();
  const sidebarRef = useRef<ImperativePanelHandle>(null);

  useEffect(() => {
    if (sidebarRef.current) {
      if (isSidebarOpen) {
        sidebarRef.current.expand();
      } else {
        sidebarRef.current.collapse();
      }
    }
  }, [isSidebarOpen]);

  console.log("Root rendered");
  // useEffect(() => {
  // }, []);

  return (
    <div className=" h-[100vh]">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={isSidebarOpen ? 20 : 0}
          minSize={15}
          maxSize={25}
          collapsible
          onCollapse={() => setSidebarOpen(false)}
          onExpand={() => setSidebarOpen(true)}
          ref={sidebarRef}
          className="transition-all duration-100 ease-in-out"
        >
          <Sidebar />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel className="bg-muted h-full">
          <Header />

          <Content />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Root;
