import axios from 'axios';
import { MealWheelVoidPromiseThunkAction, MealWheelDispatch, addIngredientsRedux } from '../models';
import { addAccompanimentTypes } from '../models/accompanimentTypes';
import { getCurrentUser } from '../selectors';
import { MealWheelState, serverUrl, apiUrlFragment, AccompanimentTypeEntity } from '../types';

export const loadAccompanimentTypes = (): MealWheelVoidPromiseThunkAction => {

  return (dispatch: MealWheelDispatch, getState: any) => {

    const state: MealWheelState = getState();
    const id = getCurrentUser(state) as string;

    const path = serverUrl + apiUrlFragment + 'accompanimentTypes?id=' + id;

    return axios.get(path)
      .then((accompanimentTypesResponse: any) => {
        const accompanimentTypes: AccompanimentTypeEntity[] = (accompanimentTypesResponse as any).data;
        dispatch(addAccompanimentTypes(id, accompanimentTypes));
      });
  };
};

