import { useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { CalendarView } from '@/components/calendar/CalendarView';
import { EventModal } from '@/components/modals/EventModal';
import { ImportModal } from '@/components/modals/ImportModal';
import { useConteudoStore } from '@/store/useConteudoStore';
import { useUIStore } from '@/store/useUIStore';

const Index = () => {
  const loadConteudo = useConteudoStore(s => s.loadConteudo);
  const data = useConteudoStore(s => s.data);

  useEffect(() => {
    if (!data) loadConteudo();
  }, [data, loadConteudo]);

  return (
    <>
      <AppShell>
        <CalendarView />
      </AppShell>
      <EventModal />
      <ImportModal />
    </>
  );
};

export default Index;
