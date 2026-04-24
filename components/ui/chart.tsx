import * as React from "react"
import { cn } from "@/lib/utils"

export interface ChartConfig {
  [key: string]: {
    label?: string
    color?: string
    theme?: {
      light?: string
      dark?: string
    }
  }
}

export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
  children: React.ComponentProps<"canvas">["children"]
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ config, children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative w-full", className)}
        {...props}
      >
        <style>
          {Object.entries(config).map(
            ([key, value]) => `
            .chart-${key} {
              color: ${value.color || value.theme?.dark || "#8884d8"};
            }
          `
          )}
        </style>
        {children}
      </div>
    )
  }
)
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-background px-3 py-1.5 text-sm shadow-md",
      className
    )}
    {...props}
  />
))
ChartTooltip.displayName = "ChartTooltip"

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    hideLabel?: boolean
    hideIndicator?: boolean
    indicator?: "line" | "dot" | "dashed"
    nameKey?: string
    labelKey?: string
  }
>(
  (
    {
      className,
      hideLabel,
      hideIndicator,
      indicator = "dot",
      nameKey,
      labelKey,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn("grid gap-1.5", className)}
        {...props}
      />
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartLegend = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-center gap-4", className)}
    {...props}
  />
))
ChartLegend.displayName = "ChartLegend"

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground",
      className
    )}
    {...props}
  />
))
ChartLegendContent.displayName = "ChartLegendContent"

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
}
