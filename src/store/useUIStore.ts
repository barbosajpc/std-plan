import { create } from 'zustand';
import { CalendarView } from '@/types';

interface UIState {
  view: CalendarView;
  setView: (view: CalendarView) => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  eventModalOpen: boolean;
  editingEventId: string | null;
  prefilledArea: string | null;
  prefilledConteudo: string | null;
  prefilledSlot: { date: string; startHour: number; endHour: number } | null;
  openEventModal: (opts?: {
    eventId?: string;
    areaId?: string;
    conteudoId?: string;
    slot?: { date: string; startHour: number; endHour: number };
  }) => void;
  closeEventModal: () => void;
  importModalOpen: boolean;
  setImportModalOpen: (open: boolean) => void;
  expandedAreas: Set<string>;
  toggleAreaExpanded: (id: string) => void;
  expandedConteudos: Set<string>;
  toggleConteudoExpanded: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  view: 'semana',
  setView: (view) => set({ view }),

  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  eventModalOpen: false,
  editingEventId: null,
  prefilledArea: null,
  prefilledConteudo: null,
  prefilledSlot: null,

  openEventModal: (opts) => set({
    eventModalOpen: true,
    editingEventId: opts?.eventId ?? null,
    prefilledArea: opts?.areaId ?? null,
    prefilledConteudo: opts?.conteudoId ?? null,
    prefilledSlot: opts?.slot ?? null,
  }),

  closeEventModal: () => set({
    eventModalOpen: false,
    editingEventId: null,
    prefilledArea: null,
    prefilledConteudo: null,
    prefilledSlot: null,
  }),

  importModalOpen: false,
  setImportModalOpen: (open) => set({ importModalOpen: open }),

  expandedAreas: new Set<string>(),
  toggleAreaExpanded: (id) => set((s) => {
    const next = new Set(s.expandedAreas);
    next.has(id) ? next.delete(id) : next.add(id);
    return { expandedAreas: next };
  }),

  expandedConteudos: new Set<string>(),
  toggleConteudoExpanded: (id) => set((s) => {
    const next = new Set(s.expandedConteudos);
    next.has(id) ? next.delete(id) : next.add(id);
    return { expandedConteudos: next };
  }),
}));
