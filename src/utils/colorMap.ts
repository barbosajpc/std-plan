import { EventType } from '@/types';

export const typeColorMap: Record<EventType, string> = {
  estudo: '#4A90D9', // fallback, will use area color
  trabalho: '#F59E0B',
  descanso: '#10B981',
  custom: '#6366F1',
  questoes: '#FB923C',
};

export const getEventColor = (tipo: EventType, areaCor?: string): string => {
  if (tipo === 'estudo' && areaCor) return areaCor;
  return typeColorMap[tipo];
};

export const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const predefinedColors = [
  '#4A90D9', '#27AE60', '#8E44AD', '#E74C3C',
  '#F59E0B', '#10B981', '#6366F1', '#EC4899',
];
