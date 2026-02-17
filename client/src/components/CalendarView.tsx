import { useState, useEffect, useCallback } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import type { View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, startOfMonth, endOfMonth, addDays } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { Paper } from '@mui/material';
import { getEvents } from '../data/chores';
import type { CalendarEvent, Member } from '../types';
import ChoreDetail from './ChoreDetail';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { 'en-US': enUS },
});

interface Props {
  members: Member[];
  onDataChange: () => void;
}

interface BigCalEvent {
  title: string;
  start: Date;
  end: Date;
  resource: CalendarEvent;
}

export default function CalendarView({ members, onDataChange }: Props) {
  const [events, setEvents] = useState<BigCalEvent[]>([]);
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const loadEvents = useCallback((currentDate: Date) => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const start = addDays(monthStart, -7);
    const end = addDays(monthEnd, 7);
    const startStr = format(start, 'yyyy-MM-dd');
    const endStr = format(end, 'yyyy-MM-dd');

    const data = getEvents(startStr, endStr);
    const mapped: BigCalEvent[] = data.map((e) => {
      const d = new Date(e.date + 'T00:00:00');
      return {
        title: e.isCompleted ? `✓ ${e.title}` : e.title,
        start: d,
        end: d,
        resource: e,
      };
    });
    setEvents(mapped);
  }, []);

  useEffect(() => {
    loadEvents(date);
  }, [date, loadEvents]);

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const handleSelectEvent = (event: BigCalEvent) => {
    setSelectedEvent(event.resource);
  };

  const handleCloseDetail = () => {
    setSelectedEvent(null);
  };

  const handleComplete = () => {
    setSelectedEvent(null);
    loadEvents(date);
    onDataChange();
  };

  const eventStyleGetter = (event: BigCalEvent) => {
    const color = event.resource.assigneeColor || '#4A90D9';
    return {
      style: {
        backgroundColor: event.resource.isCompleted ? '#a0a0a0' : color,
        borderRadius: '4px',
        opacity: event.resource.isCompleted ? 0.7 : 1,
        color: '#fff',
        border: 'none',
        fontSize: '0.85em',
        textDecoration: event.resource.isCompleted ? 'line-through' : 'none',
      },
    };
  };

  return (
    <Paper sx={{ p: 2 }}>
      <div style={{ height: 600 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={setView}
          views={['month', 'week']}
          date={date}
          onNavigate={handleNavigate}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          popup
        />
      </div>
      {selectedEvent && (
        <ChoreDetail
          event={selectedEvent}
          members={members}
          onClose={handleCloseDetail}
          onComplete={handleComplete}
        />
      )}
    </Paper>
  );
}
