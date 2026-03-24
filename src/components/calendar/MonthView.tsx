import { useCalendar } from '@/hooks/useCalendar';
import { useAgendaStore } from '@/store/useAgendaStore';
import { useUIStore } from '@/store/useUIStore';
import { getEventsForDay } from '@/utils/dateHelpers';
import { getEventColor } from '@/utils/colorMap';
import { hexToRgba } from '@/utils/colorMap';
import { isToday, isSameMonth, format } from 'date-fns';
import { useConteudoStore } from '@/store/useConteudoStore';

interface MonthViewProps {
  calendar: ReturnType<typeof useCalendar>;
}

export function MonthView({ calendar }: MonthViewProps) {
  const { currentDate, monthDays } = calendar;
  const eventos = useAgendaStore(s => s.eventos);
  const { setView, goToDay } = useUIStore(s => ({ setView: s.setView, goToDay: () => {} }));
  const calendarHook = calendar;
  const data = useConteudoStore(s => s.data);

  const getAreaColor = (areaId?: string) => {
    if (!areaId || !data) return undefined;
    for (const c of data.conhecimentos) {
      const area = c.areas.find(a => a.id === areaId);
      if (area) return area.cor;
    }
    return undefined;
  };

  const weeks: Date[][] = [];
  for (let i = 0; i < monthDays.length; i += 7) {
    weeks.push(monthDays.slice(i, i + 7));
  }

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="p-4 bg-background rounded-lg">
      <div className="grid grid-cols-7 gap-px mb-1">
        {dayNames.map(d => (
          <div key={d} className="text-center text-xs text-muted-foreground py-2 uppercase">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
        {monthDays.map(day => {
          const dayEvts = getEventsForDay(eventos, day);
          const inMonth = isSameMonth(day, currentDate);
          return (
            <div
              key={day.toISOString()}
              onClick={() => {
                calendarHook.goToDay(day);
                useUIStore.getState().setView('dia');
              }}
              className={`min-h-[80px] p-1.5 cursor-pointer transition-colors hover:bg-accent/20 bg-background text-foreground ${
                !inMonth ? 'opacity-50' : ''
              }`}
            >
              <div className={`text-xs font-medium mb-1 ${
                isToday(day) ? 'text-primary font-bold' : 'text-foreground'
              }`}>
                {format(day, 'd')}
              </div>
              <div className="space-y-0.5">
                {dayEvts.slice(0, 3).map(evt => {
                  const color = getEventColor(evt.tipo, getAreaColor(evt.areaId));
                  return (
                    <div
                      key={evt.id}
                      className="text-[10px] px-1 py-0.5 rounded truncate"
                      style={{
                        backgroundColor: hexToRgba(color, 0.2),
                        color: color,
                      }}
                    >
                      {evt.titulo}
                    </div>
                  );
                })}
                {dayEvts.length > 3 && (
                  <div className="text-[10px] text-muted-foreground">
                    +{dayEvts.length - 3} mais
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
