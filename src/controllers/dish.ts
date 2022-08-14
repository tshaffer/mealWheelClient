import axios from 'axios';
import { getCurrentUser } from '../selectors';
import { v4 as uuidv4 } from 'uuid';

import { addDishRedux, updateDishRedux } from '../models';

import { apiUrlFragment, DishEntity, MealWheelState, serverUrl } from '../types';

export const loadDishes = () => {
  return (dispatch: any, getState: any) => {

    const state: MealWheelState = getState();
    const id = getCurrentUser(state);

    console.log('loadDishes, user id: ', id);
    
    const path = serverUrl + apiUrlFragment + 'dishes?id=' + id;

    return axios.get(path)
      .then((dishesResponse: any) => {
        const dishEntities: DishEntity[] = (dishesResponse as any).data;
        // // TEDTODO - add all in a single call
        for (const dishEntity of dishEntities) {
          dispatch(addDishRedux(dishEntity.id, dishEntity));
        }
      });
  };
};

export const addDish = (
  dish: DishEntity
): any => {
  return ((dispatch: any): any => {

    const path = serverUrl + apiUrlFragment + 'addDish';

    dish.id = uuidv4();

    const addDishBody: any = {
      id: dish.id,
      dish,
    };

    return axios.post(
      path,
      addDishBody
    ).then((response) => {
      dispatch(addDishRedux(dish.id, dish));
      return;
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return;
    });

  });
};


export const updateDish = (
  id: string,
  dish: DishEntity
): any => {
  return ((dispatch: any): any => {

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

