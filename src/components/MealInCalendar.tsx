import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { isNil } from 'lodash';

import { Button, } from '@mui/material';
import { DetailedMealEntity, DishType, MealEntity, MealStatus } from '../types';
import { CalendarEvent } from './MealSchedule';
import { updateMeal } from '../controllers';

export interface MealInCalendarPropsFromParent {
  event: CalendarEvent;
}

export interface MealInCalendarProps extends MealInCalendarPropsFromParent {
  onUpdateMeal: (id: string, meal: MealEntity) => any;
}

const MealInCalendar = (props: MealInCalendarProps) => {

  const getMealStatusLabel = (mealStatus: MealStatus): string => {
    switch (mealStatus) {
      case MealStatus.proposed:
        return 'Proposed';
      case MealStatus.pending:
      default:
        return 'Pending';
      case MealStatus.completed:
        return 'Completed';
    }
  };

  const getAccompanimentLabel = (accompanimentType: DishType): string => {
    switch (accompanimentType) {
      case DishType.Salad:
        return 'Salad';
      case DishType.Side:
      default:
        return 'Side';
      case DishType.Veggie:
        return 'Vegetable';
    }
  };


  const updateDishStatus = (detailedMeal: DetailedMealEntity) => {
    // const mealEntity: MealEntity = {
    //   id: detailedMeal.id,
    //   userId: detailedMeal.userId,
    //   mainDishId: detailedMeal.mainDish.id,
    //   accompanimentDishId: isNil(detailedMeal.accompanimentDish) ? null : detailedMeal.accompanimentDish.id,
    //   dateScheduled: detailedMeal.dateScheduled,
    //   status: detailedMeal.status,
    // };
    // props.onUpdateMeal(mealEntity.id, mealEntity);
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

  const handleReconsider = (detailedMeal: DetailedMealEntity) => {
    console.log('handleReplace: ');
    console.log(detailedMeal);
    detailedMeal.status = MealStatus.proposed;
    updateDishStatus(detailedMeal);
  };

  const handleCompleted = (detailedMeal: DetailedMealEntity) => {
    console.log('handleReplace: ');
    console.log(detailedMeal);
    detailedMeal.status = MealStatus.completed;
    updateDishStatus(detailedMeal);
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

  const renderProposed = (detailedMeal: DetailedMealEntity) => {
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
  };

  const renderPending = (detailedMeal: DetailedMealEntity) => {
    return (
      <div>
        <Button
          className='menuButton'
          color='inherit'
          onClick={() => handleCompleted(detailedMeal)}
        >
          Completed
        </Button>
        <Button
          className='menuButton'
          color='inherit'
          onClick={() => handleReconsider(detailedMeal)}
        >
          Reconsider
        </Button>
        <Button
          className='menuButton'
          color='inherit'
          onClick={() => handleReject(detailedMeal)}
        >
          Remove
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
  };

  const renderActions = () => {
    if (isNil(detailedMeal)) {
      // OR select a meal?
      return null;
    }
    switch (detailedMeal.status) {
      case MealStatus.proposed:
        return renderProposed(detailedMeal);
      case MealStatus.pending:
        return renderPending(detailedMeal);
      case MealStatus.completed:
      default:
        return null;
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
    onUpdateMeal: updateMeal,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MealInCalendar);


