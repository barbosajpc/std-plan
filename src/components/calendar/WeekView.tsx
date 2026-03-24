import { useCalendar } from '@/hooks/useCalendar';
import { useAgendaStore } from '@/store/useAgendaStore';
import { useUIStore } from '@/store/useUIStore';
import { useConteudoStore } from '@/store/useConteudoStore';
import { EventBlock } from './EventBlock';
import {
  formatHour,
  formatDateShort,
  formatDayName,
  getEventsForDay,
} from '@/utils/dateHelpers';
import { isToday, format } from 'date-fns';

interface WeekViewProps {
  calendar: ReturnType<typeof useCalendar>;
}

export function WeekView({ calendar }: WeekViewProps) {
  const { weekDays, hours } = calendar;
  const eventos = useAgendaStore((s) => s.eventos);
  const openEventModal = useUIStore((s) => s.openEventModal);
  const data = useConteudoStore((s) => s.data);

  const gridHeight = hours.length * 40;

  const getAreaColor = (areaId?: string) => {
    if (!areaId || !data) return undefined;

    for (const c of data.conhecimentos) {
      const area = c.areas.find((a) => a.id === areaId);
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
      <div className="flex border-b border-border shrink-0 sticky top-0 bg-card z-10">
        <div className="w-16 shrink-0" />
        {weekDays.map((day) => (
          <div
            key={day.toISOString()}
            className={`flex-1 text-center py-2 border-l border-border ${
              isToday(day) ? 'bg-primary/5' : ''
            }`}
          >
            <div className="text-xs text-muted-foreground uppercase">
              {formatDayName(day)}
            </div>
            <div
              className={`text-sm font-medium mt-0.5 ${
                isToday(day) ? 'text-primary' : 'text-foreground'
              }`}
            >
              {formatDateShort(day)}
            </div>
          </div>
        ))}
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

          {/* Dias */}
          {weekDays.map((day) => {
            const dayEvents = getEventsForDay(eventos, day);

            return (
              <div
                key={day.toISOString()}
                className={`flex-1 border-l border-border relative ${
                  isToday(day) ? 'bg-primary/[0.02]' : ''
                }`}
                style={{ height: `${gridHeight}px` }}
              >
                {hours.map((hour, index) => (
                  <div
                    key={hour}
                    onClick={() => handleSlotClick(day, hour)}
                    className={`absolute left-0 right-0 box-border cursor-pointer transition-colors duration-150 hover:bg-foreground/[0.04] ${
                      hour % 1 === 0 ? 'border-t border-border' : 'border-t border-border/30'
                    }`}
                    style={{
                      top: `${index * 40}px`,
                      height: '40px',
                    }}
                  />
                ))}

                <div className="absolute left-0 right-0 border-t border-border/30" style={{ top: `${gridHeight}px` }} />

                {dayEvents.map((evento) => (
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
    </div>
  );
}