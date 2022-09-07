import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Calendar, View } from 'react-big-calendar';
import moment from 'moment';

import { momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { DetailedMealEntity, DishEntity, ScheduledMealEntity } from '../types';
import { loadScheduledMeals, generateMenu } from '../controllers';
import { getCurrentUser, getDetailedMeals, getDishes, getScheduledMeals } from '../selectors';
import { isNil } from 'lodash';
import MealInCalendar from './MealInCalendar';
import Drawer from '@mui/material/Drawer';

import MealPropertySheet from './MealPropertySheet';

const localizer = momentLocalizer(moment);

const allViews: View[] = ['agenda', 'day', 'week', 'month'];

export class CalendarEvent {
  title: string = '';
  allDay: boolean = false;
  start: Date = new Date();
  end: Date = new Date();
  tooltip?: string;
  detailedMeal?: DetailedMealEntity;
}

const now: number = Date.now();
const start: Date = new Date(now);
const end: Date = new Date(now);
end.setDate(end.getDate() + 1);

export interface MealScheduleProps {
  userId: string;
  meals: ScheduledMealEntity[];
  detailedMeals: DetailedMealEntity[];
  onLoadScheduledMeals: (usrId: string) => any;
  onGenerateMenu: () => any;
}

const MealSchedule = (props: MealScheduleProps) => {

  const [events, setEvents] = useState([] as CalendarEvent[]);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedMealInCalendar, setSelectedMealInCalendar] = useState<CalendarEvent | null>(null);

  const handleGenerateMenu = () => {
    props.onGenerateMenu();
  };

  const handleOpen = (event: any) => {

    console.log('handleOpen');
    console.log(event);

    if (isNil(event.title)) {
      setSelectedMealInCalendar(null);
    } else {
      setSelectedMealInCalendar(event as CalendarEvent);
    }
    setSheetOpen(true);
  };

  const handleClose = () => {
    console.log('handleClose');
    console.log(sheetOpen);

    setSheetOpen(false);
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
        detailedMeal,
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
      <div style={{ height: '100vh' }}>
        <div style={{ height: 30, width: '100%' }}>
          <button type="button" onClick={handleGenerateMenu}>Generate Menu</button>
          <br />
        </div>
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
          onSelectEvent={event => handleOpen(event)}
          onSelectSlot={event => handleOpen(event)}
          startAccessor='start'
          endAccessor='end'
          titleAccessor='title'
          components={{
            event: MealInCalendar as any
          }}
        />
      </div>
      <Drawer
        BackdropProps={{ style: { opacity: 0 } }}
        open={sheetOpen}
        variant="persistent"
        anchor="right"
      >
        <MealPropertySheet
          selectedMealInCalendar={selectedMealInCalendar}
          handleClose={handleClose}
        />
      </Drawer>
    </div>
  );
};

function mapStateToProps(state: any) {
  const dishes: DishEntity[] = getDishes(state);
  const meals: ScheduledMealEntity[] = getScheduledMeals(state);
  const detailedMeals: DetailedMealEntity[] = getDetailedMeals(state, meals, dishes);
  return {
    userId: getCurrentUser(state) as string,
    meals,
    detailedMeals,
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onLoadScheduledMeals: loadScheduledMeals,
    onGenerateMenu: generateMenu,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MealSchedule);

