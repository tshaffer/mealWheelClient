import { isNil } from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateMeal } from '../controllers';
import { getScheduledMealsToResolve, getMainById, getVeggieById, getSideById, getSaladById, getPendingMeal, getMealsToResolve, getMealIndex } from '../selectors';
import { VerboseScheduledMeal, DishEntity, ScheduledMealEntity } from '../types';
import { setMealIndex, setMealIndexAndPendingMeal, setPendingMeal } from '../models';

import MealStatusResolver from './MealStatusResolver';

export interface MealsStatusResolverPropsFromParent {
  onClose: () => void;
}

export interface MealsStatusResolverProps extends MealsStatusResolverPropsFromParent {
  mealIndex: number;
  mealsToResolve: VerboseScheduledMeal[];
  pendingMeal: VerboseScheduledMeal | null;
  scheduledMealsToResolve: ScheduledMealEntity[];
  onUpdateMeal: (mealId: string, scheduledMeal: ScheduledMealEntity) => any;
  onSetPendingMeal: (meal: VerboseScheduledMeal) => any;
  onSetMealIndex: (index: number) => any;
  onSetMealIndexAndPendingMeal: (index: number, meal: VerboseScheduledMeal) => any;
}

const MealsStatusResolver = (props: MealsStatusResolverProps) => {

  const { mealIndex, mealsToResolve, pendingMeal, onClose, onSetPendingMeal, onSetMealIndex, onSetMealIndexAndPendingMeal } = props;

  // React.useEffect(() => {
  //   if (mealsToResolve.length > 0) {
  //     onSetPendingMeal(mealsToResolve[mealIndex]);
  //   }
  // }, [mealIndex, mealsToResolve.length]);

  const handlePreviousDay = () => {
    if (mealIndex > 0) {
      const newMealIndex = mealIndex - 1;
      onSetMealIndexAndPendingMeal(newMealIndex, mealsToResolve[newMealIndex]);
    }
  };

  const handleNextDay = () => {
    if (mealIndex < (mealsToResolve.length - 1)) {
      console.log('handleNextDay');
      console.log(pendingMeal);
      console.log(mealIndex);
      console.log(mealsToResolve);
      console.log(mealsToResolve[mealIndex]);
      const newMealIndex = mealIndex + 1;
      onSetMealIndexAndPendingMeal(newMealIndex, mealsToResolve[newMealIndex]);
      // onSetMealIndex(currentMealIndex + 1);
      // onSetPendingMeal(mealsToResolve[props.mealIndex]);
      console.log(pendingMeal);
      console.log(mealIndex);
      console.log(mealsToResolve);
      console.log(mealsToResolve[mealIndex]);
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

  console.log('MealsStatusResolver - check array lengths');

  if (mealsToResolve.length === 0) {
    return null;
  }

  console.log('MealsStatusResolver - mealsToResolve.length > 0');

  if (isNil(props.pendingMeal)) {
    return null;
  }

  console.log('MealsStatusResolver - pendingMeal non null');

  return (
    <div>
      <MealStatusResolver
        scheduledMealId={mealsToResolve[mealIndex].id}
        previousDayEnabled={mealIndex > 0}
        onPreviousDay={handlePreviousDay}
        nextDayEnabled={mealIndex < (mealsToResolve.length - 1)}
        onNextDay={handleNextDay}
        onClose={handleCloseMealStatusResolver}
        onSave={handleSaveMealStatusResolver}
      />
    </div>
  );
};

function mapStateToProps(state: any) {
  console.log('MealsStatusResolver mapStateToProps invoked');
  return {
    mealIndex: getMealIndex(state),
    mealsToResolve: getMealsToResolve(state),
    pendingMeal: getPendingMeal(state),
    scheduledMealsToResolve: getScheduledMealsToResolve(state),
  };
}


const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onSetMealIndex: setMealIndex,
    onSetPendingMeal: setPendingMeal,
    onSetMealIndexAndPendingMeal: setMealIndexAndPendingMeal,
    onUpdateMeal: updateMeal,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MealsStatusResolver);
