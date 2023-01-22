import * as React from 'react';

import type { CSSProperties } from 'react';
import { useDrop } from 'react-dnd';
import { DishEntity, MealEntity, MealOnDate } from '../types';
import { isNil } from 'lodash';
import { Button } from '@mui/material';
import MenuItemDescriptor from './MenuItemDescriptor';

const style: CSSProperties = {
  height: '92px',
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

  const handleClearAssignedMealOnDate = (mealOnDate: MealOnDate) => {
    props.onClearAssignedMealOnDate(mealOnDate);
  };

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

  const getFormattedNonEmptyMeal = (mealOnDate: MealOnDate): JSX.Element => {
    const meal: MealEntity = mealOnDate.meal as unknown as MealEntity;
    return (
      <React.Fragment>
        {'Main: ' + meal.mainDish.name}
        {getFormattedAccompaniment(meal.salad, 'Salad')}
        {getFormattedAccompaniment(meal.side, 'Side')}
        {getFormattedAccompaniment(meal.veggie, 'Veggie')}
        <br />
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

  const renderMealOnDate = (mealOnDate: MealOnDate): JSX.Element => {
    if (isNil(mealOnDate.meal)) {
      const formattedMeal = getFormattedEmptyMeal();
      return (
        <div key={props.mealOnDate.date.toString()}>
          {mealOnDate.date.toDateString()}
          <br />
          {formattedMeal}
        </div>
      );
    }

    return (
      <React.Fragment key={props.mealOnDate.date.toString()}>
        {mealOnDate.date.toDateString()}
        <MenuItemDescriptor meal={props.mealOnDate.meal as MealEntity} />
        <Button onClick={() => handleClearAssignedMealOnDate(mealOnDate)}>
          Clear Assigned Meal
        </Button>
      </React.Fragment>
    );
  };

  const renderedMealOnDate = renderMealOnDate(props.mealOnDate);

  return (
    <div ref={drop} style={{ ...style, backgroundColor }}>
      {renderedMealOnDate}
    </div>
  );
}

export default DroppableDateInSchedule;

