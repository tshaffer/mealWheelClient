import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Calendar, View, DateLocalizer } from 'react-big-calendar';
import moment from 'moment';

import { momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { DetailedMealEntity, DishEntity, Meal, MealEntity } from '../types';
import { loadMeals, generateMenu } from '../controllers';
import { getCurrentUser, getDetailedMeals, getDishes, getMeals } from '../selectors';
import { isNil } from 'lodash';

const localizer = momentLocalizer(moment);

const allViews: View[] = ['agenda', 'day', 'week', 'month'];

class CalendarEvent {
  title: string = '';
  allDay: boolean = false;
  start: Date = new Date();
  end: Date = new Date();
  resourceId?: string;
  tooltip?: string;
}

const now: number = Date.now();
const start: Date = new Date(now);
const end: Date = new Date(now);
end.setDate(end.getDate() + 1);

export interface MealScheduleProps {
  userId: string;
  meals: MealEntity[];
  detailedMeals: DetailedMealEntity[];
  onLoadMeals: (usrId: string) => any;
  onGenerateMenu: () => any;
}

const MealSchedule = (props: MealScheduleProps) => {

  const [events, setEvents] = useState([] as CalendarEvent[]);

  const handleSelect = (startEnd: any) => {

    const { start, end } = startEnd;

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

  if (!isNil(props.detailedMeals) && props.detailedMeals.length > 0) {

    const mealsInSchedule: CalendarEvent[] = [];

    for (const detailedMeal of props.detailedMeals) {
      const event: CalendarEvent = {
        title: detailedMeal.mainDish.name,
        allDay: true,
        start: detailedMeal.dateScheduled,
        end: detailedMeal.dateScheduled,
        tooltip: detailedMeal.mainDish.name,
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
    <div style={{ height: '100vh' }}>
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
        defaultDate={new Date(start.getFullYear(), start.getMonth(), start.getDate())}
        onSelectEvent={event => alert(event.title)}
        onSelectSlot={handleSelect}
        startAccessor='start'
        endAccessor='end'
        titleAccessor='title'
      />
    </div>
  );
};

function mapStateToProps(state: any) {
  const dishes: DishEntity[] = getDishes(state);
  const meals: MealEntity[] = getMeals(state);
  const detailedMeals: DetailedMealEntity[] = getDetailedMeals(state, meals, dishes);
  return {
    userId: getCurrentUser(state) as string,
    meals,
    detailedMeals,
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onLoadMeals: loadMeals,
    onGenerateMenu: generateMenu,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MealSchedule);

