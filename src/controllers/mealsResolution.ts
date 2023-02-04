import { MealWheelDispatch, MealWheelVoidThunkAction, removeMealToResolve, setMealIndex, setPendingMeal } from '../models';
import { getMealIndex, getMealsToResolve } from '../selectors';
import { MealWheelState, VerboseScheduledMeal } from '../types';

export const resolveMeal = (meal: VerboseScheduledMeal): MealWheelVoidThunkAction => {

  return (dispatch: MealWheelDispatch, getState: any) => {

    let state: MealWheelState = getState();
    const mealIndex: number = getMealIndex(state);
    const mealsToResolve: VerboseScheduledMeal[] = getMealsToResolve(state);

    // remove the specifid meal from the list of meals to resolve.
    dispatch(removeMealToResolve(meal.id));
    state = getState();

    // if index is not at the end, leave it where it is. otherwise, decrement it (unless it's already zero).
    const indexAtEnd: boolean = (mealIndex >= (mealsToResolve.length - 1));

    // get the meal at the updated meal index
    let newMealIndex = mealIndex;
    if (indexAtEnd && mealIndex > 0) {
      newMealIndex--;
      dispatch(setMealIndex(newMealIndex));
    }

    if (mealsToResolve.length > 1) {
      const mealsToResolve: VerboseScheduledMeal[] = getMealsToResolve(state);
      dispatch(setPendingMeal(mealsToResolve[newMealIndex]));
    }
  };
};
