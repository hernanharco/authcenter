import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

function LogoComponent({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <ShieldCheck className="h-8 w-8 text-primary" />
      <h1 className="font-headline text-2xl font-bold text-foreground">
        AuthCenter
      </h1>
    </div>
  );
}

export const Logo = React.memo(LogoComponent);
