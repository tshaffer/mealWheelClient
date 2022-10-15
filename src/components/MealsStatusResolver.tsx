import { isNil } from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateMeal } from '../controllers';
import { getScheduledMealsToResolve, getMainById, getVeggieById, getSideById, getSaladById } from '../selectors';
import { VerboseScheduledMeal, DishEntity, ScheduledMealEntity } from '../types';

import MealStatusResolver from './MealStatusResolver';

export interface MealsStatusResolverPropsFromParent {
  onClose: () => void;
}

export interface MealsStatusResolverProps extends MealsStatusResolverPropsFromParent {
  verboseScheduledMeals: VerboseScheduledMeal[];
  scheduledMealsToResolve: ScheduledMealEntity[];
  onUpdateMeal: (mealId: string, scheduledMeal: ScheduledMealEntity) => any;
}

const MealsStatusResolver = (props: MealsStatusResolverProps) => {

  const { verboseScheduledMeals, onClose } = props;

  const [mealIndex, setMealIndex] = React.useState(0);

  const handlePreviousDay = () => {
    if (mealIndex > 0) {
      const currentMealIndex = mealIndex;
      setMealIndex(currentMealIndex - 1);
    }
  };

  const handleNextDay = () => {
    if (mealIndex < (verboseScheduledMeals.length - 1)) {
      const currentMealIndex = mealIndex;
      setMealIndex(currentMealIndex + 1);
    }
  };

  const handleCloseMealStatusResolver = () => {
    console.log('handleCloseMealStatusResolver');
    // props.onClearScheduledMealsToResolve();
  };


  const handleSaveMealStatusResolver = (scheduledMeal: ScheduledMealEntity) => {
    console.log('handleCloseMealStatusResolver');
    // props.onClearScheduledMealsToResolve();
    props.onUpdateMeal(scheduledMeal.id, scheduledMeal);
    handleNextDay();
  };

  if (verboseScheduledMeals.length === 0) {
    return null;
  }

  return (
    <div>
      <MealStatusResolver
        scheduledMealId={verboseScheduledMeals[mealIndex].id}
        previousDayEnabled={mealIndex > 0}
        onPreviousDay={handlePreviousDay}
        nextDayEnabled={mealIndex < (verboseScheduledMeals.length - 1)}
        onNextDay={handleNextDay}
        onClose={handleCloseMealStatusResolver}
        onSave={handleSaveMealStatusResolver}
      />
    </div>
  );
};

function mapStateToProps(state: any) {

  const verboseScheduledMeals: VerboseScheduledMeal[] = [];

  const scheduledMealsToResolve: ScheduledMealEntity[] = getScheduledMealsToResolve(state);

  for (const scheduledMeal of scheduledMealsToResolve) {

    const main: DishEntity | null = isNil(scheduledMeal.mainDishId) ? null : getMainById(state, scheduledMeal.mainDishId);
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
      main,
      mainName: mainDishName,
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
    scheduledMealsToResolve: getScheduledMealsToResolve(state),
  };
}


const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onUpdateMeal: updateMeal,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MealsStatusResolver);
