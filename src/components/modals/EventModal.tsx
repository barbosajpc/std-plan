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
  { value: 'trabalho', label: '🟠 Trabalho' },
  { value: 'descanso', label: '🟢 Descanso' },
  { value: 'custom', label: '⚪ Personalizado' },
];

export function EventModal() {
  const {
    eventModalOpen, closeEventModal, editingEventId,
    prefilledArea, prefilledConteudo, prefilledSlot,
  } = useUIStore();

  const { eventos, addEvento, updateEvento, deleteEvento } = useAgendaStore();
  const conteudoData = useConteudoStore(s => s.data);

  const editingEvent = editingEventId ? eventos.find(e => e.id === editingEventId) : null;

  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState<EventType>('estudo');
  const [areaId, setAreaId] = useState('');
  const [conteudoId, setConteudoId] = useState('');
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

  const selectedArea = allAreas.find(a => a.id === areaId);
  const conteudos = selectedArea?.conteudos ?? [];

  // Initialize form
  useEffect(() => {
    if (editingEvent) {
      setTitulo(editingEvent.titulo);
      setTipo(editingEvent.tipo);
      setAreaId(editingEvent.areaId || '');
      setConteudoId(editingEvent.conteudoId || '');
      setDate(format(new Date(editingEvent.inicio), 'yyyy-MM-dd'));
      setStartTime(format(new Date(editingEvent.inicio), 'HH:mm'));
      setEndTime(format(new Date(editingEvent.fim), 'HH:mm'));
      setCor(editingEvent.cor);
      setNotas(editingEvent.notas);
    } else {
      setTitulo('');
      setTipo('estudo');
      setAreaId(prefilledArea || '');
      setConteudoId(prefilledConteudo || '');
      setNotas('');

      if (prefilledSlot) {
        setDate(prefilledSlot.date);
        setStartTime(`${String(Math.floor(prefilledSlot.startHour)).padStart(2, '0')}:${String((prefilledSlot.startHour % 1) * 60).padStart(2, '0')}`);
        setEndTime(`${String(Math.floor(prefilledSlot.endHour)).padStart(2, '0')}:${String((prefilledSlot.endHour % 1) * 60).padStart(2, '0')}`);
      } else {
        setDate(format(new Date(), 'yyyy-MM-dd'));
        setStartTime('08:00');
        setEndTime('09:00');
      }
      setCor(predefinedColors[0]);
    }
  }, [editingEvent, prefilledArea, prefilledConteudo, prefilledSlot]);

  // Auto-set titulo from content
  useEffect(() => {
    if (tipo === 'estudo' && conteudoId && !editingEvent) {
      const c = conteudos.find(c => c.id === conteudoId);
      if (c) setTitulo(c.titulo);
    }
  }, [conteudoId, tipo, conteudos, editingEvent]);

  // Auto-set cor from area
  useEffect(() => {
    if (tipo === 'estudo' && areaId) {
      const area = allAreas.find(a => a.id === areaId);
      if (area) setCor(area.cor);
    } else {
      setCor(getEventColor(tipo));
    }
  }, [tipo, areaId, allAreas]);

  if (!eventModalOpen) return null;

  const handleSave = () => {
    if (!titulo.trim() || !date) return;

    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const d = new Date(date + 'T00:00:00');
    const inicio = new Date(d);
    inicio.setHours(startH, startM, 0, 0);
    const fim = new Date(d);
    fim.setHours(endH, endM, 0, 0);

    const eventData: Omit<AgendaEvent, 'id'> = {
      titulo: titulo.trim(),
      tipo,
      areaId: tipo === 'estudo' ? areaId : undefined,
      conteudoId: tipo === 'estudo' ? conteudoId : undefined,
      inicio: inicio.toISOString(),
      fim: fim.toISOString(),
      cor,
      notas,
    };

    if (editingEvent) {
      updateEvento(editingEvent.id, eventData);
    } else {
      addEvento({ id: generateId(), ...eventData });
    }
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
        className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 space-y-4 animate-in fade-in zoom-in-95"
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
        {tipo === 'estudo' && (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Área</label>
              <select
                value={areaId}
                onChange={e => { setAreaId(e.target.value); setConteudoId(''); }}
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
                  onChange={e => setConteudoId(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Selecione um conteúdo</option>
                  {conteudos.map(c => (
                    <option key={c.id} value={c.id}>{c.titulo}</option>
                  ))}
                </select>
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
