import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _, { isNil } from 'lodash';

import 'react-big-calendar/lib/css/react-big-calendar.css';

import Button from '@mui/material/Button';
import { CalendarEvent } from './MealSchedule';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

import '../styles/MealWheel.css';

import { DetailedMealEntity, DishEntity, MainDishEntity, DishType, ScheduledMealEntity } from '../types';
import { getMains, getSalad, getSalads, getSaladById, getScheduledMeal, getSide, getSides, getSideById, getVeggie, getVeggieById, getVeggies } from '../selectors';
import { updateMainInMeal, updateSaladInMeal, updateSideInMeal, updateVeggieInMeal } from '../controllers';

export interface MealPropertySheetPropsFromParent {
  scheduledMealId: string;
  selectedMealInCalendar: CalendarEvent | null;
  handleClose: () => any;
  handleAddPseudoEvent: () => any;
  onUpdateCalendarEvent: (calendarEvent: CalendarEvent) => any;
}

export interface MealPropertySheetProps extends MealPropertySheetPropsFromParent {
  scheduledMeal: ScheduledMealEntity | null,
  veggieValue: DishEntity | null;
  sideValue: DishEntity | null;
  saladValue: DishEntity | null;
  main: DishEntity | null;
  side: DishEntity | null;
  salad: DishEntity | null;
  veggie: DishEntity | null;
  mains: DishEntity[];
  sides: DishEntity[];
  salads: DishEntity[];
  veggies: DishEntity[];
  onUpdateMainInMeal: (mealId: string, newMainId: string) => any;
  onUpdateSideInMeal: (mealId: string, newSideId: string) => any;
  onUpdateSaladInMeal: (mealId: string, newSaladId: string) => any;
  onUpdateVeggieInMeal: (mealId: string, newVeggieId: string) => any;
  state: any;
}


const MealPropertySheet = (props: MealPropertySheetProps) => {

  const [comments, setComments] = React.useState('');

  const getDetailedMeal = (): DetailedMealEntity => {
    return (props.selectedMealInCalendar as CalendarEvent).detailedMeal as unknown as DetailedMealEntity;
  };

  if (isNil(props.selectedMealInCalendar) || isNil(props.selectedMealInCalendar.detailedMeal)) {
    return null;
  }

  const handleUpdateMain = (event: any) => {
    props.onUpdateMainInMeal(getDetailedMeal().id, event.target.value);
    props.handleAddPseudoEvent();
  };

  const handleUpdateSide = (event: any) => {
    props.onUpdateSideInMeal(getDetailedMeal().id, event.target.value);
    props.handleAddPseudoEvent();
  };

  const handleUpdateSalad = (event: any) => {
    props.onUpdateSaladInMeal(getDetailedMeal().id, event.target.value);
    props.handleAddPseudoEvent();
  };

  const handleUpdateVeggie = (event: any) => {
    props.onUpdateVeggieInMeal(getDetailedMeal().id, event.target.value);
    props.handleAddPseudoEvent();
  };

  const handleClear = () => {
    console.log('handleClear');
  };

  const handleRegenerate = () => {
    console.log('handleRegenerate');
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
    const dishMenuItems: JSX.Element[] = dishes.map((mainDish: DishEntity) => {
      return renderDishMenuItem(mainDish);
    });
    if (includeNone) {
      dishMenuItems.unshift(renderNoneMenuItem());
    }
    return dishMenuItems;
    // return dishes.map((mainDish: DishEntity) => {
    //   return renderDishMenuItem(mainDish);
    // });
  };


  const renderMains = () => {
    const mainsMenuItems: JSX.Element[] = renderDishMenuItems(props.mains, false);
    return (
      <div>
        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="mainLabel">Main</InputLabel>
          <Select
            labelId="mainLabel"
            id="demo-simple-select-filled"
            value={(props.main as DishEntity).id}
            onChange={(event) => handleUpdateMain(event)}
          >
            {mainsMenuItems}
          </Select>
        </FormControl>
      </div>
    );
  };

  const renderSides = () => {
    let sideId = 'none';
    if (!isNil(props.sideValue)){
      sideId = props.sideValue.id;
    }
    const sidesMenuItems: JSX.Element[] = renderDishMenuItems(props.sides, true);
    return (
      <div>
        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="sidesLabel">Side</InputLabel>
          <Select
            labelId="sidesLabel"
            value={sideId}
            onChange={(event) => handleUpdateSide(event)}
          >
            {sidesMenuItems}
          </Select>
        </FormControl>
      </div>
    );
  };

  const renderSalads = () => {
    let saladId = 'none';
    if (!isNil(props.saladValue)){
      saladId = props.saladValue.id;
    }
    const menuItems: JSX.Element[] = renderDishMenuItems(props.salads, true);
    return (
      <div>
        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="saladsLabel">Salad</InputLabel>
          <Select
            labelId="saladsLabel"
            value={saladId}
            onChange={(event) => handleUpdateSalad(event)}
          >
            {menuItems}
          </Select>
        </FormControl>
      </div>
    );
  };

  const renderVeggies = (): JSX.Element => {

    let veggieId = 'none';
    if (!isNil(props.veggieValue)){
      veggieId = props.veggieValue.id;
    }
    const menuItems: JSX.Element[] = renderDishMenuItems(props.veggies, true);
    return (
      <div>
        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="veggiesLabel">Veggie</InputLabel>
          <Select
            labelId="veggiesLabel"
            value={veggieId}
            onChange={(event) => handleUpdateVeggie(event)}
          >
            {menuItems}
          </Select>
        </FormControl>
      </div>
    );
  };

  const renderLinkToRecipe = (): JSX.Element => {
    return (
      <div>
        <TextField
          id="filled-helperText"
          label="Link to recipe"
          defaultValue=""
          helperText="Enter the URL, if available to the online recipe."
          variant="filled"
        />
      </div>
    );
  };

  const renderComments = (): JSX.Element => {
    return (
      <div>
        <TextField
          id="filled-multiline-flexible"
          label="Comments"
          multiline
          maxRows={4}
          value={comments}
          onChange={(event) => setComments(event?.target.value)}
          variant="filled"
        />
      </div>
    );
  };

  const renderActionButtons = (): JSX.Element => {
    return (
      <div>
        <Button className='buttonMarginLeft' color='inherit' variant='contained' onClick={handleClear}>Clear</Button>
        <Button className='buttonMarginLeft buttonMarginRight' color='inherit' variant='contained' onClick={handleRegenerate}>Suggest another</Button>
      </div>
    );
  };

  const mainDishElement = renderMains();
  const sideDishElement = renderSides();
  const saladsDishElement = renderSalads();
  const veggiesDishElement = renderVeggies();

  const linkToRecipeElement = renderLinkToRecipe();
  const commentsElement = renderComments();

  const actionButtons = renderActionButtons();

  console.log('MealPropertySheet props: ', props);

  return (
    <div className='mealPropertySheet'>
      <p className='shortParagraph'>{'Main: ' + getDetailedMeal().mainDish.name}</p>
      {mainDishElement}
      {sideDishElement}
      {saladsDishElement}
      {veggiesDishElement}
      {linkToRecipeElement}
      {commentsElement}
      {actionButtons}
      <Button color='inherit' onClick={props.handleClose}>Close</Button>
    </div>
  );
};

function mapStateToProps(state: any, ownProps: MealPropertySheetPropsFromParent) {
  let scheduledMeal: ScheduledMealEntity | null = null;
  let saladValue: DishEntity | null = null;
  let sideValue: DishEntity | null = null;
  let veggieValue: DishEntity | null = null;
  let detailedMeal: DetailedMealEntity | null = null;
  let main: MainDishEntity | null = null;
  let side: DishEntity | null = null;
  let salad: DishEntity | null = null;
  let veggie: DishEntity | null = null;
  if (!isNil(ownProps.selectedMealInCalendar) && !isNil(ownProps.selectedMealInCalendar.detailedMeal)) {
    scheduledMeal = getScheduledMeal(state, ownProps.scheduledMealId);
    if (!isNil(scheduledMeal)) {
      saladValue = getSaladById(state, scheduledMeal.saladId);
      sideValue = getSideById(state, scheduledMeal.sideId);
      veggieValue = getVeggieById(state, scheduledMeal.veggieId);
    }
    detailedMeal = ownProps.selectedMealInCalendar.detailedMeal as DetailedMealEntity;
    main = detailedMeal.mainDish as MainDishEntity;
    salad = detailedMeal.salad;
    veggie = detailedMeal.veggie;
    side = detailedMeal.side;
  }

  if (!isNil(main) && (main as MainDishEntity).name === 'Burgers') {
    console.log('selectedMealInCalendar', ownProps.selectedMealInCalendar);
    console.log('detailedMeal', detailedMeal);
    console.log('side', side);
  }

  return {
    scheduledMeal,
    saladValue,
    sideValue,
    veggieValue,
    main,
    side,
    salad,
    veggie,
    mains: getMains(state),
    sides: getSides(state),
    salads: getSalads(state),
    veggies: getVeggies(state),
    state,
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onUpdateMainInMeal: updateMainInMeal,
    onUpdateSideInMeal: updateSideInMeal,
    onUpdateSaladInMeal: updateSaladInMeal,
    onUpdateVeggieInMeal: updateVeggieInMeal,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MealPropertySheet);
