import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { isNil } from 'lodash';

import { DetailedMealEntity, DishType, MealStatus, DishEntity } from '../types';
import { CalendarEvent } from './MealSchedule';

export interface MealInCalendarPropsFromParent {
  event: CalendarEvent;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MealInCalendarProps extends MealInCalendarPropsFromParent {
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

    if (isNil(detailedMeal) || (isNil(detailedMeal.salad) && isNil(detailedMeal.veggie) && isNil(detailedMeal.side))) {
      return (
        <p className='shortParagraph'>{''}</p>
      );
    }

    const renderedAccompaniments = [];

    let jsx = renderAccompaniment(detailedMeal.salad);
    if (!isNil(jsx)) {
      renderedAccompaniments.push(jsx);
    }
    jsx = renderAccompaniment(detailedMeal.veggie);
    if (!isNil(jsx)) {
      renderedAccompaniments.push(jsx);
    }
    jsx = renderAccompaniment(detailedMeal.side);
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

function mapStateToProps(state: any) {
  return {
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MealInCalendar);


