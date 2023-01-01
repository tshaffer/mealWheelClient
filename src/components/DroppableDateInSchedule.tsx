import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import type { CSSProperties } from 'react';
import { useDrop } from 'react-dnd';
import { MealEntity, MealOnDate } from '../types';
import { isNil } from 'lodash';

const style: CSSProperties = {
  height: '12rem',
  width: '12rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  color: 'white',
  padding: '1rem',
  textAlign: 'center',
  fontSize: '1rem',
  lineHeight: 'normal',
  float: 'left',
};


export interface DroppableDateInScheduleProps {
  mealOnDate: MealOnDate;
  accept: string[]
  onDrop: (item: any) => void
}

function DroppableDateInSchedule(props: DroppableDateInScheduleProps) {

  const { accept, onDrop } = props;

  const [{ isOver, canDrop }, drop] = useDrop({
    accept,
    drop: onDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = isOver && canDrop;
  let backgroundColor = '#222';
  if (isActive) {
    backgroundColor = 'darkgreen';
  } else if (canDrop) {
    backgroundColor = 'darkkhaki';
  }

  const getFormattedMeal = (initialString: string, meal: MealEntity): string => {

    let formattedMealString: string = initialString;

    formattedMealString += meal.mainDish.name;
    if (!isNil(meal.salad)) {
      formattedMealString += ', ' + meal.salad.name;
    }
    if (!isNil(meal.side)) {
      formattedMealString += ', ' + meal.side.name;
    }
    if (!isNil(meal.veggie)) {
      formattedMealString += ', ' + meal.veggie.name;
    }

    return formattedMealString;
  };

  const getFormattedMealOnDate = (mealOnDate: MealOnDate): string => {

    let formattedMealOnDate = mealOnDate.date.toDateString();
    if (!isNil(mealOnDate.meal)) {
      formattedMealOnDate += ' : ';
      formattedMealOnDate = getFormattedMeal(formattedMealOnDate, mealOnDate.meal);
    } else {
      formattedMealOnDate += ' : unassigned';
    }
    return formattedMealOnDate;
  };

  return (
    <div ref={drop} style={{ ...style, backgroundColor }}>
      <div key={props.mealOnDate.date.toString()}>
        {getFormattedMealOnDate(props.mealOnDate)}
      </div>
    </div>
  );
}

function mapStateToProps(state: any) {
  return {
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(DroppableDateInSchedule);

