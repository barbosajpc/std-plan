import { create } from 'zustand';
import { ConteudoJson, ProgressMap, ConteudoStatusMap } from '@/types';

interface ConteudoState {
  data: ConteudoJson | null;
  loading: boolean;
  error: string | null;
  progresso: ProgressMap;
  statusMap: ConteudoStatusMap;
  loadConteudo: () => Promise<void>;
  setConteudoData: (data: ConteudoJson) => void;
  toggleSubconteudo: (id: string) => void;
  setConteudoStatus: (id: string, status: 'nao-iniciado' | 'em-progresso' | 'concluido') => void;
  setProgresso: (progresso: ProgressMap) => void;
  setStatusMap: (statusMap: ConteudoStatusMap) => void;
}

const PROGRESS_KEY = 'studyboard:progresso';
const STATUS_KEY = 'studyboard:status';

const loadProgress = (): ProgressMap => {
  try {
    const d = localStorage.getItem(PROGRESS_KEY);
    return d ? JSON.parse(d) : {};
  } catch { return {}; }
};

const loadStatus = (): ConteudoStatusMap => {
  try {
    const d = localStorage.getItem(STATUS_KEY);
    return d ? JSON.parse(d) : {};
  } catch { return {}; }
};

const saveProgress = (p: ProgressMap) => localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
const saveStatus = (s: ConteudoStatusMap) => localStorage.setItem(STATUS_KEY, JSON.stringify(s));

export const useConteudoStore = create<ConteudoState>((set) => ({
  data: null,
  loading: false,
  error: null,
  progresso: loadProgress(),
  statusMap: loadStatus(),

  loadConteudo: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}conteudo.json`);
      const data = await res.json();
      set({ data, loading: false });
    } catch {
      set({ error: 'Erro ao carregar conteúdo', loading: false });
    }
  },

  setConteudoData: (data) => set({ data }),

  toggleSubconteudo: (id) => set((state) => {
    const next = { ...state.progresso, [id]: !state.progresso[id] };
    saveProgress(next);
    return { progresso: next };
  }),

  setConteudoStatus: (id, status) => set((state) => {
    const next = { ...state.statusMap, [id]: status };
    saveStatus(next);
    return { statusMap: next };
  }),

  setProgresso: (progresso) => {
    saveProgress(progresso);
    set({ progresso });
  },

  setStatusMap: (statusMap) => {
    saveStatus(statusMap);
    set({ statusMap });
  },
}));
