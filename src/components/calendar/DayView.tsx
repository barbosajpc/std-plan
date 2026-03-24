import { useCalendar } from '@/hooks/useCalendar';
import { useAgendaStore } from '@/store/useAgendaStore';
import { useUIStore } from '@/store/useUIStore';
import { useConteudoStore } from '@/store/useConteudoStore';
import { EventBlock } from './EventBlock';
import { formatHour, getEventsForDay, formatFullDate } from '@/utils/dateHelpers';
import { format } from 'date-fns';

interface DayViewProps {
  calendar: ReturnType<typeof useCalendar>;
}

export function DayView({ calendar }: DayViewProps) {
  const { currentDate, hours } = calendar;
  const eventos = useAgendaStore((s) => s.eventos);
  const openEventModal = useUIStore((s) => s.openEventModal);
  const data = useConteudoStore((s) => s.data);

  const dayEvents = getEventsForDay(eventos, currentDate);
  const gridHeight = hours.length * 40;

  const getAreaColor = (areaId?: string) => {
    if (!areaId || !data) return undefined;

    for (const c of data.conhecimentos) {
      const area = c.areas.find((a) => a.id === areaId);
      if (area) return area.cor;
    }

    return undefined;
  };

  const handleSlotClick = (hour: number) => {
    openEventModal({
      slot: {
        date: format(currentDate, 'yyyy-MM-dd'),
        startHour: hour,
        endHour: hour + 1,
      },
    });
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="text-center py-3 border-b border-border bg-card shrink-0">
        <span className="text-sm font-medium text-foreground capitalize">
          {formatFullDate(currentDate)}
        </span>
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        <div className="flex min-w-0">
          {/* Coluna das horas */}
          <div className="w-16 shrink-0 relative" style={{ height: `${gridHeight}px` }}>
            {hours.map((hour, index) => (
              <div
                key={hour}
                className="absolute left-0 right-0"
                style={{ top: `${index * 40}px`, height: '40px' }}
              >
                {hour % 1 === 0 && (
                  <span className="absolute right-2 top-0 -translate-y-1/2 text-[10px] font-mono text-muted-foreground">
                    {formatHour(hour)}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Coluna do dia */}
          <div className="flex-1 border-l border-border relative" style={{ height: `${gridHeight}px` }}>
            {/* Slots clicáveis + linhas */}
            {hours.map((hour, index) => (
              <div
                key={hour}
                onClick={() => handleSlotClick(hour)}
                className={`absolute left-0 right-0 box-border cursor-pointer transition-colors duration-150 hover:bg-foreground/[0.04] ${
                  hour % 1 === 0 ? 'border-t border-border' : 'border-t border-border/30'
                }`}
                style={{
                  top: `${index * 40}px`,
                  height: '40px',
                }}
              />
            ))}

            {/* linha final inferior */}
            <div className="absolute left-0 right-0 border-t border-border/30" style={{ top: `${gridHeight}px` }} />

            {/* Eventos */}
            {dayEvents.map((evento) => (
              <EventBlock
                key={evento.id}
                evento={evento}
                areaColor={getAreaColor(evento.areaId)}
                onClick={() => openEventModal({ eventId: evento.id })}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}