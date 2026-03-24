import { useCalendar } from '@/hooks/useCalendar';
import { useUIStore } from '@/store/useUIStore';
import { WeekView } from './WeekView';
import { DayView } from './DayView';
import { MonthView } from './MonthView';
import { TopBar } from '@/components/layout/TopBar';

export function CalendarView() {
  const calendar = useCalendar();
  const view = useUIStore(s => s.view);

  return (
    <div className="flex flex-col h-full">
      <TopBar calendarHook={calendar} />
      <div className="flex-1 overflow-auto">
        {view === 'semana' && <WeekView calendar={calendar} />}
        {view === 'dia' && <DayView calendar={calendar} />}
        {view === 'mes' && <MonthView calendar={calendar} />}
      </div>
    </div>
  );
}
