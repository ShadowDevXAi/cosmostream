import * as React from "react";

import { cn } from "@/lib/utils";

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    // Wrapped main window inside an alpha-frosted capsule shell container with precision border tracks
    <div className="relative w-full overflow-auto scrollbar-none rounded-2xl border border-white/5 bg-[#0c0d14]/40 backdrop-blur-md">
      <table ref={ref} className={cn("w-full caption-bottom text-xs select-none border-collapse", className)} {...props} />
    </div>
  ),
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b border-white/[0.04] bg-white/[0.01]", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t border-white/5 bg-white/[0.02] font-mono text-xs font-bold text-neutral-300 [&>tr]:last:border-b-0",
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      // Added continuous horizontal gradients track highlights when individual cells are focused or hovered
      className={cn(
        "border-b border-white/[0.04] transition-all duration-300 " +
        "hover:bg-gradient-to-r hover:from-purple-600/5 hover:to-transparent hover:text-white " +
        "data-[state=selected]:bg-purple-500/10 data-[state=selected]:text-purple-300 data-[state=selected]:border-purple-500/20",
        className,
      )}
      {...props}
    />
  ),
);
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    // Remapped table headers into sharp, micro tracked monospace neon labels properties
    className={cn(
      "h-12 px-4 text-left align-middle font-mono text-[11px] font-black tracking-wider uppercase text-purple-400/80 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className,
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    // Locked generic strings data inside aligned monospace high-readability telemetry cells
    className={cn(
      "p-4 align-middle font-mono text-xs text-neutral-300 tracking-wide [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className,
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption 
    ref={ref} 
    className={cn("mt-4 font-mono text-[10px] font-medium tracking-widest uppercase text-muted-foreground/30", className)} 
    {...props} 
  />
));
TableCaption.displayName = "TableCaption";

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
