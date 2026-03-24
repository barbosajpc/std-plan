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
  const eventos = useAgendaStore(s => s.eventos);
  const openEventModal = useUIStore(s => s.openEventModal);
  const data = useConteudoStore(s => s.data);

  const dayEvents = getEventsForDay(eventos, currentDate);

  const getAreaColor = (areaId?: string) => {
    if (!areaId || !data) return undefined;
    for (const c of data.conhecimentos) {
      const area = c.areas.find(a => a.id === areaId);
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
    <div className="flex flex-col h-full">
      <div className="text-center py-3 border-b border-border bg-card">
        <span className="text-sm font-medium text-foreground capitalize">
          {formatFullDate(currentDate)}
        </span>
      </div>

      <div className="flex flex-1 overflow-y-auto">
        <div className="w-16 shrink-0">
          {hours.map(hour => (
            <div key={hour} className="h-10 flex items-start justify-end pr-2 -mt-2">
              {hour % 1 === 0 && (
                <span className="text-[10px] font-mono text-muted-foreground">
                  {formatHour(hour)}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="flex-1 border-l border-border relative">
          {hours.map(hour => (
            <div
              key={hour}
              onClick={() => handleSlotClick(hour)}
              className={`h-10 border-b cursor-pointer transition-colors duration-150 hover:bg-foreground/[0.04] ${
                hour % 1 === 0 ? 'border-border' : 'border-border/30'
              }`}
            />
          ))}
          {dayEvents.map(evento => (
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
  );
}
