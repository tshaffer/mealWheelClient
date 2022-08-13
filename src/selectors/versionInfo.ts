import {
  VersionInfo,
  MealWheelState
} from '../types';

export const getVersionInfo = (state: MealWheelState): VersionInfo => {
  return state.versionInfo;
};
