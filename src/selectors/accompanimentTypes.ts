import { isNil } from 'lodash';
import {
  MealWheelState,
  AccompanimentTypesMap,
  AccompanimentTypeEntity,
} from '../types';
import { getCurrentUser } from './appState';

const getAccompanimentTypes = (state: MealWheelState): AccompanimentTypesMap => {
  return state.accompanimentTypes;
};

export const getAccompanimentTypesByUser = (state: MealWheelState): AccompanimentTypeEntity[] => {
  
  const currentUserId: string | null = getCurrentUser(state);
  if (!isNil(currentUserId)) {
    const accompanimentTypesMap = getAccompanimentTypes(state);
    if (Object.prototype.hasOwnProperty.call(accompanimentTypesMap, currentUserId)) {
      const accompanimentTypeEntities = accompanimentTypesMap[currentUserId];
      return accompanimentTypeEntities;
    }
  }

  return [];
};