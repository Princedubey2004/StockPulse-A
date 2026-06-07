import React from 'react';
import { cn } from '../../utils/cn';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-sm backdrop-blur-sm",
        className
      )}
      {...props}
    />
  );
}
