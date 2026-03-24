import { useEffect } from 'react';
import { useConteudoStore } from '@/store/useConteudoStore';
import { AreaCard } from '@/components/cards/AreaCard';
import { BookOpen } from 'lucide-react';

export function Sidebar() {
  const { data, loading, loadConteudo } = useConteudoStore();

  useEffect(() => {
    if (!data) loadConteudo();
  }, [data, loadConteudo]);

  if (loading) {
    return (
      <div className="p-4 text-muted-foreground text-sm">Carregando conteúdos...</div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 text-muted-foreground text-sm">Nenhum conteúdo carregado.</div>
    );
  }

  return (
    <div className="p-3 space-y-4">
      <div className="flex items-center gap-2 px-1 mb-2">
        <BookOpen className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">{data.concurso}</h2>
      </div>

      {data.conhecimentos.map(conhecimento => (
        <div key={conhecimento.id} className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
            {conhecimento.tipo}
          </h3>
          {conhecimento.areas.map(area => (
            <AreaCard key={area.id} area={area} />
          ))}
        </div>
      ))}
    </div>
  );
}
