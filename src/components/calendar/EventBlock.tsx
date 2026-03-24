import { AgendaEvent } from '@/types';
import { getEventPosition } from '@/utils/dateHelpers';
import { getEventColor, hexToRgba } from '@/utils/colorMap';

interface EventBlockProps {
  evento: AgendaEvent;
  areaColor?: string;
  onClick: () => void;
}

export function EventBlock({ evento, areaColor, onClick }: EventBlockProps) {
  const { top, height } = getEventPosition(evento.inicio, evento.fim);
  const color = getEventColor(evento.tipo, areaColor);

  return (
    <div
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="absolute left-1 right-1 rounded-md px-2 py-1 cursor-pointer overflow-hidden transition-all duration-150 hover:scale-[1.02] hover:shadow-lg z-10"
      style={{
        top: `${top}px`,
        height: `${height}px`,
        backgroundColor: hexToRgba(color, 0.2),
        borderLeft: `3px solid ${color}`,
      }}
    >
      <div className="text-xs font-medium truncate" style={{ color }}>
        {evento.titulo}
      </div>
      {height > 30 && (
        <div className="text-[10px] font-mono mt-0.5" style={{ color: hexToRgba(color, 0.7) }}>
          {new Date(evento.inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          {' – '}
          {new Date(evento.fim).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}
    </div>
  );
}
