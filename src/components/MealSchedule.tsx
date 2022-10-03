import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Calendar, View } from 'react-big-calendar';
import moment from 'moment';

import { momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { cloneDeep } from 'lodash';

import { MealStatus, ScheduledMealEntity } from '../types';
import { generateMenu, updateMealStatus } from '../controllers';
import { getCurrentUser, getScheduledMeals } from '../selectors';
import { isNil } from 'lodash';
import MealInCalendar from './MealInCalendar';
import Drawer from '@mui/material/Drawer';

import MealPropertySheet from './MealPropertySheet';
import ScheduledMealStatusResolver from './ScheduledMealStatusResolver';

const localizer = momentLocalizer(moment);

const allViews: View[] = ['agenda', 'day', 'week', 'month'];

export class CalendarEvent {
  title: string = '';
  allDay: boolean = false;
  start: Date = new Date();
  end: Date = new Date();
  tooltip?: string;
  scheduledMealId?: string;
}

const now: number = Date.now();
const start: Date = new Date(now);
const end: Date = new Date(now);
end.setDate(end.getDate() + 1);

export interface MealScheduleProps {
  userId: string;
  scheduledMeals: ScheduledMealEntity[];
  onGenerateMenu: () => any;
  onUpdateMealStatus: (mealId: string, mealStatus: MealStatus) => any;
}

const MealSchedule = (props: MealScheduleProps) => {

  const [events, setEvents] = useState([] as CalendarEvent[]);

  // const [showResolveStatusModal, setShowResolveStatusModal] = useState<ScheduledMealEntity | null>(null);
  const [scheduledMealsToResolve, setScheduledMealsToResolve] = useState<ScheduledMealEntity[]>([]);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedMealInCalendar, setSelectedMealInCalendar] = useState<CalendarEvent | null>(null);

  React.useEffect(() => {

    console.log('On entry: ', props.scheduledMeals);
    const currentDate: Date = new Date();
    const localScheduledMealsToResolve: ScheduledMealEntity[] = [];
    // let scheduledMealToResolve: ScheduledMealEntity | null = null;
    for (const scheduledMeal of props.scheduledMeals) {
      const mealDateAsStr = scheduledMeal.dateScheduled;
      const mealDate: Date = new Date(mealDateAsStr);
      if ((mealDate.getTime() < currentDate.getTime()) && (mealDate.getDate() !== currentDate.getDate())) {
        if (scheduledMeal.status === MealStatus.pending) {
          localScheduledMealsToResolve.push(scheduledMeal);
          // scheduledMealToResolve = scheduledMeal;
        }
      }
    }
    setScheduledMealsToResolve(localScheduledMealsToResolve);
    // setShowResolveStatusModal(scheduledMealToResolve);
  }, []);

  const handleCloseScheduledMealStatusResolver = () => {
    setScheduledMealsToResolve([]);
    // setShowResolveStatusModal(null);
  };

  const handleGenerateMenu = () => {
    props.onGenerateMenu();
  };

  const handleOpen = (event: any) => {

    if (isNil(event.title)) {
      setSelectedMealInCalendar(null);
    } else {
      setSelectedMealInCalendar(event as CalendarEvent);
    }
    setSheetOpen(true);
  };

  const handleClosePropertySheet = () => {
    setSheetOpen(false);
  };

  const handleUpdateCalendarEvent = (calendarEvent: CalendarEvent) => {
    const existingEvents: CalendarEvent[] = cloneDeep(events);

    // find matching calendar event
    let matchingEventIndex = 0;
    for (const existingEvent of existingEvents) {
      if (!isNil(existingEvent.scheduledMealId)) {
        if (existingEvent.scheduledMealId === calendarEvent.scheduledMealId) {
          existingEvents[matchingEventIndex] = calendarEvent;
          setEvents(existingEvents); // BUT THIS DOESN"T UPDATE REDUX, DOES IT??, NO IT DOESN"T
        }
      }
      matchingEventIndex++;
    }
  };


  console.log('rerender calendar');

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
    <div>
      <ScheduledMealStatusResolver
        scheduledMealsToResolve={scheduledMealsToResolve}
        open={scheduledMealsToResolve.length > 0}
        onClose={handleCloseScheduledMealStatusResolver}
      />
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
            scheduledMealId={isNil(selectedMealInCalendar) ? '' : (isNil(selectedMealInCalendar.scheduledMealId) ? '' : selectedMealInCalendar.scheduledMealId)}
            selectedMealInCalendar={selectedMealInCalendar}
            handleClose={handleClosePropertySheet}
            onUpdateCalendarEvent={handleUpdateCalendarEvent}
          />
        </Drawer>
      </div>
    </div>
  );
};

function mapStateToProps(state: any) {
  console.log('getScheduledMeals');
  const scheduledMeals: ScheduledMealEntity[] = getScheduledMeals(state);
  console.log(scheduledMeals);
  return {
    userId: getCurrentUser(state) as string,
    scheduledMeals,
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onGenerateMenu: generateMenu,
    onUpdateMealStatus: updateMealStatus,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MealSchedule);

