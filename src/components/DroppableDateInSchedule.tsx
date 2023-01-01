import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import type { CSSProperties } from 'react';
import { useDrop } from 'react-dnd';
import { DishEntity, MealEntity, MealOnDate } from '../types';
import { isNil } from 'lodash';
import { Button } from '@mui/material';

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
  accept: string[];
  onDrop: (item: any) => void;
  onClearAssignedMealOnDate: (mealOnDate: MealOnDate) => any;
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
        <br />
        {dishLabel + ': ' + dishEntity.name}
      </React.Fragment>
    );
  };

  const handleClearAssignedMealOnDate = (mealOnDate: MealOnDate) => {
    // console.log('clear assigned meal on: ', mealOnDate.date.toDateString());
    // if (!isNil(mealOnDate.meal)) {

    //   // get scheduledMeal associated with this date
    //   for (const scheduledMeal of props.scheduledMeals) {
    //     if (getDatesEqual(scheduledMeal.dateScheduled, mealOnDate.date)) {
    //       props.onDeleteScheduledMeal(scheduledMeal.id);
    //     }
    //   }
    // }
    props.onClearAssignedMealOnDate(mealOnDate);
  };

  const getFormattedNonEmptyMeal = (mealOnDate: MealOnDate): JSX.Element => {
    const meal: MealEntity = mealOnDate.meal as unknown as MealEntity;
    return (
      <React.Fragment>
        {'Main: ' + meal.mainDish.name}
        {getFormattedAccompaniment(meal.salad, 'Salad')}
        {getFormattedAccompaniment(meal.side, 'Side')}
        {getFormattedAccompaniment(meal.veggie, 'Veggie')}
        <br/>
        <Button
          onClick={() => handleClearAssignedMealOnDate(mealOnDate)}
        >
          Clear Assigned Meal
        </Button>

      </React.Fragment>
    );
  };

  const getFormattedMealOnDate = (mealOnDate: MealOnDate): JSX.Element => {

    let formattedMeal: JSX.Element;

    if (isNil(mealOnDate.meal)) {
      formattedMeal = getFormattedEmptyMeal();
    } else {
      formattedMeal = getFormattedNonEmptyMeal(mealOnDate);
    }
    return (
      <div key={props.mealOnDate.date.toString()}>
        {mealOnDate.date.toDateString()}
        <br />
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

