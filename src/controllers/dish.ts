import axios from 'axios';
import { getCurrentUser } from '../selectors';
import { v4 as uuidv4 } from 'uuid';

import { addDishesRedux, addDishRedux, MealWheelDispatch, updateDishRedux } from '../models';

import { apiUrlFragment, BaseDishEntity, DishEntity, MealWheelState, serverUrl } from '../types';

export const loadDishes = () => {
  return (dispatch: MealWheelDispatch, getState: any) => {

    const state: MealWheelState = getState();
    const id = getCurrentUser(state);

    const path = serverUrl + apiUrlFragment + 'dishes?id=' + id;

    return axios.get(path)
      .then((dishesResponse: any) => {
        const dishEntities: DishEntity[] = (dishesResponse as any).data;
        dispatch(addDishesRedux(dishEntities));
      });
  };
};

export const addDish = (
  dish: DishEntity
): any => {
  return ((dispatch: MealWheelDispatch, getState: any): Promise<string> => {

    const path = serverUrl + apiUrlFragment + 'addDish';

    dish.id = uuidv4();

    const addDishBody: any = {
      userId: getCurrentUser(getState()),
      id: dish.id,
      dish,
    };

    return axios.post(
      path,
      addDishBody
    ).then((response) => {
      dispatch(addDishRedux(dish.id, dish));
      return dish.id;
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return '';
    });

  });
};


export const updateDish = (
  id: string,
  dish: DishEntity
): any => {
  return ((dispatch: MealWheelDispatch): any => {

    const path = serverUrl + apiUrlFragment + 'updateDish';

    const updateDishBody: any = {
      id,
      dish,
    };

    return axios.post(
      path,
      updateDishBody
    ).then((response) => {
      dispatch(updateDishRedux(id, dish));
      return;
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return;
    });

  });
};

