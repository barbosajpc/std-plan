import { useMemo, useState, useCallback } from 'react';
import {
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  addDays,
  format,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfDay,
  eachDayOfInterval,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const HOURS_START = 0;
export const HOURS_END = 24;

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const goToToday = useCallback(() => setCurrentDate(new Date()), []);
  const nextWeek = useCallback(() => setCurrentDate(d => addWeeks(d, 1)), []);
  const prevWeek = useCallback(() => setCurrentDate(d => subWeeks(d, -1)), []);
  const goNextWeek = useCallback(() => setCurrentDate(d => addWeeks(d, 1)), []);
  const goPrevWeek = useCallback(() => setCurrentDate(d => subWeeks(d, 1)), []);
  const goToDay = useCallback((d: Date) => setCurrentDate(d), []);

  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [currentDate]);

  const monthDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [currentDate]);

  const hours = useMemo(() =>
    Array.from({ length: (HOURS_END - HOURS_START) * 2 }, (_, i) => HOURS_START + i * 0.5),
    []
  );

  const formatHeader = useMemo(() => {
    return format(currentDate, "MMMM 'de' yyyy", { locale: ptBR });
  }, [currentDate]);

  return {
    currentDate,
    setCurrentDate,
    weekDays,
    monthDays,
    hours,
    goToToday,
    nextWeek: goNextWeek,
    prevWeek: goPrevWeek,
    goToDay,
    formatHeader,
    isSameDay,
    startOfDay,
    format,
  };
}
