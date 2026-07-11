"use client";

import * as React from "react";
import { GripVertical } from "lucide-react";
import { Group, Panel, Separator } from "react-resizable-panels";

import { cn } from "@/lib/utils";

const ResizablePanelGroup = ({ className, ...props }: React.ComponentProps<typeof Group>) => (
  <Group
    // Integrated user-select safeguards to prevent text clipping blocks during interactive drags
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col select-none", 
      className
    )}
    {...props}
  />
);

const ResizablePanel = Panel;

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof Separator> & {
  withHandle?: boolean;
}) => (
  <Separator
    className={cn(
      // Upgraded standard tracking line into discrete translucent deep matte trace slots
      "relative flex w-px items-center justify-center bg-white/[0.04] transition-colors duration-300 " +
      "after:absolute after:inset-y-0 after:left-1/2 after:w-2 after:-translate-x-1/2 cursor-col-resize " +
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/40 " +
      "data-[resizable-handle-active]:bg-purple-500/40 " + // Linear neon activation state trace
      "data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:cursor-row-resize " +
      "data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-2 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 " +
      "[&[data-panel-group-direction=vertical]>div]:rotate-90",
      className,
    )}
    {...props}
  >
    {withHandle && (
      // Refactored flat gray control keys into frosted high-fidelity space glass anchors blocks
      <div className="z-50 flex h-5 w-3.5 items-center justify-center rounded-md border border-white/10 bg-[#0c0d14]/90 text-purple-400 shadow-2xl shadow-purple-950/20 transition-all duration-300 hover:text-white hover:border-purple-500/30 active:scale-90">
        <GripVertical className="h-3 w-3 stroke-[2.5]" />
      </div>
    )}
  </Separator>
);

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
