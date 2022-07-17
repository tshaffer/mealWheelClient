import axios from 'axios';
import { addDish, updateDishRedux } from '../models';

import { apiUrlFragment, DishEntity, serverUrl } from '../types';

export const loadDishes = () => {
  return (dispatch: any) => {
    const path = serverUrl + apiUrlFragment + 'dishes';

    return axios.get(path)
      .then((dishesResponse: any) => {
        const dishEntities: DishEntity[] = (dishesResponse as any).data;
        // // TEDTODO - add all in a single call
        for (const dishEntity of dishEntities) {
          dispatch(addDish(dishEntity.id, dishEntity));
        }
      });
  };
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

