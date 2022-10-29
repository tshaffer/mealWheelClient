import { cloneDeep, isNil } from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  Box,
  Dialog,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { getMains, getSides, getSalads, getVeggies, getPendingMeal } from '../selectors';
import { VerboseScheduledMeal, DishEntity } from '../types';
import { setPendingMeal } from '../models';

export interface MealStatusResolverPropsFromParent {
  previousDayEnabled: boolean;
  nextDayEnabled: boolean;
  onPreviousDay: () => void;
  onNextDay: () => void;
  onClose: () => void;
  onSave: (meal: VerboseScheduledMeal) => void;
  onSkip: (meal: VerboseScheduledMeal) => void;
}

export interface MealStatusResolverProps extends MealStatusResolverPropsFromParent {
  meal: VerboseScheduledMeal | null;
  mains: DishEntity[];
  sides: DishEntity[];
  salads: DishEntity[];
  veggies: DishEntity[];
  onSetPendingMeal: (meal: VerboseScheduledMeal) => any;
}

const MealStatusResolver = (props: MealStatusResolverProps) => {

  const { previousDayEnabled, nextDayEnabled, onPreviousDay, onNextDay, onClose, onSave, onSkip, onSetPendingMeal,
    mains, sides, salads, veggies } = props;
  const meal = props.meal;

  const getDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-us', options);
  };

  const getDayDate = (): string => {
    return (getDate((meal as VerboseScheduledMeal).dateScheduled));
  };

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    onSave(meal as VerboseScheduledMeal);
  };

  const handleSkip = () => {
    onSkip(meal as VerboseScheduledMeal);
  };

  const handleNew = () => {
    // onClose();
  };

  const handleUpdateMain = (event: any) => {
    const mainId = event.target.value;
    let selectedMain: DishEntity | null = null;
    for (const main of mains) {
      if (mainId === main.id) {
        selectedMain = main;
        break;
      }
    }

    const mainName: string = isNil(selectedMain) ? '' : selectedMain.name;

    const updatedMeal: VerboseScheduledMeal = cloneDeep(meal) as VerboseScheduledMeal;
    updatedMeal.main = selectedMain;
    updatedMeal.mainDishId = isNil(selectedMain) ? '' : selectedMain.id;
    updatedMeal.mainName = mainName;
    onSetPendingMeal(updatedMeal);
  };

  const handleUpdateSide = (event: any) => {
    const sideId = event.target.value;
    let selectedSide: DishEntity | null = null;
    for (const side of sides) {
      if (sideId === side.id) {
        selectedSide = side;
        break;
      }
    }

    const sideName: string = isNil(selectedSide) ? '' : selectedSide.name;

    const updatedMeal: VerboseScheduledMeal = cloneDeep(meal) as VerboseScheduledMeal;
    updatedMeal.side = selectedSide;
    updatedMeal.sideId = isNil(selectedSide) ? '' : selectedSide.id;
    updatedMeal.sideName = sideName;
    onSetPendingMeal(updatedMeal);
  };

  const handleUpdateSalad = (event: any) => {
    const saladId = event.target.value;
    let selectedSalad: DishEntity | null = null;
    for (const salad of salads) {
      if (saladId === salad.id) {
        selectedSalad = salad;
        break;
      }
    }
    const updatedMeal: VerboseScheduledMeal = cloneDeep(meal) as VerboseScheduledMeal;
    updatedMeal.salad = selectedSalad;
    updatedMeal.saladId = isNil(selectedSalad) ? '' : selectedSalad.id;
    updatedMeal.saladName = isNil(selectedSalad) ? '' : selectedSalad.name;
    onSetPendingMeal(updatedMeal);
  };

  const handleUpdateVeggie = (event: any) => {
    const veggieId = event.target.value;
    let selectedVeggie: DishEntity | null = null;
    for (const veggie of veggies) {
      if (veggieId === veggie.id) {
        selectedVeggie = veggie;
        break;
      }
    }

    const veggieName: string = isNil(selectedVeggie) ? '' : selectedVeggie.name;

    const updatedMeal: VerboseScheduledMeal = cloneDeep(meal) as VerboseScheduledMeal;
    updatedMeal.veggie = selectedVeggie;
    updatedMeal.veggieId = isNil(selectedVeggie) ? '' : selectedVeggie.id;
    updatedMeal.veggieName = veggieName;
    onSetPendingMeal(updatedMeal);
  };

  const renderNoneMenuItem = (): JSX.Element => {
    return (
      <MenuItem value={'none'} key={'none'}>None</MenuItem>
    );
  };

  const renderDishMenuItem = (dishEntity: DishEntity): JSX.Element => {
    return (
      <MenuItem value={dishEntity.id} key={dishEntity.id}>{dishEntity.name}</MenuItem>
    );
  };

  const renderDishMenuItems = (dishes: DishEntity[], includeNone: boolean) => {
    const dishMenuItems: JSX.Element[] = dishes.map((dish: DishEntity) => {
      return renderDishMenuItem(dish);
    });
    if (includeNone) {
      dishMenuItems.unshift(renderNoneMenuItem());
    }
    return dishMenuItems;
  };

  const renderMealStatus = (): JSX.Element => {
    return (
      <div>
        <div>
          <IconButton
            className='menuButton'
            color='inherit'
            disabled={!previousDayEnabled}
            onClick={onPreviousDay}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
          {getDayDate()}
          <IconButton
            className='menuButton'
            color='inherit'
            disabled={!nextDayEnabled}
            onClick={onNextDay}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </div>
      </div>
    );
  };

  const renderMains = (): JSX.Element => {
    let mainId = 'none';
    if (!isNil(meal) && !isNil(meal.main)) {
      mainId = meal.main.id;
    }
    const mainsMenuItems: JSX.Element[] = renderDishMenuItems(props.mains, false);
    return (
      <div>
        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="mainLabel">Main</InputLabel>
          <Select
            labelId="mainLabel"
            id="demo-simple-select-filled"
            value={mainId}
            onChange={(event) => handleUpdateMain(event)}
          >
            {mainsMenuItems}
          </Select>
        </FormControl>
      </div>
    );
  };

  const renderSides = (): JSX.Element => {
    let sideId = 'none';
    if (!isNil(meal) && !isNil(meal.side)) {
      sideId = meal.side.id;
    }
    const sidesMenuItems: JSX.Element[] = renderDishMenuItems(props.sides, true);
    return (
      <div>
        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="sideLabel">Side</InputLabel>
          <Select
            labelId="sideLabel"
            id="demo-simple-select-filled"
            value={sideId}
            onChange={(event) => handleUpdateSide(event)}
          >
            {sidesMenuItems}
          </Select>
        </FormControl>
      </div>
    );
  };

  const renderSalads = (): JSX.Element => {
    let saladId = 'none';
    if (!isNil(meal) && !isNil(meal.salad)) {
      saladId = meal.salad.id;
    }
    const saladsMenuItems: JSX.Element[] = renderDishMenuItems(salads, true);
    return (
      <div>
        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="saladLabel">Salad</InputLabel>
          <Select
            labelId="saladLabel"
            id="demo-simple-select-filled"
            value={saladId}
            onChange={(event) => handleUpdateSalad(event)}
          >
            {saladsMenuItems}
          </Select>
        </FormControl>
      </div>
    );
  };

  const renderVeggies = (): JSX.Element => {
    let veggieId = 'none';
    if (!isNil(meal) && !isNil(meal.veggie)) {
      veggieId = meal.veggie.id;
    }
    const veggiesMenuItems: JSX.Element[] = renderDishMenuItems(veggies, true);
    return (
      <div>
        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="veggieLabel">Veggie</InputLabel>
          <Select
            labelId="veggieLabel"
            id="demo-simple-select-filled"
            value={veggieId}
            onChange={(event) => handleUpdateVeggie(event)}
          >
            {veggiesMenuItems}
          </Select>
        </FormControl>
      </div>
    );
  };


  console.log('MealStatusResolve: check isNil(meal)');
  if (isNil(meal)) {
    return null;
  }
  console.log('MealStatusResolver: meal is non null');
  
  const mealStatusElement = renderMealStatus();
  const mainDishElement = renderMains();
  const sideDishElement = renderSides();
  const saladDishElement = renderSalads();
  const veggieDishElement = renderVeggies();

  return (
    <Dialog onClose={handleClose} open={true} maxWidth='xl'>
      <DialogTitle>Welcome Back Fatso</DialogTitle>
      <Box
        sx={{
          height: 500,
          width: '800px',
          '& .actions': {
            color: 'text.secondary',
          },
          '& .textPrimary': {
            color: 'text.primary',
          },
        }}
      >
        {mealStatusElement}
        {mainDishElement}
        {sideDishElement}
        {saladDishElement}
        {veggieDishElement}
        <div>
          <button
            type="button"
            onClick={handleClose}
          >
            Exit
          </button>
          <button
            type="button"
            onClick={handleSave}
          >
            Save and Continue
          </button>
          <button
            type="button"
            onClick={handleSkip}
          >
            Skip
          </button>
          <button
            type="button"
            onClick={handleNew}
          >
            Specify New
          </button>

        </div>
      </Box>
    </Dialog>
  );
};

function mapStateToProps(state: any, ownProps: MealStatusResolverPropsFromParent) {

  console.log('MealStatusResolver mapStateToProps invoked');

  return {
    meal: getPendingMeal(state) as VerboseScheduledMeal,
    mains: getMains(state),
    sides: getSides(state),
    salads: getSalads(state),
    veggies: getVeggies(state),
  };
}


const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onSetPendingMeal: setPendingMeal,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MealStatusResolver);
