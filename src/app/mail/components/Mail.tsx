"use client";
import { SeparatorHorizontal } from "lucide-react";
import React, { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import { TooltipProvider } from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";
import { Separator } from "@radix-ui/react-separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import AccountSwitcher from "./AccountSwitcher";
import SideBar from "./SideBar";

type Props = {
  defaultLayout: number[] | undefined;
  collapSize: number;
  defaultCollapsed: boolean;
};
const Mail = ({
  defaultLayout = [20, 32, 48],
  collapSize,
  defaultCollapsed,
}: Props) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          console.log(sizes);
        }}
        className="h-full min-h-screen items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={collapSize}
          collapsible
          minSize={15}
          maxSize={40}
          onCollapse={() => {
            setIsCollapsed(true);
          }}
          onResize={() => {
            setIsCollapsed(false);
          }}
          className={cn(
            isCollapsed &&
              "min-w-[50px] transition-all duration-300 ease-in-out",
          )}
        >
          <div className="flex h-full flex-1 flex-col">
            <div
              className={cn(
                "flex h-[52px] items-center justify-between",
                isCollapsed ? "h-[52px]" : "px-2",
              )}
            >
              <AccountSwitcher isCollapsed={isCollapsed} />
            </div>
            <Separator />
            <SideBar isCollapsed={isCollapsed}/>
            <div className="flex-1"></div>
            ask ai
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <Tabs defaultValue="inbox">
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">Inbox</h1>
              <TabsList className="ml-auto">
                <TabsTrigger
                  value="inbox"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Inbox
                </TabsTrigger>
                <TabsTrigger
                  value="done"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Done
                </TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            search bar
            <TabsContent value="inbox">inbox</TabsContent>
            <TabsContent value="done">done</TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]} minSize={45}>
          thread dispaly
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
};

export default Mail;
