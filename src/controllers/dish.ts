import axios from 'axios';
import { addDish } from '../models';

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

