import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { isNil, isString } from 'lodash';

import { AccompanimentTypeNameById, DishEntity, ScheduledMealEntity } from '../types';
import { CalendarEvent } from './MealSchedule';
import {
  getAccompanimentById,
  getAccompanimentTypeNamesById,
  getMainById,
  getScheduledMeal,
} from '../selectors';
import { MealWheelDispatch } from '../models';

export interface MealInCalendarPropsFromParent {
  event: CalendarEvent;
}

export interface MealInCalendarProps extends MealInCalendarPropsFromParent {
  main: DishEntity | null;
  accompanimentDishes: DishEntity[] | null;
  accompanimentTypeNameById: AccompanimentTypeNameById;
}

const MealInCalendar = (props: MealInCalendarProps) => {

  const getAccompanimentLabel = (accompanimentTypeEntityId: string): string => {
    return props.accompanimentTypeNameById[accompanimentTypeEntityId];
  };

  const renderMainDish = () => {
    if (isNil(props.main)) {
      return null;
    }
    return (
      <p className='shortParagraph' key={props.main.id}>{props.main.name}</p>
    );
  };

  const renderAccompaniment = (accompanimentDish: DishEntity | null): JSX.Element | null => {

    if (isNil(accompanimentDish)) {
      return null;
    }

    const accompanimentType = getAccompanimentLabel(accompanimentDish.type);
    const accompanimentLabel = accompanimentType + ': ' + accompanimentDish.name;
    return (
      <p className='shortParagraph' key={accompanimentDish.id}>{accompanimentLabel}</p>
    );
  };


  const renderAccompaniments = (): JSX.Element[] => {

    const renderedAccompaniments: JSX.Element[] = [];

    if (isNil(props.accompanimentDishes) || props.accompanimentDishes.length === 0) {
      renderedAccompaniments.push(
        <p className='shortParagraph' key='0'>{''}</p>
      );
    }


    if (!isNil(props.accompanimentDishes)) {

      console.log('renderedAccompaniments: number of accompaniments = ' + props.accompanimentDishes.length);

      props.accompanimentDishes.forEach((accompaniment: DishEntity) => {
        const renderedAccompanimentJsx = renderAccompaniment(accompaniment);
        if (!isNil(renderedAccompanimentJsx)) {
          renderedAccompaniments.push(renderedAccompanimentJsx);
        }
      });
    }

    console.log('renderedAccompaniments: number of JSX elements = ' + renderedAccompaniments.length);

    return renderedAccompaniments;
  };

  const mainDish = renderMainDish();
  const accompaniments = renderAccompaniments();

  console.log('render() number of accompaniments: ' + accompaniments.length);
  return (
    <div key={props.event.scheduledMealId}>
      {mainDish}
      {accompaniments}
    </div>
  );
};

function mapStateToProps(state: any, ownProps: MealInCalendarPropsFromParent) {

  const calendarEvent: CalendarEvent = ownProps.event;
  const scheduledMealId: string = isNil(calendarEvent.scheduledMealId) ? '' :
    (isString(calendarEvent.scheduledMealId)) ? calendarEvent.scheduledMealId : '';
  const scheduledMeal: ScheduledMealEntity | null = getScheduledMeal(state, scheduledMealId);

  let main: DishEntity | null = null;
  const accompanimentDishes: DishEntity[] = [];

  if (!isNil(scheduledMeal)) {

    main = getMainById(state, scheduledMeal.mainDishId) as DishEntity;

    if (scheduledMeal.accompanimentDishIds.length > 0) {
      scheduledMeal.accompanimentDishIds.forEach((accompanimentDishId: string) => {
        const accompanimentDish: DishEntity | null = getAccompanimentById(state, accompanimentDishId);
        if (!isNil(accompanimentDish)) {
          accompanimentDishes!.push(accompanimentDish);
        }
      });
    }

  } else {
    // anything?
  }

  return {
    main,
    accompanimentDishes,
    accompanimentTypeNameById: getAccompanimentTypeNamesById(state),
  };
}

const mapDispatchToProps = (dispatch: MealWheelDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MealInCalendar);


