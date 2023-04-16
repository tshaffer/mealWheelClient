import {
  MealWheelState,
  AccompanimentTypesMap,
} from '../types';

export const getAccompanimentTypes = (state: MealWheelState): AccompanimentTypesMap => {
  return state.accompanimentTypes;
};

