import { useState, useEffect, useMemo } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { useAgendaStore } from '@/store/useAgendaStore';
import { useConteudoStore } from '@/store/useConteudoStore';
import { AgendaEvent, EventType } from '@/types';
import { generateId, createDateTimeString } from '@/utils/dateHelpers';
import { getEventColor, predefinedColors } from '@/utils/colorMap';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

const eventTypes: { value: EventType; label: string }[] = [
  { value: 'estudo', label: '📘 Estudo' },
  { value: 'questoes', label: '✏️ Questões' },
  { value: 'trabalho', label: '🟠 Trabalho' },
  { value: 'descanso', label: '🟢 Descanso' },
  { value: 'custom', label: '⚪ Personalizado' },
];

export function EventModal() {
  const {
    eventModalOpen, closeEventModal, editingEventId,
    prefilledArea, prefilledConteudo, prefilledSubconteudo, prefilledSubconteudoIds, prefilledSlot,
  } = useUIStore();

  const { eventos, addEvento, updateEvento, deleteEvento } = useAgendaStore();
  const conteudoData = useConteudoStore(s => s.data);

  const editingEvent = editingEventId ? eventos.find(e => e.id === editingEventId) : null;

  const [recorrencia, setRecorrencia] = useState<'nenhuma' | 'diaria' | 'dias_uteis' | 'semanal'>('nenhuma');
  const [recorrenciaAte, setRecorrenciaAte] = useState('');
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState<EventType>('estudo');
  const [areaId, setAreaId] = useState('');
  const [conteudoId, setConteudoId] = useState('');
  const [subconteudoIds, setSubconteudoIds] = useState<string[]>([]);
  const [subconteudoPanelOpen, setSubconteudoPanelOpen] = useState(false);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('06:00');
  const [endTime, setEndTime] = useState('07:00');
  const [cor, setCor] = useState(predefinedColors[0]);
  const [notas, setNotas] = useState('');

  // Flatten areas
  const allAreas = useMemo(() =>
    conteudoData?.conhecimentos.flatMap(c => c.areas) ?? [],
    [conteudoData]
  );

  const conteudos = useMemo(() => {
    const selected = allAreas.find(a => a.id === areaId);
    return selected?.conteudos ?? [];
  }, [allAreas, areaId]);

  const selectedConteudo = conteudos.find(c => c.id === conteudoId);

  // Initialize form
  useEffect(() => {
    if (editingEvent) {
      setRecorrencia('nenhuma');
      setRecorrenciaAte('');
      setTitulo(editingEvent.titulo);
      setTipo(editingEvent.tipo);
      setAreaId(editingEvent.areaId || '');
      setConteudoId(editingEvent.conteudoId || '');
      setSubconteudoIds(editingEvent.subconteudoIds || (editingEvent.subconteudoId ? [editingEvent.subconteudoId] : []));
      setDate(format(new Date(editingEvent.inicio), 'yyyy-MM-dd'));
      setStartTime(format(new Date(editingEvent.inicio), 'HH:mm'));
      setEndTime(format(new Date(editingEvent.fim), 'HH:mm'));
      setCor(editingEvent.cor);
      setNotas(editingEvent.notas);
    } else {
      setRecorrencia('nenhuma');
      setRecorrenciaAte(date || format(new Date(), 'yyyy-MM-dd'));
      setTitulo('');
      setTipo('estudo');
      setAreaId(prefilledArea || '');
      setConteudoId(prefilledConteudo || '');
      setSubconteudoIds(prefilledSubconteudoIds?.length ? prefilledSubconteudoIds : (prefilledSubconteudo ? [prefilledSubconteudo] : []));
      setNotas('');

    if (prefilledSlot) {
      setDate(prefilledSlot.date);
      setStartTime(`${String(Math.floor(prefilledSlot.startHour)).padStart(2, '0')}:${String((prefilledSlot.startHour % 1) * 60).padStart(2, '0')}`);
      setEndTime(`${String(Math.floor(prefilledSlot.endHour)).padStart(2, '0')}:${String((prefilledSlot.endHour % 1) * 60).padStart(2, '0')}`);
      setRecorrenciaAte(prefilledSlot.date);
    } else {
      const today = format(new Date(), 'yyyy-MM-dd');
      setDate(today);
      setStartTime('08:00');
      setEndTime('09:00');
      setRecorrenciaAte(today);
    }
    setRecorrencia('nenhuma');
    setCor(predefinedColors[0]);
    }
  }, [editingEvent, prefilledArea, prefilledConteudo, prefilledSubconteudo, prefilledSubconteudoIds, prefilledSlot]);

  // Auto-set titulo from content
  useEffect(() => {
    if (tipo !== 'estudo' || editingEvent) return;

    const selectedConteudo = conteudos.find(c => c.id === conteudoId);
    const selectedSubconteudos = selectedConteudo?.subconteudos.filter(s => subconteudoIds.includes(s.id)) ?? [];

    if (selectedSubconteudos.length === 1) {
      setTitulo(selectedSubconteudos[0].titulo);
      return;
    }

    if (selectedSubconteudos.length > 1) {
      setTitulo(`${selectedSubconteudos.length} subconteúdos selecionados`);
      return;
    }

    if (conteudoId && selectedConteudo) {
      setTitulo(selectedConteudo.titulo);
    }
  }, [conteudoId, subconteudoIds, tipo, conteudos, editingEvent]);

  // Auto-set cor from area
  useEffect(() => {
    if ((tipo === 'estudo' || tipo === 'questoes') && areaId) {
      const area = allAreas.find(a => a.id === areaId);
      if (area) setCor(area.cor);
      else setCor(getEventColor(tipo));
    } else {
      setCor(getEventColor(tipo));
    }
  }, [tipo, areaId, allAreas]);

  if (!eventModalOpen) return null;

  const buildLocalDateTime = (baseDate: string, time: string) => {
    const [hour, minute] = time.split(':').map(Number);
    const d = new Date(`${baseDate}T00:00:00`);
    d.setHours(hour, minute, 0, 0);

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}`;
  };

  const generateRecurringDates = (
    startDate: string,
    endDate: string,
    recurrence: 'nenhuma' | 'diaria' | 'dias_uteis' | 'semanal'
  ) => {
    if (recurrence === 'nenhuma') return [startDate];

    const dates: string[] = [];
    const current = new Date(`${startDate}T00:00:00`);
    const limit = new Date(`${endDate}T00:00:00`);

    while (current <= limit) {
      const day = current.getDay(); // 0 dom, 1 seg, ..., 6 sáb

      const include =
        recurrence === 'diaria' ||
        (recurrence === 'dias_uteis' && day >= 1 && day <= 5) ||
        (recurrence === 'semanal' &&
          current.getDay() === new Date(`${startDate}T00:00:00`).getDay());

      if (include) {
        const yyyy = current.getFullYear();
        const mm = String(current.getMonth() + 1).padStart(2, '0');
        const dd = String(current.getDate()).padStart(2, '0');
        dates.push(`${yyyy}-${mm}-${dd}`);
      }

      current.setDate(current.getDate() + 1);
    }

    return dates;
  };

  const handleSave = () => {
    if (!date) return;

    const selectedConteudo = conteudos.find(c => c.id === conteudoId);
    const selectedSubconteudos =
      selectedConteudo?.subconteudos.filter(s => subconteudoIds.includes(s.id)) ?? [];

    const finalTitle =
      titulo.trim() ||
      (selectedSubconteudos.length === 1 ? selectedSubconteudos[0].titulo : '') ||
      (selectedSubconteudos.length > 1 ? `${selectedSubconteudos.length} subconteúdos` : '') ||
      selectedConteudo?.titulo ||
      '';

    if (!finalTitle) return;

    const eventBase: Omit<AgendaEvent, 'id' | 'inicio' | 'fim'> = {
      titulo: finalTitle,
      tipo,
      areaId: tipo === 'estudo' || tipo === 'questoes' ? areaId : undefined,
      conteudoId: tipo === 'estudo' || tipo === 'questoes' ? conteudoId : undefined,
      subconteudoIds: tipo === 'estudo' || tipo === 'questoes' ? subconteudoIds : undefined,
      cor,
      notas,
    };

    if (editingEvent) {
      updateEvento(editingEvent.id, {
        ...eventBase,
        inicio: buildLocalDateTime(date, startTime),
        fim: buildLocalDateTime(date, endTime),
      });

      closeEventModal();
      return;
    }

    const datas = generateRecurringDates(
      date,
      recorrenciaAte || date,
      recorrencia
    );

    datas.forEach((dataEvento) => {
      addEvento({
        id: generateId(),
        ...eventBase,
        inicio: buildLocalDateTime(dataEvento, startTime),
        fim: buildLocalDateTime(dataEvento, endTime),
      });
    });

    closeEventModal();
  };

  const handleDelete = () => {
    if (editingEvent) {
      deleteEvento(editingEvent.id);
      closeEventModal();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={closeEventModal}>
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <div
        onClick={e => e.stopPropagation()}
        className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg text-foreground">
            {editingEvent ? 'Editar Evento' : 'Novo Evento'}
          </h2>
          <button onClick={closeEventModal} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Título */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Título</label>
          <Input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Nome do evento" />
        </div>

        {/* Tipo */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Tipo</label>
          <div className="flex gap-1">
            {eventTypes.map(t => (
              <button
                key={t.value}
                onClick={() => setTipo(t.value)}
                className={`flex-1 px-2 py-1.5 text-xs rounded-md transition-colors ${
                  tipo === t.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Study selectors */}
        {(tipo === 'estudo' || tipo === 'questoes') && (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Área</label>
              <select
                value={areaId}
                onChange={e => { setAreaId(e.target.value); setConteudoId(''); setSubconteudoIds([]); }}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Selecione uma área</option>
                {allAreas.map(a => (
                  <option key={a.id} value={a.id}>{a.icone} {a.area}</option>
                ))}
              </select>
            </div>
            {areaId && conteudos.length > 0 && (
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Conteúdo</label>
                <select
                  value={conteudoId}
                  onChange={e => { setConteudoId(e.target.value); setSubconteudoIds([]); }}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Selecione um conteúdo</option>
                  {conteudos.map(c => (
                    <option key={c.id} value={c.id}>{c.titulo}</option>
                  ))}
                </select>
              </div>
            )}

            {selectedConteudo?.subconteudos.length > 0 && (
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs text-muted-foreground mb-1 block">Subconteúdos</label>
                  <button
                    type="button"
                    onClick={() => setSubconteudoPanelOpen(prev => !prev)}
                    className="text-xs text-primary underline"
                  >
                    {subconteudoPanelOpen ? 'Ocultar' : 'Expandir'}
                  </button>
                </div>

                {subconteudoPanelOpen && (
                  <div className="space-y-1 border border-input rounded-md bg-background px-2 py-2">
                    {selectedConteudo.subconteudos.map(sub => (
                      <label key={sub.id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={subconteudoIds.includes(sub.id)}
                          onChange={() => {
                            setSubconteudoIds(prev => prev.includes(sub.id)
                              ? prev.filter(id => id !== sub.id)
                              : [...prev, sub.id]
                            );
                          }}
                          className="accent-primary"
                        />
                        <span>{sub.titulo}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Date & time */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Data</label>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Início</label>
            <Input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Fim</label>
            <Input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Repetir</label>
            <select
              value={recorrencia}
              onChange={e =>
                setRecorrencia(
                  e.target.value as 'nenhuma' | 'diaria' | 'dias_uteis' | 'semanal'
                )
              }
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              disabled={!!editingEvent}
            >
              <option value="nenhuma">Não repetir</option>
              <option value="diaria">Todos os dias</option>
              <option value="dias_uteis">Dias úteis</option>
              <option value="semanal">Semanalmente</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Repetir até</label>
            <Input
              type="date"
              value={recorrenciaAte}
              onChange={e => setRecorrenciaAte(e.target.value)}
              disabled={recorrencia === 'nenhuma' || !!editingEvent}
              min={date}
            />
          </div>
        </div>

        {/* Color */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Cor</label>
          <div className="flex gap-2">
            {predefinedColors.map(c => (
              <button
                key={c}
                onClick={() => setCor(c)}
                className={`w-7 h-7 rounded-full transition-transform ${cor === c ? 'scale-110 ring-2 ring-foreground ring-offset-2 ring-offset-card' : 'hover:scale-105'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Notas</label>
          <textarea
            value={notas}
            onChange={e => setNotas(e.target.value)}
            placeholder="Anotações sobre este evento..."
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[60px] resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {editingEvent && (
            <Button variant="destructive" onClick={handleDelete} className="flex-1">
              Deletar
            </Button>
          )}
          <Button onClick={handleSave} className="flex-1 bg-primary hover:bg-primary/90">
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
}
