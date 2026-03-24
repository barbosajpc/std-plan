import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { useUIStore } from '@/store/useUIStore';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const sidebarOpen = useUIStore(s => s.sidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-hidden flex flex-col">
            {children}
          </main>
          {sidebarOpen && (
            <aside className="w-80 border-l border-border bg-sidebar overflow-y-auto hidden md:block">
              <Sidebar />
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
