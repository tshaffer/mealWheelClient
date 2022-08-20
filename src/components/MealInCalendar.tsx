import { Button, switchClasses } from '@mui/material';
import _, { isNil } from 'lodash';
import React from 'react';
import { DetailedMealEntity, MealStatus } from '../types';
import { CalendarEvent, getAccompanimentLabel, getMealStatusLabel } from './MealSchedule';

const MealInCalendar = (props: any) => {

  const handleAccept = (event: any) => {
    console.log('handleAccept: ');
    console.log(event);
  };

  const handleReject = (event: any) => {
    console.log('handleReject: ');
    console.log(event);
  };

  const calendarEvent: CalendarEvent = props.event;
  const detailedMeal: DetailedMealEntity | undefined = calendarEvent.detailedMeal;

  const renderMainDish = () => {

    let mainDishLabel: string = '';
    if (!isNil(detailedMeal)) {
      mainDishLabel = 'Main: ' + detailedMeal.mainDish.name;
    }

    return (
      <p className='shortParagraph'>{mainDishLabel}</p>
    );
  };

  const renderAccompaniment = () => {

    let accompanimentLabel: string = '';

    if (!isNil(detailedMeal)) {
      let accompanimentType: string = '';
      if (!isNil(detailedMeal.accompanimentDish)) {
        accompanimentType = getAccompanimentLabel(detailedMeal.accompanimentDish.type);
        accompanimentLabel = accompanimentType + ': ' + detailedMeal.accompanimentDish.name;
      }
    }

    return (
      <p className='shortParagraph'>{accompanimentLabel}</p>
    );

  };

  const renderMealStatus = () => {

    let statusLabel = 'Unassigned';

    if (!isNil(detailedMeal)) {
      statusLabel = getMealStatusLabel(detailedMeal.status);
    }

    return (
      <p className='shortParagraph'>{'Status: ' + statusLabel}</p>
    );
  };

  const renderActions = () => {

    if (isNil(detailedMeal)) {
      // OR select a meal?
      return null;
    }

    switch (detailedMeal.status) {
      case MealStatus.proposed:
        return (
          <div>
            <Button
              className='menuButton'
              color='inherit'
              onClick={() => handleReject(detailedMeal)}
            >
              Accept
            </Button>
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
              Replace
            </Button>
          </div>
        );
      case MealStatus.pending:
        return (<div>pizza</div>)
      case MealStatus.completed:
        return 'Completed';
      default:
        return '';
    }

  };

  const mainDish = renderMainDish();
  const accompaniment = renderAccompaniment();
  const mealStatus = renderMealStatus();
  const actions = renderActions();

  /*
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
  */

  return (
    <div>
      {mainDish}
      {accompaniment}
      {mealStatus}
      {actions}
    </div>
  );
};

export default MealInCalendar;
