import { Button } from '@mui/material';
import { isNil } from 'lodash';
import React, { useState } from 'react';
import { DetailedMealEntity } from '../types';
import { CalendarEvent, getAccompanimentLabel } from './MealSchedule';

const MealInCalendar = (props: any) => {

  const handleAccept = (event: any) => {
    console.log('handleAccept: ');
    console.log(event);
  };

  const handleReject = (event: any) => {
    console.log('handleReject: ');
    console.log(event);
  };

  // console.log('EventComponent props:');
  // console.log(props);

  const calendarEvent: CalendarEvent = props.event;

  let mainDishLabel: string = '';
  let accompanimentLabel: string = '';

  const detailedMeal: DetailedMealEntity | undefined = calendarEvent.detailedMeal;
  if (!isNil(detailedMeal)) {

    mainDishLabel = 'Main: ' + detailedMeal.mainDish.name;

    let accompanimentType: string = '';
    if (!isNil(detailedMeal.accompanimentDish)) {
      accompanimentType = getAccompanimentLabel(detailedMeal.accompanimentDish.type);
      accompanimentLabel = accompanimentType + ': ' + detailedMeal.accompanimentDish.name;
    }
  }
  return (
    <div>
      <p>{mainDishLabel}</p>
      <p>{accompanimentLabel}</p>
      <div>
        <Button
          className='menuButton'
          color='inherit'
          onClick={() => handleReject(detailedMeal)}
        >
          Reject
        </Button>
        <Button
          className='menuButton'
          color='inherit'
          onClick={() => handleAccept(detailedMeal)}
        >
          Accept
        </Button>
      </div>
    </div>
  );
};

export default MealInCalendar;
