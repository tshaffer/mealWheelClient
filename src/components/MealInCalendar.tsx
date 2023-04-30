import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { isNil, isString } from 'lodash';

import { DishEntity, ScheduledMealEntity } from '../types';
import { CalendarEvent } from './MealSchedule';
import {
  getAccompanimentById,
  getMainById,
  getScheduledMeal,
} from '../selectors';
import { MealWheelDispatch } from '../models';

export interface MealInCalendarPropsFromParent {
  event: CalendarEvent;
}

export interface MealInCalendarProps extends MealInCalendarPropsFromParent {
  main: DishEntity | null;
  accompaniments: DishEntity[] | null;
}

const MealInCalendar = (props: MealInCalendarProps) => {

  const getAccompanimentLabel = (accompanimentType: string): string => {
    // TEDTODO
    return accompanimentType;
  };

  const renderMainDish = () => {
    if (isNil(props.main)) {
      return null;
    }
    return (
      <p className='shortParagraph'>{props.main.name}</p>
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


  const renderAccompaniments = () => {

    if (isNil(props.accompaniments) || props.accompaniments.length === 0) {
      return (
        <p className='shortParagraph'>{''}</p>
      );
    }

    const renderedAccompaniments: JSX.Element[] = [];

    if (!isNil(props.accompaniments)) {
      props.accompaniments.forEach((accompaniment: DishEntity) => {
        const renderedAccompanimentJsx = renderAccompaniment(accompaniment);
        if (!isNil(renderedAccompanimentJsx)) {
          renderedAccompaniments.push(renderedAccompanimentJsx);
        }
      });
    }
    return renderedAccompaniments;
  };

  const mainDish = renderMainDish();
  const accompaniments = renderAccompaniments();

  return (
    <div>
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
  const accompaniments: DishEntity[] = [];

  if (!isNil(scheduledMeal)) {

    main = getMainById(state, scheduledMeal.mainDishId) as DishEntity;

    if (scheduledMeal.accompanimentIds.length > 0) {
      scheduledMeal.accompanimentIds.forEach((accompanimentDishId: string) => {
        const accompanimentDish: DishEntity | null = getAccompanimentById(state, accompanimentDishId);
        if (!isNil(accompanimentDish)) {
          accompaniments!.push(accompanimentDish);
        }
      });
    }

  } else {
    // anything?
  }

  return {
    main,
    accompaniments,
  };
}

const mapDispatchToProps = (dispatch: MealWheelDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MealInCalendar);


