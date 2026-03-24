import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { AgendaEvent, EventType } from '@/types';

type EventoInsert = Omit<AgendaEvent, 'id'> & { id?: string };

interface AgendaState {
  eventos: AgendaEvent[];
  loading: boolean;
  error: string | null;

  fetchEventos: () => Promise<void>;
  addEvento: (evento: EventoInsert) => Promise<void>;
  addEventos: (eventos: EventoInsert[]) => Promise<void>;
  updateEvento: (id: string, updated: Partial<AgendaEvent>) => Promise<void>;
  deleteEvento: (id: string) => Promise<void>;
  clearError: () => void;
}

type EventoRow = {
  id: string;
  titulo: string;
  tipo: string;
  inicio: string;
  fim: string;
  area_id: string | null;
  conteudo_id: string | null;
  subconteudo_ids: string[] | null;
  cor: string | null;
  notas: string | null;
};

const mapRowToAgendaEvent = (row: EventoRow): AgendaEvent => ({
  id: row.id,
  titulo: row.titulo,
  tipo: row.tipo as EventType,
  inicio: row.inicio,
  fim: row.fim,
  areaId: row.area_id ?? undefined,
  conteudoId: row.conteudo_id ?? undefined,
  subconteudoIds: row.subconteudo_ids ?? undefined,
  cor: row.cor ?? undefined,
  notas: row.notas ?? undefined,
});

const mapAgendaEventToInsert = (evento: EventoInsert) => ({
  ...(evento.id ? { id: evento.id } : {}),
  titulo: evento.titulo,
  tipo: evento.tipo,
  inicio: evento.inicio,
  fim: evento.fim,
  area_id: evento.areaId ?? null,
  conteudo_id: evento.conteudoId ?? null,
  subconteudo_ids: evento.subconteudoIds ?? null,
  cor: evento.cor ?? null,
  notas: evento.notas ?? null,
});

export const useAgendaStore = create<AgendaState>((set, get) => ({
  eventos: [],
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchEventos: async () => {
    set({ loading: true, error: null });

    const { data, error } = await supabase
      .from('eventos')
      .select('*')
      .order('inicio', { ascending: true });

    if (error) {
      console.error('Erro ao buscar eventos:', error);
      set({ loading: false, error: error.message });
      return;
    }

    const eventos = ((data ?? []) as EventoRow[]).map(mapRowToAgendaEvent);

    set({
      eventos,
      loading: false,
      error: null,
    });
  },

  addEvento: async (evento) => {
    set({ error: null });

    const payload = mapAgendaEventToInsert(evento);

    const { data, error } = await supabase
      .from('eventos')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('Erro ao adicionar evento:', error);
      set({ error: error.message });
      return;
    }

    const novoEvento = mapRowToAgendaEvent(data as EventoRow);

    set((state) => ({
      eventos: [...state.eventos, novoEvento].sort((a, b) =>
        a.inicio.localeCompare(b.inicio)
      ),
    }));
  },

  addEventos: async (eventos) => {
    set({ error: null });

    if (!eventos.length) return;

    const payload = eventos.map(mapAgendaEventToInsert);

    const { data, error } = await supabase
      .from('eventos')
      .insert(payload)
      .select();

    if (error) {
      console.error('Erro ao adicionar eventos:', error);
      set({ error: error.message });
      return;
    }

    const novosEventos = ((data ?? []) as EventoRow[]).map(mapRowToAgendaEvent);

    set((state) => ({
      eventos: [...state.eventos, ...novosEventos].sort((a, b) =>
        a.inicio.localeCompare(b.inicio)
      ),
    }));
  },

  updateEvento: async (id, updated) => {
    set({ error: null });

    const payload = {
      ...(updated.titulo !== undefined ? { titulo: updated.titulo } : {}),
      ...(updated.tipo !== undefined ? { tipo: updated.tipo } : {}),
      ...(updated.inicio !== undefined ? { inicio: updated.inicio } : {}),
      ...(updated.fim !== undefined ? { fim: updated.fim } : {}),
      ...(updated.areaId !== undefined ? { area_id: updated.areaId ?? null } : {}),
      ...(updated.conteudoId !== undefined ? { conteudo_id: updated.conteudoId ?? null } : {}),
      ...(updated.subconteudoIds !== undefined
        ? { subconteudo_ids: updated.subconteudoIds ?? null }
        : {}),
      ...(updated.cor !== undefined ? { cor: updated.cor ?? null } : {}),
      ...(updated.notas !== undefined ? { notas: updated.notas ?? null } : {}),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('eventos')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar evento:', error);
      set({ error: error.message });
      return;
    }

    const eventoAtualizado = mapRowToAgendaEvent(data as EventoRow);

    set((state) => ({
      eventos: state.eventos
        .map((e) => (e.id === id ? eventoAtualizado : e))
        .sort((a, b) => a.inicio.localeCompare(b.inicio)),
    }));
  },

  deleteEvento: async (id) => {
    set({ error: null });

    const { error } = await supabase
      .from('eventos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar evento:', error);
      set({ error: error.message });
      return;
    }

    set((state) => ({
      eventos: state.eventos.filter((e) => e.id !== id),
    }));
  },
}));