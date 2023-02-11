import * as React from 'react';

import { isNil } from 'lodash';

import { DishEntityMongo, MealEntity } from '../types';

export interface MenuItemProps {
  meal: MealEntity;
}

const MenuItemDescriptor = (props: MenuItemProps) => {

  const { meal } = props;

  const renderDish = (dishEntity: DishEntityMongo | undefined, dishLabel: string, insertBreak: boolean): JSX.Element | null => {
    if (isNil(dishEntity)) {
      return null;
    }
    return (
      <React.Fragment>
        {insertBreak ? (<br />) : null}
        {dishLabel + ': ' + dishEntity.name}
      </React.Fragment>
    );
  };

  return (
    <div key={meal.id}>
      {renderDish(meal.mainDish, 'Main', false)}
      {renderDish(meal.salad, 'Salad', true)}
      {renderDish(meal.side, 'Side', true)}
      {renderDish(meal.veggie, 'Veggie', true)}
    </div>
  );
};

export default MenuItemDescriptor;