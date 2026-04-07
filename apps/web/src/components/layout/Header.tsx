'use client';

import { Bell, Menu, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SessionPayload } from '@/lib/session';

interface HeaderProps {
  user: SessionPayload;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-6">
      <div className="flex items-center gap-4 flex-1">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
        <div className="relative w-full max-w-sm hidden md:flex">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search..." 
            className="w-full bg-background pl-9 md:w-[300px]" 
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
          <span className="absolute top-1.5 right-2 h-2 w-2 bg-destructive rounded-full" />
        </Button>
        
        <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center overflow-hidden border cursor-pointer hover:ring-2 hover:ring-primary focus:outline-none transition-all">
          <User className="h-4 w-4 text-secondary-foreground" />
        </div>
      </div>
    </header>
  );
}
