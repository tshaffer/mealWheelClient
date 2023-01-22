import React, { useState } from 'react';
import { connect } from 'react-redux';

import { Calendar, DateLocalizer, Navigate, View, Views } from 'react-big-calendar';
import moment from 'moment';

import { momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

import { CalendarEvent } from './MealSchedule';
import MealInAssignmentCalendar from './MealInAssignmentCalendar';
import { ScheduledMealEntity } from '../types';
import { getScheduledMeals, getStartDate } from '../selectors';
import { isNil } from 'lodash';
import * as dates from 'date-arithmetic';

const localizer: DateLocalizer = momentLocalizer(moment);
const allViews: View[] = [Views.DAY, Views.WEEK, Views.MONTH];
export interface MyWeekProps {
  date: Date;
  localizer: any;
  max: Date;
  min: Date;
  scrollToTime: Date;
}

const MyWeek = (props: MyWeekProps) => {

  console.log('MyWeek');
  console.log(props);

  const title = (date: Date) => {
    return `My awesome week: ${date.toLocaleDateString()}`;
  };

  const range = (date: Date, lObj: any) => {
    const localizer = lObj.localizer;
    const start = date;
    const end = dates.add(start, 2, 'day');
  
    let current = start;
    const range = [];
  
    while (localizer.lte(current, end, 'day')) {
      range.push(current);
      current = localizer.add(current, 1, 'day');
    }
  
    return range;
  };

  const navigate = (date: any, action: any, lObj: any) => {
    const localizer = lObj.localizer;
    switch (action) {
      case Navigate.PREVIOUS:
        return localizer.add(date, -3, 'day');
  
      case Navigate.NEXT:
        return localizer.add(date, 3, 'day');
  
      default:
        return date;
    }
  };

  return (
    <div>
      pizza
    </div>
  );
};

const myViews: any = {
  month: true,
  week: MyWeek,
};

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
        defaultView={Views.WEEK}
        views={myViews}
        defaultDate={new Date(props.startDate.getFullYear(), props.startDate.getMonth(), props.startDate.getDate())}
        components={{
          event: MealInAssignmentCalendar as any
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

