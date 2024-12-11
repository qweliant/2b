import * as React from "react";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { LucideEdit3 } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "ghost" | "default";
  showEditIcon?: boolean;
}

const inputVariants = cva(
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm  file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring  disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        ghost:
          "border-none text-xl font-semibold w-full focus:border focus:border-border focus:shadow-inner focus:shadow-secondary/20 hover:bg-secondary/10 focus:bg-secondary/30",
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, ...props }, ref) => {
    return (
      <div className="flex gap-2 items-center group w-full">
        <input
          type={type}
          className={cn(inputVariants({ variant, className }))}
          ref={ref}
          {...props}
        />
        {props.showEditIcon && (
          <LucideEdit3
            size={18}
            className="text-muted-foreground/60 group-hover:text-muted-foreground"
          />
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
