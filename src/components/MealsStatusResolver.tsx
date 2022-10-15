import { isNil } from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getScheduledMealsToResolve, getMainById, getVeggieById, getSideById, getSaladById, getMains, getSides, getSalads, getVeggies } from '../selectors';
import { VerboseScheduledMeal, DishEntity, ScheduledMealEntity, MealStatus } from '../types';

import MealStatusResolver from './MealStatusResolver';

export interface MealsStatusResolverPropsFromParent {
  onClose: () => void;
}

export interface MealsStatusResolverProps extends MealsStatusResolverPropsFromParent {
  verboseScheduledMeals: VerboseScheduledMeal[];
  mains: DishEntity[];
  sides: DishEntity[];
  salads: DishEntity[];
  veggies: DishEntity[];
  scheduledMealsToResolve: ScheduledMealEntity[];
  onUpdateSideInMeal: (mealId: string, newSideId: string) => any;
  onUpdateSaladInMeal: (mealId: string, newSaladId: string) => any;
  onUpdateVeggieInMeal: (mealId: string, newVeggieId: string) => any;
  onUpdateMainInMeal: (mealId: string, newMainId: string) => any;
  onUpdateMealStatus: (mealId: string, mealStatus: MealStatus) => any;
}

const MealsStatusResolver = (props: MealsStatusResolverProps) => {

  const { verboseScheduledMeals, onClose } = props;

  const handlePreviousDay = () => {
    console.log('handlePreviousDay');
    // props.onClearScheduledMealsToResolve();
  };

  const handleNextDay = () => {
    console.log('handleNextDay');
    // props.onClearScheduledMealsToResolve();
  };



  const handleCloseMealStatusResolver = () => {
    console.log('handleCloseMealStatusResolver');
    // props.onClearScheduledMealsToResolve();
  };

  if (verboseScheduledMeals.length === 0) {
    return null;
  }
  
  return (
    <div>
      <MealStatusResolver
        scheduledMealId={verboseScheduledMeals[0].id}
        previousDayEnabled={true}
        onPreviousDay={handlePreviousDay}
        nextDayEnabled={true}
        onNextDay={handleNextDay}
        onClose={handleCloseMealStatusResolver}
      />
    </div>
  );
};

function mapStateToProps(state: any) {

  const verboseScheduledMeals: VerboseScheduledMeal[] = [];

  const scheduledMealsToResolve: ScheduledMealEntity[] = getScheduledMealsToResolve(state);

  for (const scheduledMeal of scheduledMealsToResolve) {

    const mainDish: DishEntity | null = isNil(scheduledMeal.mainDishId) ? null : getMainById(state, scheduledMeal.mainDishId);
    const mainDishName: string = isNil(scheduledMeal.mainDishId) ? '' :
      isNil(getMainById(state, scheduledMeal.mainDishId)) ? '' : (getMainById(state, scheduledMeal.mainDishId) as DishEntity).name;

    const veggie: DishEntity | null = isNil(scheduledMeal.veggieId) ? null : getVeggieById(state, scheduledMeal.veggieId);
    const veggieName: string = isNil(scheduledMeal.veggieId) ? '' :
      isNil(getVeggieById(state, scheduledMeal.veggieId)) ? '' : (getVeggieById(state, scheduledMeal.veggieId) as DishEntity).name;

    const side: DishEntity | null = isNil(scheduledMeal.sideId) ? null : getSideById(state, scheduledMeal.sideId);
    const sideName: string = isNil(scheduledMeal.sideId) ? '' :
      isNil(getSideById(state, scheduledMeal.sideId)) ? '' : (getSideById(state, scheduledMeal.sideId) as DishEntity).name;

    const salad: DishEntity | null = isNil(scheduledMeal.saladId) ? null : getSaladById(state, scheduledMeal.saladId);
    const saladName: string = isNil(scheduledMeal.saladId) ? '' :
      isNil(getSaladById(state, scheduledMeal.saladId)) ? '' : (getSaladById(state, scheduledMeal.saladId) as DishEntity).name;

    verboseScheduledMeals.push({
      ...scheduledMeal,
      mainDish,
      mainDishName,
      salad,
      saladName,
      veggie,
      veggieName,
      side,
      sideName,
    });
  }

  return {
    verboseScheduledMeals,
    mains: getMains(state),
    sides: getSides(state),
    salads: getSalads(state),
    veggies: getVeggies(state),
    scheduledMealsToResolve: getScheduledMealsToResolve(state),
  };
}


const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MealsStatusResolver);
