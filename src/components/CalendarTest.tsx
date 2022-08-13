import React, { useState } from 'react';
import { Calendar, View, DateLocalizer } from 'react-big-calendar';
import moment from 'moment';

import { momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const allViews: View[] = ['agenda', 'day', 'week', 'month'];

interface Props {
  localizer: DateLocalizer;
}

class CalendarEvent {
  title: string;
  allDay: boolean;
  start: Date;
  end: Date;
  desc: string;
  resourceId?: string;
  tooltip?: string;

  constructor(_title: string, _start: Date, _endDate: Date, _allDay?: boolean, _desc?: string, _resourceId?: string) {
    this.title = _title;
    this.allDay = _allDay || false;
    this.start = _start;
    this.end = _endDate;
    this.desc = _desc || '';
    this.resourceId = _resourceId;
  }
}


const now: number = Date.now();
const start: Date = new Date(now);
const end: Date = new Date(now);
end.setDate(end.getDate() + 1);

function SelectableCalendar({ localizer }: Props) {
  const [events, setEvents] = useState([
    {
      title: 'test',
      allDay: false,
      start,
      end,
      desc: 'test',
    }
  ] as CalendarEvent[]);

  const handleSelect = (eventStartEnd: any) => {
    const { start, end } = eventStartEnd;
    const title = window.prompt('New Event name');

    if (title) {
      const newEvent = {} as CalendarEvent;
      newEvent.start = moment(start).toDate();
      newEvent.end = moment(end).toDate();
      newEvent.title = title;

      setEvents([
        ...events,
        newEvent
      ]);
    }
  };

  return (
    <>
      <div>
        <strong>
          Click an event to see more info, or drag the mouse over the calendar
          to select a date/time range.
        </strong>
      </div>
      <Calendar
        selectable
        localizer={localizer}
        events={events}
        defaultView='month'
        views={allViews}
        defaultDate={new Date(2020, 4, 21)}
        onSelectEvent={event => alert(event.title)}
        onSelectSlot={handleSelect}
        startAccessor='start'
        endAccessor='end'
        titleAccessor='title'
      />
    </>
  );
}


export default function Availability() {

  return (
    <div style={{ height: '100vh' }}>
      <SelectableCalendar localizer={localizer} />
    </div>
  );
}
