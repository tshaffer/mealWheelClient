import React, { CSSProperties } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { isNil, isString } from 'lodash';

import { DndProvider, DragSourceMonitor, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { DishType, DishEntity, ScheduledMealEntity } from '../types';
import { CalendarEvent } from './MealSchedule';
import { getMainById, getSaladById, getScheduledMeal, getSideById, getVeggieById } from '../selectors';

const style: CSSProperties = {
  border: '1px dashed gray',
  // backgroundColor: 'white',
  padding: '0.5rem 1rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  cursor: 'move',
  float: 'left',
};


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

  const [{ opacity }, drag] = useDrag(
    () => ({
      type: 'draggableMeal',
      item: props.main,
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    }),
  );


  console.log('opacity');
  console.log(opacity);
  
  return (
    <div ref={drag} style={{ ...style, opacity }}>
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

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MealInCalendar);


