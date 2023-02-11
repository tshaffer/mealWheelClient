import * as React from 'react';

import type { CSSProperties } from 'react';
import { useDrop } from 'react-dnd';
import { DishEntityMongo, MealEntity, MealOnDateMongo } from '../types';
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
  mealOnDate: MealOnDateMongo;
  accept: string[];
  onDrop: (item: any) => void;
  onClearAssignedMealOnDateMongo: (mealOnDate: MealOnDateMongo) => any;
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

  const handleClearAssignedMealOnDateMongo = (mealOnDate: MealOnDateMongo) => {
    props.onClearAssignedMealOnDateMongo(mealOnDate);
  };

  const getFormattedEmptyMeal = (): JSX.Element => {
    return (
      <React.Fragment>
        {'Unassigned'}
      </React.Fragment>
    );
  };

  const getFormattedAccompaniment = (dishEntity: DishEntityMongo | undefined, dishLabel: string): JSX.Element | null => {
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

  const getFormattedNonEmptyMeal = (mealOnDate: MealOnDateMongo): JSX.Element => {
    const meal: MealEntity = mealOnDate.meal as unknown as MealEntity;
    return (
      <React.Fragment>
        {'Main: ' + meal.mainDish.name}
        {getFormattedAccompaniment(meal.salad, 'Salad')}
        {getFormattedAccompaniment(meal.side, 'Side')}
        {getFormattedAccompaniment(meal.veggie, 'Veggie')}
        <br />
        <Button
          onClick={() => handleClearAssignedMealOnDateMongo(mealOnDate)}
        >
          Clear Assigned Meal
        </Button>

      </React.Fragment>
    );
  };

  const getFormattedMealOnDateMongo = (mealOnDate: MealOnDateMongo): JSX.Element => {

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

  const renderMealOnDateMongo = (mealOnDate: MealOnDateMongo): JSX.Element => {
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
        <Button onClick={() => handleClearAssignedMealOnDateMongo(mealOnDate)}>
          Clear Assigned Meal
        </Button>
      </React.Fragment>
    );
  };

  const renderedMealOnDateMongo = renderMealOnDateMongo(props.mealOnDate);

  return (
    <div ref={drop} style={{ ...style, backgroundColor }}>
      {renderedMealOnDateMongo}
    </div>
  );
}

export default DroppableDateInSchedule;

