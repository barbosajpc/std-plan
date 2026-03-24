import { Area } from '@/types';
import { useUIStore } from '@/store/useUIStore';
import { useConteudoStore } from '@/store/useConteudoStore';
import { ConteudoItem } from './ConteudoItem';
import { ProgressBar } from './ProgressBar';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { hexToRgba } from '@/utils/colorMap';

interface AreaCardProps {
  area: Area;
}

export function AreaCard({ area }: AreaCardProps) {
  const expanded = useUIStore(s => s.expandedAreas.has(area.id));
  const toggle = useUIStore(s => s.toggleAreaExpanded);
  const progresso = useConteudoStore(s => s.progresso);

  // Calculate progress
  const allSubs = area.conteudos.flatMap(c => c.subconteudos);
  const total = allSubs.length || area.conteudos.length;
  const done = allSubs.length > 0
    ? allSubs.filter(s => progresso[s.id]).length
    : 0;

  return (
    <div
      className="rounded-lg overflow-hidden transition-colors duration-150"
      style={{
        backgroundColor: hexToRgba(area.cor, 0.06),
        borderLeft: `4px solid ${area.cor}`,
      }}
    >
      <button
        onClick={() => toggle(area.id)}
        className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-foreground/[0.04] transition-colors"
      >
        <span className="text-base">{area.icone}</span>
        <div className="flex-1 text-left">
          <div className="text-sm font-medium text-foreground">{area.area}</div>
          <ProgressBar current={done} total={total} color={area.cor} />
        </div>
        {expanded
          ? <ChevronDown className="w-4 h-4 text-muted-foreground" />
          : <ChevronRight className="w-4 h-4 text-muted-foreground" />
        }
      </button>

      {expanded && (
        <div className="px-3 pb-2 space-y-0.5">
          {area.conteudos.map(conteudo => (
            <ConteudoItem key={conteudo.id} conteudo={conteudo} areaId={area.id} areaCor={area.cor} />
          ))}
        </div>
      )}
    </div>
  );
}
