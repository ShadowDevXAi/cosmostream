"use client";

import * as React from "react";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
}) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        // Remapped background channels to utilize dark matter glass templates
        "bg-[#0c0d14]/80 border border-white/5 backdrop-blur-xl group/calendar p-4 rounded-2xl shadow-2xl relative select-none [--cell-size:2.2rem]",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className,
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) => date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit text-white", defaultClassNames.root),
        months: cn("relative flex flex-col gap-4 md:flex-row", defaultClassNames.months),
        month: cn("flex w-full flex-col gap-3", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1 z-20",
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-(--cell-size) w-(--cell-size) select-none p-0 rounded-xl border-white/5 bg-white/5 text-purple-400 hover:bg-white/10 hover:text-white aria-disabled:opacity-20 transition-all",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-(--cell-size) w-(--cell-size) select-none p-0 rounded-xl border-white/5 bg-white/5 text-purple-400 hover:bg-white/10 hover:text-white aria-disabled:opacity-20 transition-all",
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size) border-b border-white/5 pb-2",
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-xs font-mono font-bold tracking-wider text-purple-300 uppercase",
          defaultClassNames.dropdowns,
        ),
        dropdown_root: cn(
          "border-white/5 bg-black/40 text-neutral-200 relative rounded-lg border focus-within:border-purple-500/40",
          defaultClassNames.dropdown_root,
        ),
        dropdown: cn("bg-[#0c0d14] absolute inset-0 opacity-0 cursor-pointer", defaultClassNames.dropdown),
        caption_label: cn(
          "select-none font-mono text-xs font-black tracking-widest uppercase text-neutral-200",
          captionLayout === "label"
            ? ""
            : "[&>svg]:text-purple-400 flex h-8 items-center gap-1 rounded-md pl-2 pr-1 [&>svg]:size-3.5",
          defaultClassNames.caption_label,
        ),
        table: "w-full border-collapse mt-1",
        weekdays: cn("flex justify-between border-b border-white/[0.03] pb-1", defaultClassNames.weekdays),
        weekday: cn(
          "text-purple-400/80 flex-1 select-none rounded-md text-[10px] font-mono font-bold uppercase tracking-wider text-center",
          defaultClassNames.weekday,
        ),
        week: cn("mt-1.5 flex w-full justify-between gap-1", defaultClassNames.week),
        week_number_header: cn("w-(--cell-size) select-none text-[10px] font-mono font-bold text-muted-foreground/40", defaultClassNames.week_number_header),
        week_number: cn(
          "text-muted-foreground/40 select-none font-mono text-[10px]",
          defaultClassNames.week_number,
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full select-none p-0 text-center flex items-center justify-center",
          defaultClassNames.day,
        ),
        range_start: cn("bg-purple-600/20 rounded-l-xl", defaultClassNames.range_start),
        range_middle: cn("bg-purple-500/10 rounded-none", defaultClassNames.range_middle),
        range_end: cn("bg-purple-600/20 rounded-r-xl", defaultClassNames.range_end),
        today: cn(
          "border border-purple-500/40 bg-purple-500/5 text-purple-400 font-bold rounded-xl",
          defaultClassNames.today,
        ),
        outside: cn(
          "text-muted-foreground/20 opacity-30 pointer-events-none",
          defaultClassNames.outside,
        ),
        disabled: cn("text-muted-foreground/20 opacity-25 pointer-events-none cross-out", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return <div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />;
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return <ChevronLeftIcon className={cn("size-3.5 stroke-[2.5]", className)} {...props} />;
          }

          if (orientation === "right") {
            return <ChevronRightIcon className={cn("size-3.5 stroke-[2.5]", className)} {...props} />;
          }

          return <ChevronDownIcon className={cn("size-3.5 stroke-[2.5]", className)} {...props} />;
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center font-mono text-[10px]">
                {children}
              </div>
            </td>
          );
        },
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        // Dynamic status colors mapped perfectly into space gradient vectors
        "data-[selected-single=true]:bg-gradient-to-br data-[selected-single=true]:from-purple-600 data-[selected-single=true]:to-indigo-600 data-[selected-single=true]:text-white data-[selected-single=true]:shadow-lg data-[selected-single=true]:shadow-purple-500/20 data-[selected-single=true]:rounded-xl " +
        "data-[range-middle=true]:bg-purple-500/10 data-[range-middle=true]:text-purple-300 data-[range-middle=true]:rounded-none " +
        "data-[range-start=true]:bg-gradient-to-r data-[range-start=true]:from-purple-600 data-[range-start=true]:to-indigo-600 data-[range-start=true]:text-white data-[range-start=true]:rounded-xl " +
        "data-[range-end=true]:bg-gradient-to-r data-[range-end=true]:from-indigo-600 data-[range-end=true]:to-purple-600 data-[range-end=true]:text-white data-[range-end=true]:rounded-xl " +
        "group-data-[focused=true]/day:ring-2 group-data-[focused=true]/day:ring-purple-500/40 text-neutral-300 hover:bg-white/5 hover:text-white " +
        "flex aspect-square h-auto w-full min-w-(--cell-size) flex-col gap-1 font-mono text-xs font-medium rounded-xl transition-all duration-200 active:scale-95 group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 [&>span]:text-[11px]",
        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
