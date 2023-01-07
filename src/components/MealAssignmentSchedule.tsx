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
import { getScheduledMeals, getStartDate } from '../selectors';
import { isNil } from 'lodash';

const localizer = momentLocalizer(moment);
const allViews: View[] = ['day', 'week', 'month'];

export interface MealAssignmentScheduleProps {
  startDate: Date;
  scheduledMeals: ScheduledMealEntity[];
  onDropMealOnDate: (date: Date) => void;
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
    props.onDropMealOnDate(args[0].start);
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
        defaultView='week'
        views={allViews}
        defaultDate={new Date(props.startDate.getFullYear(), props.startDate.getMonth(), props.startDate.getDate())}
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
    startDate: getStartDate(state),
    scheduledMeals: getScheduledMeals(state),
  };
}

export default connect(mapStateToProps)(MealAssignmentSchedule);

