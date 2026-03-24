import { create } from 'zustand';
import { AgendaEvent } from '@/types';

interface AgendaState {
  eventos: AgendaEvent[];
  addEvento: (evento: AgendaEvent) => void;
  updateEvento: (id: string, data: Partial<AgendaEvent>) => void;
  deleteEvento: (id: string) => void;
  moveEvento: (id: string, novoInicio: string, novoFim: string) => void;
  setEventos: (eventos: AgendaEvent[]) => void;
}

const STORAGE_KEY = 'studyboard:eventos';

const loadFromStorage = (): AgendaEvent[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
};

const saveToStorage = (eventos: AgendaEvent[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(eventos));
};

export const useAgendaStore = create<AgendaState>((set) => ({
  eventos: loadFromStorage(),

  addEvento: (evento) => set((state) => {
    const next = [...state.eventos, evento];
    saveToStorage(next);
    return { eventos: next };
  }),

  updateEvento: (id, data) => set((state) => {
    const next = state.eventos.map(e => e.id === id ? { ...e, ...data } : e);
    saveToStorage(next);
    return { eventos: next };
  }),

  deleteEvento: (id) => set((state) => {
    const next = state.eventos.filter(e => e.id !== id);
    saveToStorage(next);
    return { eventos: next };
  }),

  moveEvento: (id, novoInicio, novoFim) => set((state) => {
    const next = state.eventos.map(e =>
      e.id === id ? { ...e, inicio: novoInicio, fim: novoFim } : e
    );
    saveToStorage(next);
    return { eventos: next };
  }),

  setEventos: (eventos) => {
    saveToStorage(eventos);
    set({ eventos });
  },
}));
