export type EventType = 'estudo' | 'trabalho' | 'descanso' | 'custom';

export interface AgendaEvent {
  id: string;
  titulo: string;
  tipo: EventType;
  areaId?: string;
  conteudoId?: string;
  subconteudoId?: string;
  inicio: string; // ISO string
  fim: string; // ISO string
  cor: string;
  notas: string;
}

export type ConteudoStatus = 'nao-iniciado' | 'em-progresso' | 'concluido';

export interface SubConteudo {
  id: string;
  titulo: string;
  descricao: string;
}

export interface Conteudo {
  id: string;
  titulo: string;
  descricao: string;
  subconteudos: SubConteudo[];
}

export interface Area {
  id: string;
  area: string;
  cor: string;
  icone: string;
  conteudos: Conteudo[];
}

export interface Conhecimento {
  id: string;
  tipo: string;
  areas: Area[];
}

export interface ConteudoJson {
  concurso: string;
  conhecimentos: Conhecimento[];
}

export type CalendarView = 'semana' | 'dia' | 'mes';

export interface ProgressMap {
  [subconteudoId: string]: boolean;
}

export interface ConteudoStatusMap {
  [conteudoId: string]: ConteudoStatus;
}
