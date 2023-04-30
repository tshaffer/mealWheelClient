import * as React from 'react';

import { isNil } from 'lodash';

import { DishEntity, MealEntity } from '../types';

export interface MenuItemProps {
  meal: MealEntity;
}

const MenuItemDescriptor = (props: MenuItemProps) => {

  const { meal } = props;

  const renderDish = (dishEntity: DishEntity, dishLabel: string, insertBreak: boolean): JSX.Element => {
    return (
      <React.Fragment>
        {insertBreak ? (<br />) : null}
        {dishLabel + ': ' + dishEntity.name}
      </React.Fragment>
    );
  };

  const renderAccompaniments = (): JSX.Element[] => {
    if (!isNil(meal.accompanimentDishes)) {
      const accompaniments = meal.accompanimentDishes.map( (accompanimentDish: DishEntity) => {
        return renderDish(accompanimentDish, accompanimentDish.type, true);
      });
      return accompaniments;
    }
    return [];
  };

  const accompaniments: JSX.Element[] = renderAccompaniments();
  
  return (
    <div key={meal.id}>
      {renderDish(meal.mainDish, 'Main', false)}
      {accompaniments}
    </div>
  );
};

export default MenuItemDescriptor;