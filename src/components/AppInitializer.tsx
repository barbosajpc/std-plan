import { useEffect } from 'react';
import { useAgendaStore } from '@/store/useAgendaStore';

export function AppInitializer() {
  const fetchEventos = useAgendaStore((s) => s.fetchEventos);

  useEffect(() => {
    fetchEventos();
  }, [fetchEventos]);

  return null;
}