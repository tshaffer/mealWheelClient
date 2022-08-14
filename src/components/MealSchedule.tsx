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
  // const [events, setEvents] = useState([
  //   {
  //     title: 'test',
  //     allDay: false,
  //     start,
  //     end,
  //     desc: 'test',
  //   }
  // ] as CalendarEvent[]);

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
        defaultDate={new Date(start.getFullYear(), start.getMonth(), start.getDate())}
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

// import * as React from 'react';
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';

// import { Box } from '@mui/material';
// import Grid from '@mui/material/Grid';

// import { Meal } from '../types';
// import MealComponent from './MealComponent';
// import { getCurrentUser, getMeals } from '../selectors';
// import {
//   generateMenu,
//   loadDishes,
//   loadMeals,
// } from '../controllers';
// import { isNil } from 'lodash';

// export interface MealScheduleProps {
//   userId: string;
//   meals: Meal[];
//   onLoadMeals: (usrId: string) => any;
//   onGenerateMenu: () => any;
// }

// const MealSchedule = (props: MealScheduleProps) => {

//   React.useEffect(() => {
//     console.log('Meals useEffect: ', props.userId);
//     if (!isNil(props.userId)) {
//       props.onLoadMeals(props.userId);
//     }
//   }, [props.userId]);

//   const handleGenerateMenu = () => {
//     props.onGenerateMenu();
//   };

//   const renderMealRow = (meal: Meal) => {
//     return (
//       <MealComponent
//         mainDishId={meal.mainDishId}
//         accompanimentDishId={meal.accompanimentDishId}
//         key={meal.mainDishId}
//       />
//     );
//   };


//   const renderMealRows = () => {

//     if (props.meals.length === 0) {
//       return null;
//     }

//     const mealRows = props.meals.map((meal: Meal) => {
//       return renderMealRow(meal);
//     });

//     return mealRows;
//   };

//   const renderMeals = () => {

//     if (props.meals.length === 0) {
//       return null;
//     }

//     const mealRows = renderMealRows();

//     if (isNil(mealRows)) {
//       return null;
//     }

//     return (
//       <Box sx={{ flexGrow: 1 }}>
//         <Grid container spacing={2}>
//           {mealRows}
//         </Grid>
//       </Box>
//     );
//   };

//   const meals = renderMeals();

//   return (
//     <div style={{ height: 300, width: '100%' }}>
//       <button type="button" onClick={handleGenerateMenu}>Generate Menu</button>
//       <br />
//       {meals}
//     </div>
//   );
// };

// function mapStateToProps(state: any) {
//   return {
//     userId: getCurrentUser(state) as string,
//     meals: getMeals(state),
//   };
// }

// const mapDispatchToProps = (dispatch: any) => {
//   return bindActionCreators({
//     onLoadMeals: loadMeals,
//     onGenerateMenu: generateMenu,
//   }, dispatch);
// };

// export default connect(mapStateToProps, mapDispatchToProps)(MealSchedule);
