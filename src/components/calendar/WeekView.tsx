import { useCalendar } from '@/hooks/useCalendar';
import { useAgendaStore } from '@/store/useAgendaStore';
import { useUIStore } from '@/store/useUIStore';
import { useConteudoStore } from '@/store/useConteudoStore';
import { EventBlock } from './EventBlock';
import { formatHour, formatDateShort, formatDayName, getEventsForDay, createDateTimeString } from '@/utils/dateHelpers';
import { isToday, format } from 'date-fns';

interface WeekViewProps {
  calendar: ReturnType<typeof useCalendar>;
}

export function WeekView({ calendar }: WeekViewProps) {
  const { weekDays, hours } = calendar;
  const eventos = useAgendaStore(s => s.eventos);
  const openEventModal = useUIStore(s => s.openEventModal);
  const data = useConteudoStore(s => s.data);

  const getAreaColor = (areaId?: string) => {
    if (!areaId || !data) return undefined;
    for (const c of data.conhecimentos) {
      const area = c.areas.find(a => a.id === areaId);
      if (area) return area.cor;
    }
    return undefined;
  };

  const handleSlotClick = (day: Date, hour: number) => {
    openEventModal({
      slot: {
        date: format(day, 'yyyy-MM-dd'),
        startHour: hour,
        endHour: hour + 1,
      },
    });
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header row */}
      <div className="flex border-b border-border shrink-0 sticky top-0 bg-card z-10">
        <div className="w-16 shrink-0" />
        {weekDays.map(day => (
          <div
            key={day.toISOString()}
            className={`flex-1 text-center py-2 border-l border-border ${
              isToday(day) ? 'bg-primary/5' : ''
            }`}
          >
            <div className="text-xs text-muted-foreground uppercase">{formatDayName(day)}</div>
            <div className={`text-sm font-medium mt-0.5 ${
              isToday(day) ? 'text-primary' : 'text-foreground'
            }`}>
              {formatDateShort(day)}
            </div>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div className="flex flex-1 overflow-y-auto">
        {/* Time labels */}
        <div className="w-16 shrink-0">
          {hours.map(hour => (
            <div
              key={hour}
              className="h-10 flex items-start justify-end pr-2 -mt-2"
            >
              {hour % 1 === 0 && (
                <span className="text-[10px] font-mono text-muted-foreground">
                  {formatHour(hour)}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Day columns */}
        {weekDays.map(day => {
          const dayEvents = getEventsForDay(eventos, day);
          return (
            <div
              key={day.toISOString()}
              className={`flex-1 border-l border-border relative ${
                isToday(day) ? 'bg-primary/[0.02]' : ''
              }`}
            >
              {hours.map(hour => (
                <div
                  key={hour}
                  onClick={() => handleSlotClick(day, hour)}
                  className={`h-10 border-b cursor-pointer transition-colors duration-150 hover:bg-foreground/[0.04] ${
                    hour % 1 === 0 ? 'border-border' : 'border-border/30'
                  }`}
                />
              ))}

              {/* Events */}
              {dayEvents.map(evento => (
                <EventBlock
                  key={evento.id}
                  evento={evento}
                  areaColor={getAreaColor(evento.areaId)}
                  onClick={() => openEventModal({ eventId: evento.id })}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
