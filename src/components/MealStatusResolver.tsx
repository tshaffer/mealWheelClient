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

  const handleUpdateMain = (event: any) => {
    console.log('handleUpdateMain: ', event.target.value);
    // props.onUpdateMainInMeal(getScheduledMealId(), event.target.value);
  };

  const handleUpdateSide = (event: any) => {
    console.log('handleUpdateSide: ', event.target.value);
    // props.onUpdateSideInMeal(getScheduledMealId(), event.target.value);
  };

  const handleUpdateSalad = (event: any) => {
    console.log('handleUpdateSalad: ', event.target.value);
    // props.onUpdateSaladInMeal(getScheduledMealId(), event.target.value);
  };

  const handleUpdateVeggie = (event: any) => {
    console.log('handleUpdateVeggie: ', event.target.value);
    // props.onUpdateVeggieInMeal(getScheduledMealId(), event.target.value);
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
    );
  };

  const renderMains = (): JSX.Element => {
    let mainId = 'none';
    if (!isNil(verboseScheduledMeal.main)) {
      mainId = verboseScheduledMeal.main.id;
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
    if (!isNil(verboseScheduledMeal.side)) {
      sideId = verboseScheduledMeal.side.id;
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
    if (!isNil(verboseScheduledMeal.salad)) {
      saladId = verboseScheduledMeal.salad.id;
    }
    const saladsMenuItems: JSX.Element[] = renderDishMenuItems(props.salads, true);
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
    if (!isNil(verboseScheduledMeal.veggie)) {
      veggieId = verboseScheduledMeal.veggie.id;
    }
    const veggiesMenuItems: JSX.Element[] = renderDishMenuItems(props.veggies, true);
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


  const mealStatusElement = renderMealStatus();
  const mainDishElement = renderMains();
  const sideDishElement = renderSides();
  const saladDishElement = renderSalads();
  const veggieDishElement = renderVeggies();

  return (
    <Dialog onClose={handleClose} open={props.scheduledMealsToResolve.length > 0} maxWidth='xl'>
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
      </Box>
    </Dialog>
  );
};

function mapStateToProps(state: any, ownProps: MealStatusResolverPropsFromParent) {

  const scheduledMeal: ScheduledMealEntity = getScheduledMeal(state, ownProps.scheduledMealId) as ScheduledMealEntity;

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

  const verboseScheduledMeal: VerboseScheduledMeal = {
    ...scheduledMeal,
    main,
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
