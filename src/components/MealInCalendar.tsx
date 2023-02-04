import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { isNil, isString } from 'lodash';

import { DishType, DishEntity, ScheduledMealEntity } from '../types';
import { CalendarEvent } from './MealSchedule';
import { getMainById, getSaladById, getScheduledMeal, getSideById, getVeggieById } from '../selectors';
import { MealWheelDispatch } from '../models';

export interface MealInCalendarPropsFromParent {
  event: CalendarEvent;
}

export interface MealInCalendarProps extends MealInCalendarPropsFromParent {
  main: DishEntity | null;
  salad: DishEntity | null;
  side: DishEntity | null;
  veggie: DishEntity | null;
}

const MealInCalendar = (props: MealInCalendarProps) => {

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

  const renderMainDish = () => {
    if (isNil(props.main)) {
      return null;
    }
    return (
      <p className='shortParagraph'>{props.main.name}</p>
    );
  };

  const renderAccompaniment = (accompanimentDish: DishEntity | null) => {

    if (isNil(accompanimentDish)) {
      return null;
    }

    const accompanimentType = getAccompanimentLabel(accompanimentDish.type);
    const accompanimentLabel = accompanimentType + ': ' + accompanimentDish.name;
    return (
      <p className='shortParagraph' key={accompanimentDish.id}>{accompanimentLabel}</p>
    );
  };


  const renderAccompaniments = () => {

    if (isNil(props.salad) && isNil(props.side) && isNil(props.veggie)) {
      return (
        <p className='shortParagraph'>{''}</p>
      );
    }

    const renderedAccompaniments = [];

    let jsx = renderAccompaniment(props.salad);
    if (!isNil(jsx)) {
      renderedAccompaniments.push(jsx);
    }
    jsx = renderAccompaniment(props.veggie);
    if (!isNil(jsx)) {
      renderedAccompaniments.push(jsx);
    }
    jsx = renderAccompaniment(props.side);
    if (!isNil(jsx)) {
      renderedAccompaniments.push(jsx);
    }

    return renderedAccompaniments;
  };

  const mainDish = renderMainDish();
  const accompaniment = renderAccompaniments();

  return (
    <div>
      {mainDish}
      {accompaniment}
    </div>
  );
};

function mapStateToProps(state: any, ownProps: MealInCalendarPropsFromParent) {

  const calendarEvent: CalendarEvent = ownProps.event;
  const scheduledMealId: string = isNil(calendarEvent.scheduledMealId) ? '' :
    (isString(calendarEvent.scheduledMealId)) ? calendarEvent.scheduledMealId : '';
  const scheduledMeal: ScheduledMealEntity | null = getScheduledMeal(state, scheduledMealId);

  let main: DishEntity | null = null;
  let salad: DishEntity | null = null;
  let side: DishEntity | null = null;
  let veggie: DishEntity | null = null;
  if (!isNil(scheduledMeal)) {
    main = getMainById(state, scheduledMeal.mainDishId) as DishEntity;
    salad = getSaladById(state, scheduledMeal.saladId);
    side = getSideById(state, scheduledMeal.sideId);
    veggie = getVeggieById(state, scheduledMeal.veggieId);
  } else {
    // anything
  }
  return {
    main,
    salad,
    side,
    veggie
  };
}

const mapDispatchToProps = (dispatch: MealWheelDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MealInCalendar);


