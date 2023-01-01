import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import type { CSSProperties } from 'react';
import { useDrop } from 'react-dnd';
import { DishEntity, MealEntity, MealOnDate } from '../types';
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

  const getFormattedEmptyMeal = (): JSX.Element => {
    return (
      <React.Fragment>
        {'Unassigned'}
      </React.Fragment>
    );
  };

  const getFormattedAccompaniment = (dishEntity: DishEntity | undefined, dishLabel: string): JSX.Element | null => {
    if (isNil(dishEntity)) {
      return null;
    }
    return (
      <React.Fragment>
        <br/>
        {dishLabel + ': ' + dishEntity.name}
      </React.Fragment>
    );
  };

  const getFormattedNonEmptyMeal = (meal: MealEntity): JSX.Element => {
    return (
      <React.Fragment>
        {'Main: ' + meal.mainDish.name}
        {getFormattedAccompaniment(meal.salad, 'Salad')}
        {getFormattedAccompaniment(meal.side, 'Side')}
        {getFormattedAccompaniment(meal.veggie, 'Veggie')}
      </React.Fragment>
    );
  };

  const getFormattedMealOnDate = (mealOnDate: MealOnDate): JSX.Element => {

    let formattedMeal: JSX.Element;

    if (isNil(mealOnDate.meal)) {
      formattedMeal = getFormattedEmptyMeal();
    } else {
      formattedMeal = getFormattedNonEmptyMeal(mealOnDate.meal);
    }
    return (
      <div key={props.mealOnDate.date.toString()}>
        {mealOnDate.date.toDateString()}
        <br/>
        {formattedMeal}
      </div>
    );
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

