import { TedState } from '../types/base';

export const getPlaceholder = (state: TedState): string => {
  return state.appState.placeholder;
};
