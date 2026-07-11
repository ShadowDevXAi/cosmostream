"use client";

import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { Minus } from "lucide-react";

import { cn } from "@/lib/utils";

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
      "flex items-center gap-3 has-[:disabled]:opacity-30 select-none",
      containerClassName,
    )}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props}
  />
));
InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  // Spaced out the slots grid slightly to look like high-end terminal nodes
  <div ref={ref} className={cn("flex items-center gap-1.5", className)} {...props} />
));
InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { index: number }
>(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

  return (
    <div
      ref={ref}
      className={cn(
        // Shifted standard cells to chunkier isolated frosted matrix frames with micro transitions
        "relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.01] font-mono text-sm font-black text-neutral-100 shadow-xl transition-all duration-300",
        // Infused soft purple glow vectors and explicit scaling properties on active selections
        isActive && "z-10 border-purple-500/40 bg-purple-500/5 ring-2 ring-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)] text-purple-300 scale-105",
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {/* Upgraded standard vertical pointer into premium glowing blinking digital caret */}
          <div className="h-4 w-[1.5px] animate-caret-blink bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)] duration-1000" />
        </div>
      )}
    </div>
  );
});
InputOTPSlot.displayName = "InputOTPSlot";

const InputOTPSeparator = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} role="separator" className={cn("text-purple-500/40 mx-1", className)} {...props}>
    <Minus className="h-4 w-4 stroke-[3]" />
  </div>
));
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
