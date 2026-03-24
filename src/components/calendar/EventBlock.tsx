import { AgendaEvent } from '@/types';
import { getEventPosition } from '@/utils/dateHelpers';
import { getEventColor, hexToRgba } from '@/utils/colorMap';
import { parseISO, format } from 'date-fns';

interface EventBlockProps {
  evento: AgendaEvent;
  areaColor?: string;
  onClick: () => void;
}

export function EventBlock({ evento, areaColor, onClick }: EventBlockProps) {
  const { top, height, hidden } = getEventPosition(evento.inicio, evento.fim);
  const color = getEventColor(evento.tipo, areaColor);

  if (hidden || height <= 0) return null;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="absolute left-1 right-1 rounded-md px-2 py-1 cursor-pointer overflow-hidden transition-all duration-150 hover:shadow-lg z-10"
      style={{
        top: `${top}px`,
        height: `${height}px`,
        backgroundColor: hexToRgba(color, 0.18),
        borderLeft: `3px solid ${color}`,
      }}
    >
      <div className="text-xs font-medium truncate leading-tight" style={{ color }}>
        {evento.titulo}
      </div>

      {height > 30 && (
        <div
          className="text-[10px] font-mono mt-0.5"
          style={{ color: hexToRgba(color, 0.78) }}
        >
          {format(parseISO(evento.inicio), 'HH:mm')} – {format(parseISO(evento.fim), 'HH:mm')}
        </div>
      )}
    </div>
  );
}