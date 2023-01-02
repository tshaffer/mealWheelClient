import React, { useState } from 'react';
import { connect } from 'react-redux';

import { Calendar, View } from 'react-big-calendar';
import moment from 'moment';

import { momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

import { CalendarEvent } from './MealSchedule';
import MealInCalendar from './MealInCalendar';
import { ScheduledMealEntity } from '../types';
import { getScheduledMeals } from '../selectors';
import { isNil } from 'lodash';

const localizer = momentLocalizer(moment);
const allViews: View[] = ['agenda', 'day', 'week', 'month'];

const now: number = Date.now();
const start: Date = new Date(now);
const end: Date = new Date(now);
end.setDate(end.getDate() + 1);

export interface MealAssignmentScheduleProps {
  scheduledMeals: ScheduledMealEntity[];
}

const MealAssignmentSchedule = (props: MealAssignmentScheduleProps) => {

  const DnDCalendar = withDragAndDrop(Calendar);

  const [events, setEvents] = useState([] as CalendarEvent[]);

  const handleDragStart = (...args: any[]) => {
    console.log('handleDragStart');
    console.log(args);
  };

  const handleDragOver = (...args: any[]) => {
    console.log('handleDragOver');
    console.log(args);
  };

  const handleDropFromOutside = (...args: any[]) => {
    console.log('handleDropFromOutside');
    console.log(args);
  };

  const handleEventDrop = (...args: any[]) => {
    console.log('handleEventDrop');
    console.log(args);
  };

  if (!isNil(props.scheduledMeals) && props.scheduledMeals.length > 0) {

    const mealsInSchedule: CalendarEvent[] = [];

    for (const scheduledMeal of props.scheduledMeals) {
      const event: CalendarEvent = {
        title: '',
        allDay: true,
        start: scheduledMeal.dateScheduled,
        end: scheduledMeal.dateScheduled,
        tooltip: '',
        scheduledMealId: scheduledMeal.id,
      };
      mealsInSchedule.push(event);
    }

    // only invoke setEvents if the events are different than the meals
    if (mealsInSchedule.length > 0) {
      if (mealsInSchedule.length !== events.length) {
        setEvents(mealsInSchedule);
      } else {
        for (let i = 0; i < mealsInSchedule.length; i++) {
          const scheduledMeal: CalendarEvent = events[i];
          const newMeal: CalendarEvent = mealsInSchedule[i];
          if (!(scheduledMeal.title === newMeal.title &&
            scheduledMeal.allDay === newMeal.allDay &&
            scheduledMeal.start === newMeal.start &&
            scheduledMeal.end === newMeal.end
          )) {
            setEvents(mealsInSchedule);
            break;
          }
        }
      }
    }
  }

  return (
    <div style={{ height: '50vh' }}>
      <DnDCalendar
        selectable
        resizable={false}
        localizer={localizer}
        events={events}
        defaultView='month'
        views={allViews}
        defaultDate={new Date(start.getFullYear(), start.getMonth(), start.getDate())}
        components={{
          event: MealInCalendar as any
        }}
        // dragFromOutsideItem={
        //   displayDragItemInCell ? dragFromOutsideItem : null
        // }
        draggableAccessor={(event) => true}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDropFromOutside={handleDropFromOutside}
        onEventDrop={handleEventDrop}
      />
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
    scheduledMeals: getScheduledMeals(state),
  };
}

export default connect(mapStateToProps)(MealAssignmentSchedule);

