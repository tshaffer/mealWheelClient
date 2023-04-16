import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Calendar, View } from 'react-big-calendar';
import moment from 'moment';

import { momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { cloneDeep } from 'lodash';

import { MealStatus, ScheduledMealEntity } from '../types';
import { generateGroceryList, generateMenu, updateMealStatus } from '../controllers';
import { getScheduledMeals } from '../selectors';
import { isNil } from 'lodash';
import MealInCalendar from './MealInCalendar';
import Drawer from '@mui/material/Drawer';

import MealPropertySheet from './MealPropertySheet';
import {
  MealWheelDispatch,
  setGroceryListStartDate,
  setStartDate,
} from '../models';

import MealsStatusResolver from './MealsStatusResolver';
import GenerateMenuDialog from './GenerateMenuDialog';
import GenerateGroceryListDialog from './GenerateGroceryListDialog';
import GroceryListDialog from './GroceryListDialog';
import AssignMealsToDatesDialog from './AssignMealsToDatesDialog';

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
  onGenerateMenu: (startDate: Date, numberOfMealsToGenerate: number) => any;
  onGenerateGroceryList: (startDate: Date, numberOfMealsToGenerate: number, showStaples: boolean) => any;
  onUpdateMealStatus: (mealId: string, mealStatus: MealStatus) => any;
  onSetStartDate: (startDate: Date) => void;
  onSetGroceryListStartDate: (startDate: Date) => void;
}

const MealSchedule = (props: MealScheduleProps) => {

  const [events, setEvents] = useState([] as CalendarEvent[]);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedMealInCalendar, setSelectedMealInCalendar] = useState<CalendarEvent | null>(null);

  const [showGenerateMenu, setShowGenerateMenu] = React.useState(false);
  const [showAssignMealsToDates, setShowAssignMealsToDates] = React.useState(false);
  const [showGenerateGroceryList, setShowGenerateGroceryList] = React.useState(false);
  const [showGroceryList, setShowGroceryList] = React.useState(false);

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
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    props.onSetGroceryListStartDate(tomorrow);
    setShowGenerateGroceryList(true);
  };

  const handleExecuteGenerateMenu = (startDate: Date, numberOfMealsToGenerate: number) => {
    props.onGenerateMenu(startDate, numberOfMealsToGenerate);
  };

  const handleCloseGenerateMenu = (generateMealsCancelled: boolean) => {
    setShowGenerateMenu(false);
    if (!generateMealsCancelled) {
      setShowAssignMealsToDates(true);
    }
  };

  const handleCloseAssignMealsToDates = () => {
    setShowAssignMealsToDates(false);
  };

  const handleExecuteGenerateGroceryList = (startDate: Date, numberOfMealsToGenerate: number, showStaples: boolean) => {
    props.onGenerateGroceryList(startDate, numberOfMealsToGenerate, showStaples);
    setShowGroceryList(true);
  };

  const handleCloseGenerateGroceryList = () => {
    setShowGenerateGroceryList(false);
  };

  const handleCloseGroceryList = () => {
    setShowGroceryList(false);
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

  return (
    <div>
      <div>
        <GenerateMenuDialog
          open={showGenerateMenu}
          onClose={handleCloseGenerateMenu}
          onGenerateMenus={handleExecuteGenerateMenu}
        />
      </div>
      <div>
        <AssignMealsToDatesDialog
          open={showAssignMealsToDates}
          onClose={handleCloseAssignMealsToDates}
        />
      </div>
      <div>
        <GenerateGroceryListDialog
          open={showGenerateGroceryList}
          onClose={handleCloseGenerateGroceryList}
          onGenerateGroceryList={handleExecuteGenerateGroceryList}
        />
      </div>
      <div>
        <GroceryListDialog
          open={showGroceryList}
          onClose={handleCloseGroceryList}
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
          <div>
            pizza
          </div>
          {/* <MealPropertySheet
            scheduledMealId={isNil(selectedMealInCalendar) ? '' : (isNil(selectedMealInCalendar.scheduledMealId) ? '' : selectedMealInCalendar.scheduledMealId)}
            selectedMealInCalendar={selectedMealInCalendar}
            handleClose={handleClosePropertySheet}
            onUpdateCalendarEvent={handleUpdateCalendarEvent}
          /> */}
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

const mapDispatchToProps = (dispatch: MealWheelDispatch) => {
  return bindActionCreators({
    onGenerateMenu: generateMenu,
    onGenerateGroceryList: generateGroceryList,
    onUpdateMealStatus: updateMealStatus,
    onSetStartDate: setStartDate,
    onSetGroceryListStartDate: setGroceryListStartDate,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MealSchedule);

