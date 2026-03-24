import { Conteudo, ConteudoStatus } from '@/types';
import { useUIStore } from '@/store/useUIStore';
import { useConteudoStore } from '@/store/useConteudoStore';
import { ChevronDown, ChevronRight, CalendarPlus, Circle, CircleDot, CheckCircle2 } from 'lucide-react';

interface ConteudoItemProps {
  conteudo: Conteudo;
  areaId: string;
  areaCor: string;
}

const statusIcons: Record<ConteudoStatus, typeof Circle> = {
  'nao-iniciado': Circle,
  'em-progresso': CircleDot,
  'concluido': CheckCircle2,
};

const nextStatus: Record<ConteudoStatus, ConteudoStatus> = {
  'nao-iniciado': 'em-progresso',
  'em-progresso': 'concluido',
  'concluido': 'nao-iniciado',
};

export function ConteudoItem({ conteudo, areaId, areaCor }: ConteudoItemProps) {
  const expanded = useUIStore(s => s.expandedConteudos.has(conteudo.id));
  const toggleExpand = useUIStore(s => s.toggleConteudoExpanded);
  const openEventModal = useUIStore(s => s.openEventModal);
  const statusMap = useConteudoStore(s => s.statusMap);
  const setConteudoStatus = useConteudoStore(s => s.setConteudoStatus);
  const progresso = useConteudoStore(s => s.progresso);
  const toggleSub = useConteudoStore(s => s.toggleSubconteudo);

  const status: ConteudoStatus = statusMap[conteudo.id] || 'nao-iniciado';
  const StatusIcon = statusIcons[status];

  return (
    <div className="ml-2">
      <div className="flex items-center gap-1.5 py-1 group">
        <button
          onClick={() => setConteudoStatus(conteudo.id, nextStatus[status])}
          className="shrink-0"
          title={status}
        >
          <StatusIcon
            className="w-4 h-4 transition-colors"
            style={{
              color: status === 'concluido' ? areaCor : status === 'em-progresso' ? areaCor : 'hsl(var(--muted-foreground))',
              opacity: status === 'nao-iniciado' ? 0.4 : 1,
            }}
          />
        </button>

        <button
          onClick={() => toggleExpand(conteudo.id)}
          className={`flex-1 text-left text-xs transition-colors ${
            status === 'concluido' ? 'text-muted-foreground line-through' : 'text-foreground'
          }`}
        >
          {conteudo.titulo}
        </button>

        {conteudo.subconteudos.length > 0 && (
          <button onClick={() => toggleExpand(conteudo.id)} className="shrink-0">
            {expanded
              ? <ChevronDown className="w-3 h-3 text-muted-foreground" />
              : <ChevronRight className="w-3 h-3 text-muted-foreground" />
            }
          </button>
        )}

        <button
          onClick={() => openEventModal({ areaId, conteudoId: conteudo.id })}
          className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Agendar"
        >
          <CalendarPlus className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
        </button>
      </div>

      {expanded && conteudo.subconteudos.length > 0 && (
        <div className="ml-5 space-y-0.5 mb-1">
          {conteudo.subconteudos.map(sub => (
            <label
              key={sub.id}
              className="flex items-center gap-2 py-0.5 cursor-pointer text-xs"
            >
              <input
                type="checkbox"
                checked={!!progresso[sub.id]}
                onChange={() => toggleSub(sub.id)}
                className="rounded border-border accent-primary w-3 h-3"
              />
              <span className={progresso[sub.id] ? 'text-muted-foreground line-through' : 'text-foreground'}>
                {sub.titulo}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
