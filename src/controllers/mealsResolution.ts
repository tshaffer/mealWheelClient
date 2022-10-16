import { removeMealToResolve, setMealIndex, setPendingMeal } from '../models';
import { getMealIndex, getMealsToResolve } from '../selectors';
import { MealWheelState, VerboseScheduledMeal } from '../types';

export const updateAfterSave = (meal: VerboseScheduledMeal) => {

  return (dispatch: any, getState: any) => {

    console.log('updateAfterSave dispatched');

    let state: MealWheelState = getState();
    const mealIndex: number = getMealIndex(state);
    const mealsToResolve: VerboseScheduledMeal[] = getMealsToResolve(state);
    // const meal: VerboseScheduledMeal = mealsToResolve[mealIndex];

    // remove the saved meal from the list of meals to resolve.
    dispatch(removeMealToResolve(meal.id));
    state = getState();

    // if index is not at the end, leave it where it is. otherwise, decrement it (unless it's already zero).
    const indexAtEnd: boolean = (mealIndex >= (mealsToResolve.length - 1));

    // get the meal at the updated meal index
    let newMealIndex = mealIndex;
    if (indexAtEnd && mealIndex > 0){
      newMealIndex--;
      dispatch(setMealIndex(newMealIndex));
    }

    if (mealsToResolve.length > 1) {
      const mealsToResolve: VerboseScheduledMeal[] = getMealsToResolve(state);
      dispatch(setPendingMeal(mealsToResolve[newMealIndex]));      
    }
  };
};