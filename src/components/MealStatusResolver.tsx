import { cloneDeep, isNil } from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  Box,
  Dialog,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { getMains, getSides, getSalads, getVeggies, getPendingMeal } from '../selectors';
import { VerboseScheduledMeal, DishEntity, ScheduledMealEntity, MealStatus } from '../types';

export interface MealStatusResolverPropsFromParent {
  scheduledMealId: string;
  previousDayEnabled: boolean;
  nextDayEnabled: boolean;
  onPreviousDay: () => void;
  onNextDay: () => void;
  onClose: () => void;
  onSave: (scheduledMeal: ScheduledMealEntity) => void;
}

export interface MealStatusResolverProps extends MealStatusResolverPropsFromParent {
  meal: VerboseScheduledMeal | null;
  mains: DishEntity[];
  sides: DishEntity[];
  salads: DishEntity[];
  veggies: DishEntity[];
}

const MealStatusResolver = (props: MealStatusResolverProps) => {

  const { previousDayEnabled, nextDayEnabled, onPreviousDay, onNextDay, onClose, onSave,
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
    const scheduledMeal: ScheduledMealEntity = {
      id: (meal as VerboseScheduledMeal).id,
      userId: (meal as VerboseScheduledMeal).userId,
      mainDishId: (meal as VerboseScheduledMeal).mainDishId,
      saladId: (meal as VerboseScheduledMeal).saladId,
      veggieId: (meal as VerboseScheduledMeal).veggieId,
      sideId: (meal as VerboseScheduledMeal).sideId,
      dateScheduled: (meal as VerboseScheduledMeal).dateScheduled,
      status: MealStatus.prepared,
    };
    onSave(scheduledMeal);
  };

  const handleMealStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedMeal: VerboseScheduledMeal = cloneDeep(meal) as VerboseScheduledMeal;
    updatedMeal.status = parseInt((event.target as HTMLInputElement).value, 10);
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
        <FormControl>
          <FormLabel id="meal-status-label">MealStatus</FormLabel>
          <RadioGroup
            row
            aria-labelledby="meal-status-label"
            name="row-radio-buttons-group"
            value={(meal as VerboseScheduledMeal).status}
            onChange={handleMealStatusChange}
          >
            <FormControlLabel value={MealStatus.prepared} control={<Radio />} label="Cooked" />
            <FormControlLabel value={MealStatus.pending} control={<Radio />} label="??" />
            <FormControlLabel value={MealStatus.different} control={<Radio />} label="Different" />
          </RadioGroup>
        </FormControl>

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
            disabled={(meal as VerboseScheduledMeal).status !== MealStatus.different}
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
            disabled={(meal as VerboseScheduledMeal).status !== MealStatus.different}
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
            disabled={(meal as VerboseScheduledMeal).status !== MealStatus.different}
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
            disabled={(meal as VerboseScheduledMeal).status !== MealStatus.different}
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
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
          >
            Save
          </button>

        </div>
      </Box>
    </Dialog>
  );
};

function mapStateToProps(state: any, ownProps: MealStatusResolverPropsFromParent) {

  console.log('MealStatusResolver mapStateToProps invoked');

  return {
    mains: getMains(state),
    sides: getSides(state),
    salads: getSalads(state),
    veggies: getVeggies(state),
    meal: getPendingMeal(state) as VerboseScheduledMeal,
  };
}


const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MealStatusResolver);
