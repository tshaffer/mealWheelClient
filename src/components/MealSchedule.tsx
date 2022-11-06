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
import { getScheduledMeals } from '../selectors';
import { isNil } from 'lodash';
import MealInCalendar from './MealInCalendar';
import Drawer from '@mui/material/Drawer';

import MealPropertySheet from './MealPropertySheet';
import { setStartDate } from '../models';

import MealsStatusResolver from './MealsStatusResolver';
import GenerateMenuDialog from './GenerateMenuDialog';

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
  scheduledMeals: ScheduledMealEntity[];
  onGenerateMenu: (startDate: Date, numberOfMealsToGenerate: number, overwriteExistingMeals: boolean) => any;
  onUpdateMealStatus: (mealId: string, mealStatus: MealStatus) => any;
  onSetStartDate: (startDate: Date) => void;

}

const MealSchedule = (props: MealScheduleProps) => {

  const [events, setEvents] = useState([] as CalendarEvent[]);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedMealInCalendar, setSelectedMealInCalendar] = useState<CalendarEvent | null>(null);

  const [showGenerateMenu, setShowGenerateMenu] = React.useState(false);

  const handleCloseScheduledMealsStatusResolver = () => {
    console.log('handleCloseScheduledMealsStatusResolver');
  };

  const handleGenerateMenu = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    props.onSetStartDate(tomorrow);
    setShowGenerateMenu(true);
  };

  const handleGenerateGroceryList = () => {
    console.log('handleGenerateGroceryList');
  };

  const handleExecuteGenerateMenu = (startDate: Date, numberOfMealsToGenerate: number, overwriteExistingMeals: boolean) => {
    console.log('handleExecuteGenerateMenu');
    console.log(startDate);
    console.log(numberOfMealsToGenerate);
    console.log(overwriteExistingMeals);
    props.onGenerateMenu(startDate, numberOfMealsToGenerate, overwriteExistingMeals);
  };

  const handleCloseGenerateMenu = () => {
    setShowGenerateMenu(false);
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

  /*
      <ScheduledMealsStatusResolver
        onClose={handleCloseScheduledMealsStatusResolver}
      />
  */

  return (
    <div>
      <div>
        <GenerateMenuDialog
          open={showGenerateMenu}
          onClose={handleCloseGenerateMenu}
          onGenerateMenus={handleExecuteGenerateMenu}
        />
      </div>
      <MealsStatusResolver
        onClose={handleCloseScheduledMealsStatusResolver}
      />
      <div style={{ height: '100vh' }}>
        <div style={{ height: '100vh' }}>
          <div style={{ height: 30, width: '100%' }}>
            <button type="button" onClick={handleGenerateMenu}>Generate Menu</button>
            <button type='button' onClick={handleGenerateGroceryList}>Generate Grocery List</button>
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
  return {
    scheduledMeals: getScheduledMeals(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onGenerateMenu: generateMenu,
    onUpdateMealStatus: updateMealStatus,
    onSetStartDate: setStartDate,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MealSchedule);

