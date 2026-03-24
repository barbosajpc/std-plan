import { format, parseISO, isSameDay, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { HOURS_START, HOURS_END } from '@/hooks/useCalendar';

const SLOT_HEIGHT = 40; // px por 60 min
const MIN_EVENT_HEIGHT = 24;
const MINUTES_PER_SLOT = 30;

export const formatHour = (hour: number): string => {
  const h = Math.floor(hour);
  const m = Math.round((hour % 1) * 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

export const formatDateShort = (date: Date): string =>
  format(date, 'dd/MM', { locale: ptBR });

export const formatDayName = (date: Date): string =>
  format(date, 'EEE', { locale: ptBR });

export const formatFullDate = (date: Date): string =>
  format(date, "dd 'de' MMMM", { locale: ptBR });

export const getEventPosition = (inicio: string, fim: string) => {
  if (!inicio || !fim) {
    return { top: 0, height: 0, hidden: true };
  }

  const start = parseISO(inicio);
  const end = parseISO(fim);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { top: 0, height: 0, hidden: true };
  }

  const dayStartMinutes = HOURS_START * 60;
  const dayEndMinutes = HOURS_END * 60;

  const startMinutes = start.getHours() * 60 + start.getMinutes();
  const endMinutes = end.getHours() * 60 + end.getMinutes();

  const visibleStart = Math.max(startMinutes, dayStartMinutes);
  const visibleEnd = Math.min(endMinutes, dayEndMinutes);

  if (
    visibleEnd <= dayStartMinutes ||
    visibleStart >= dayEndMinutes ||
    visibleEnd <= visibleStart
  ) {
    return {
      top: 0,
      height: 0,
      hidden: true,
    };
  }

  const top = ((visibleStart - dayStartMinutes) / MINUTES_PER_SLOT) * SLOT_HEIGHT;
  const rawHeight = ((visibleEnd - visibleStart) / MINUTES_PER_SLOT) * SLOT_HEIGHT;
  const height = Math.max(MIN_EVENT_HEIGHT, rawHeight);

  return {
    top,
    height,
    hidden: false,
    startsBeforeVisible: startMinutes < dayStartMinutes,
    endsAfterVisible: endMinutes > dayEndMinutes,
  };
};

export const getEventsForDay = <T extends { inicio: string; fim: string }>(
  events: T[],
  day: Date
): T[] => {
  const dayStart = startOfDay(day);
  const dayEnd = endOfDay(day);

  return events.filter((e) => {
    const start = parseISO(e.inicio);
    const end = parseISO(e.fim);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return false;
    }

    return (
      isSameDay(start, day) ||
      isSameDay(end, day) ||
      isWithinInterval(dayStart, { start, end }) ||
      isWithinInterval(dayEnd, { start, end })
    );
  });
};

/**
 * Gera string local sem converter para UTC.
 * Ex.: 2026-03-24T05:00:00
 */
export const createDateTimeString = (date: Date, hour: number): string => {
  const d = new Date(date);
  const h = Math.floor(hour);
  const m = Math.round((hour % 1) * 60);

  d.setHours(h, m, 0, 0);

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}`;
};

export const generateId = (): string =>
  `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;