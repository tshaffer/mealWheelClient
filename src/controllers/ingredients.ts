import axios from 'axios';

import { apiUrlFragment, BaseDishEntity, DishEntity, MealWheelState, serverUrl } from '../types';

import { getCurrentUser } from '../selectors';

export const loadIngredientsByDish = () => {

  return (dispatch: any, getState: any) => {

    const state: MealWheelState = getState();
    const id = getCurrentUser(state);
    
    const path = serverUrl + apiUrlFragment + 'ingredientsByDish?id=' + id;

    return axios.get(path)
      .then((ingredientsByDish: any) => {
        console.log(ingredientsByDish);
        // const dishEntities: DishEntity[] = (dishesResponse as any).data;
        // dispatch(addDishesRedux(dishEntities));
      });
  };
};

