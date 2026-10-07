"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as React from "react";

import { cn } from "~/lib/utils";

type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root> & {
  middleIndicator?: React.ReactNode;
};

function Progress({
  className,
  value,
  middleIndicator,
  ...props
}: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className,
      )}
      {...props}
    >
      {middleIndicator && (
        <div className="absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2">
          {middleIndicator}
        </div>
      )}

      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-primary h-full w-full flex-1 transition-all"
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

function MiddleIndicator() {
  return <div className="bg-card h-2 w-1" />;
}

function PlayerSideProgress({
  bluePercentage,
  ...props
}: ProgressProps & {
  bluePercentage: number;
}) {
  return (
    <Progress className="bg-pink *:bg-blue" {...props} value={bluePercentage} />
  );
}

export { MiddleIndicator, PlayerSideProgress, Progress };
