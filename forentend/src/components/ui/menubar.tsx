"use client";

import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { Check, ChevronRight, Circle } from "lucide-react";

import { cn } from "@/lib/utils";

function MenubarMenu({ ...props }: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu {...props} />;
}

function MenubarGroup({ ...props }: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group {...props} />;
}

function MenubarPortal({ ...props }: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal {...props} />;
}

function MenubarRadioGroup({ ...props }: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return <MenubarPrimitive.RadioGroup {...props} />;
}

function MenubarSub({ ...props }: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />;
}

const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  // Swapped flat horizontal bars with dark matter frosted glass layouts
  <MenubarPrimitive.Root
    ref={ref}
    className={cn(
      "flex h-11 items-center space-x-1 rounded-2xl border border-white/5 bg-[#0c0d14]/80 p-1.5 shadow-xl backdrop-blur-md select-none",
      className,
    )}
    {...props}
  />
));
Menubar.displayName = MenubarPrimitive.Root.displayName;

const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      // Shifted headers tracking slots to leverage tight responsive uppercase font structures
      "flex cursor-pointer select-none items-center rounded-xl px-3.5 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-neutral-300 outline-none transition-all duration-300 " +
      "hover:text-purple-400 focus:bg-white/5 data-[state=open]:bg-white/5 data-[state=open]:text-purple-400 data-[state=open]:border-white/5 border border-transparent",
      className,
    )}
    {...props}
  />
));
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName;

const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    className={cn(
      // Synced nested dropdown hooks to handle smooth horizontal sliding shifts smoothly
      "flex cursor-pointer select-none items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-mono font-medium tracking-wide text-neutral-300 border border-transparent outline-none transition-all duration-200 " +
      "focus:bg-gradient-to-r focus:from-purple-600/15 focus:to-indigo-600/5 focus:text-purple-300 focus:border-purple-500/10 " +
      "data-[state=open]:bg-gradient-to-r data-[state=open]:from-purple-600/15 data-[state=open]:text-purple-300 " +
      "[&_svg]:size-3.5 [&_svg]:shrink-0 [&_svg]:text-neutral-400 focus:[&_svg]:text-purple-400",
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto text-neutral-400 transition-colors" />
  </MenubarPrimitive.SubTrigger>
));
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName;

const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    className={cn(
      // Added high opacity shadows and alpha bounds to prevent clipping on nested layouts
      "z-50 min-w-[9rem] overflow-hidden rounded-xl border border-white/5 bg-[#0c0d14]/95 text-white p-1.5 shadow-2xl backdrop-blur-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-menubar-content-transform-origin)",
      className,
    )}
    {...props}
  />
));
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName;

const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(({ className, align = "start", alignOffset = -4, sideOffset = 8, ...props }, ref) => (
  <MenubarPrimitive.Portal>
    <MenubarPrimitive.Content
      ref={ref}
      align={align}
      alignOffset={alignOffset}
      sideOffset={sideOffset}
      className={cn(
        // Transformed basic select windows to gorgeous floating dark matter cloud slots capsules
        "z-50 min-w-[12rem] overflow-hidden rounded-2xl border border-white/5 bg-[#0c0d14]/95 text-white p-1.5 shadow-2xl shadow-purple-950/40 backdrop-blur-xl relative " +
        "data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-menubar-content-transform-origin)",
        className,
      )}
      {...props}
    >
      {/* Precision linear cosmic accent gradient line mapping on top window grid edge */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent pointer-events-none" />
      <div {...props} />
    </MenubarPrimitive.Content>
  </MenubarPrimitive.Portal>
));
MenubarContent.displayName = MenubarPrimitive.Content.displayName;

const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-mono font-medium tracking-wide text-neutral-300 border border-transparent outline-none transition-all duration-200 " +
      "focus:bg-gradient-to-r focus:from-purple-600/15 focus:to-indigo-600/5 focus:text-purple-300 focus:border-purple-500/10 " +
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-20 [&>svg]:size-3.5 [&>svg]:shrink-0 [&>svg]:text-neutral-400 focus:[&>svg]:text-purple-400",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
MenubarItem.displayName = MenubarPrimitive.Item.displayName;

const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-xl py-2 pl-8 pr-3 text-xs font-mono font-medium tracking-wide text-neutral-300 border border-transparent outline-none transition-all duration-200 " +
      "focus:bg-gradient-to-r focus:from-purple-600/15 focus:text-purple-300 data-[disabled]:pointer-events-none data-[disabled]:opacity-20",
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2.5 flex h-3.5 w-3.5 items-center justify-center text-purple-400">
      <MenubarPrimitive.ItemIndicator>
        <Check className="h-3.5 w-3.5 stroke-[3]" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
));
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName;

const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-xl py-2 pl-8 pr-3 text-xs font-mono font-medium tracking-wide text-neutral-300 border border-transparent outline-none transition-all duration-200 " +
      "focus:bg-gradient-to-r focus:from-purple-600/15 focus:text-purple-300 data-[disabled]:pointer-events-none data-[disabled]:opacity-20",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2.5 flex h-3.5 w-3.5 items-center justify-center text-purple-400">
      <MenubarPrimitive.ItemIndicator>
        <Circle className="h-1.5 w-1.5 fill-current shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
));
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName;

const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn(
      "px-3 py-2 text-[10px] font-mono font-black tracking-widest uppercase text-purple-400/70 border-b border-white/[0.02] mb-1.5 pb-1.5",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
MenubarLabel.displayName = MenubarPrimitive.Label.displayName;

const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1.5 h-px bg-white/[0.04]", className)}
    {...props}
  />
));
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName;

const MenubarShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto font-mono text-[10px] font-black tracking-widest text-muted-foreground/40 bg-white/5 border border-white/5 px-1.5 py-0.5 rounded-md uppercase", className)}
      {...props}
    />
  );
};
MenubarShortcut.displayName = "MenubarShortcut";

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
};
