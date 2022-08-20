import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { isNil } from 'lodash';

import { Button, } from '@mui/material';
import { DetailedMealEntity, MealEntity, MealStatus } from '../types';
import { CalendarEvent, getAccompanimentLabel, getMealStatusLabel } from './MealSchedule';
import {
  updateMealRedux
} from '../models';
import { deepStrictEqual } from 'assert';

export interface MealInCalendarPropsFromParent {
  event: CalendarEvent;
}

export interface MealInCalendarProps extends MealInCalendarPropsFromParent {
  onUpdateMeal: (id: string, meal: MealEntity) => any;
}

const MealInCalendar = (props: MealInCalendarProps) => {

  const updateDishStatus = (detailedMeal: DetailedMealEntity) => {
    const mealEntity: MealEntity = {
      id: detailedMeal.id,
      userId: detailedMeal.userId,
      mainDishId: detailedMeal.mainDish.id,
      accompanimentDishId: isNil(detailedMeal.accompanimentDish) ? null : detailedMeal.accompanimentDish.id,
      dateScheduled: detailedMeal.dateScheduled,
      status: detailedMeal.status,
    };
    props.onUpdateMeal(mealEntity.id, mealEntity);
  };

  const handleAccept = (detailedMeal: DetailedMealEntity) => {
    console.log('handleAccept: ');
    console.log(detailedMeal);
    detailedMeal.status = MealStatus.pending;
    updateDishStatus(detailedMeal);
  };

  const handleReject = (detailedMeal: DetailedMealEntity) => {
    console.log('handleReject: ');
    console.log(detailedMeal);
  };

  const handleReplace = (detailedMeal: DetailedMealEntity) => {
    console.log('handleReplace: ');
    console.log(detailedMeal);
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
              onClick={() => handleAccept(detailedMeal)}
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
              onClick={() => handleReplace(detailedMeal)}
            >
              Replace
            </Button>
          </div>
        );
      case MealStatus.pending:
        return (<div>pizza</div>);
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

  return (
    <div>
      {mainDish}
      {accompaniment}
      {mealStatus}
      {actions}
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onUpdateMeal: updateMealRedux,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MealInCalendar);


