import { format, parseISO, isSameDay, differenceInMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { HOURS_START, HOURS_END } from '@/hooks/useCalendar';

export const formatHour = (hour: number): string => {
  const h = Math.floor(hour);
  const m = (hour % 1) * 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

export const formatDateShort = (date: Date): string =>
  format(date, 'dd/MM', { locale: ptBR });

export const formatDayName = (date: Date): string =>
  format(date, 'EEE', { locale: ptBR });

export const formatFullDate = (date: Date): string =>
  format(date, "dd 'de' MMMM", { locale: ptBR });

export const getEventPosition = (inicio: string, fim: string) => {
  const start = parseISO(inicio);
  const end = parseISO(fim);
  const slotHeight = 40; // px per 30 min
  const totalSlots = (HOURS_END - HOURS_START) * 2;

  const startMinutes = start.getHours() * 60 + start.getMinutes();
  const endMinutes = end.getHours() * 60 + end.getMinutes();

  const topMinutes = startMinutes - HOURS_START * 60;
  const durationMinutes = endMinutes - startMinutes;

  const top = (topMinutes / 30) * slotHeight;
  const height = Math.max((durationMinutes / 30) * slotHeight, slotHeight);

  return { top, height };
};

export const getEventsForDay = <T extends { inicio: string }>(events: T[], day: Date): T[] =>
  events.filter(e => isSameDay(parseISO(e.inicio), day));

export const createDateTimeString = (date: Date, hour: number): string => {
  const d = new Date(date);
  d.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);
  return d.toISOString();
};

export const generateId = (): string =>
  `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
