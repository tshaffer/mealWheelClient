import { Dialog, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { isNil } from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getScheduledMealsToResolve, getMainById, getVeggieById, getSideById, getSaladById, getMains, getSides, getSalads, getVeggies, getScheduledMeal } from '../selectors';
import { VerboseScheduledMeal, DishEntity, ScheduledMealEntity, MealStatus } from '../types';

export interface MealStatusResolverPropsFromParent {
  scheduledMealId: string;
  onClose: () => void;
}

export interface MealStatusResolverProps extends MealStatusResolverPropsFromParent {
  verboseScheduledMeal: VerboseScheduledMeal;
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

const MealStatusResolver = (props: MealStatusResolverProps) => {

  const { verboseScheduledMeal, onClose } = props;

  const [value, setValue] = React.useState(MealStatus.pending);

  const getDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-us', options);
  };

  const getDayDate = (): string => {
    return (getDate(verboseScheduledMeal.dateScheduled));
  };

  const handleClose = () => {
    onClose();
  };

  const handleMealStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value as unknown as MealStatus);
  };

  return (
    <Dialog onClose={handleClose} open={props.scheduledMealsToResolve.length > 0} maxWidth='xl'>
      <div>
        <p>{getDayDate()}</p>
        <FormControl>
          <FormLabel id="meal-status-label">MealStatus</FormLabel>
          <RadioGroup
            row
            aria-labelledby="meal-status-label"
            name="row-radio-buttons-group"
            value={value}
            onChange={handleMealStatusChange}
          >
            <FormControlLabel value={MealStatus.prepared} control={<Radio />} label="Cooked" />
            <FormControlLabel value={MealStatus.pending} control={<Radio />} label="??" />
            <FormControlLabel value={MealStatus.different} control={<Radio />} label="Different" />
          </RadioGroup>
        </FormControl>
      </div>
    </Dialog>
  );
};

function mapStateToProps(state: any, ownProps: MealStatusResolverPropsFromParent) {

  const scheduledMeal: ScheduledMealEntity = getScheduledMeal(state, ownProps.scheduledMealId) as ScheduledMealEntity;

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

  const verboseScheduledMeal = {
    ...scheduledMeal,
    mainDish,
    mainDishName,
    salad,
    saladName,
    veggie,
    veggieName,
    side,
    sideName,
  };

  return {
    verboseScheduledMeal,
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

export default connect(mapStateToProps, mapDispatchToProps)(MealStatusResolver);
