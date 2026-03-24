import { useCalendar } from '@/hooks/useCalendar';
import { useUIStore } from '@/store/useUIStore';
import { ChevronLeft, ChevronRight, PanelRightOpen, PanelRightClose, Upload, Download, FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAgendaStore } from '@/store/useAgendaStore';
import { useConteudoStore } from '@/store/useConteudoStore';

interface TopBarProps {
  calendarHook?: ReturnType<typeof useCalendar>;
}

export function TopBar({ calendarHook }: TopBarProps) {
  const { view, setView, sidebarOpen, toggleSidebar, setImportModalOpen } = useUIStore();

  const exportBackup = () => {
    const eventos = useAgendaStore.getState().eventos;
    const progresso = useConteudoStore.getState().progresso;
    const statusMap = useConteudoStore.getState().statusMap;
    const data = JSON.stringify({ eventos, progresso, statusMap }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studyboard-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importBackup = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (data.eventos) useAgendaStore.getState().setEventos(data.eventos);
        if (data.progresso) useConteudoStore.getState().setProgresso(data.progresso);
        if (data.statusMap) useConteudoStore.getState().setStatusMap(data.statusMap);
      } catch {
        alert('Arquivo inválido');
      }
    };
    input.click();
  };

  return (
    <header className="flex items-center justify-between px-4 py-2 border-b border-border bg-card h-14 shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="font-display text-xl text-foreground tracking-tight">StudyBoard</h1>

        {calendarHook && (
          <div className="flex items-center gap-1 ml-4">
            <Button variant="ghost" size="icon" onClick={calendarHook.prevWeek} className="h-8 w-8">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={calendarHook.goToToday} className="text-xs h-8">
              Hoje
            </Button>
            <Button variant="ghost" size="icon" onClick={calendarHook.nextWeek} className="h-8 w-8">
              <ChevronRight className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground ml-2 capitalize">
              {calendarHook.formatHeader}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        {/* View toggle */}
        <div className="flex bg-secondary rounded-md p-0.5 mr-2">
          {(['semana', 'dia', 'mes'] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors capitalize ${
                view === v
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {v === 'mes' ? 'Mês' : v === 'dia' ? 'Dia' : 'Semana'}
            </button>
          ))}
        </div>

        <Button variant="ghost" size="icon" onClick={() => setImportModalOpen(true)} className="h-8 w-8" title="Importar conteúdo">
          <FileUp className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={exportBackup} className="h-8 w-8" title="Exportar backup">
          <Download className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={importBackup} className="h-8 w-8" title="Importar backup">
          <Upload className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8 ml-1" title="Toggle sidebar">
          {sidebarOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
        </Button>
      </div>
    </header>
  );
}
