import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isNil } from 'lodash';

import 'react-big-calendar/lib/css/react-big-calendar.css';

import Button from '@mui/material/Button';
import { CalendarEvent } from './MealSchedule';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';

import '../styles/MealWheel.css';

import { DetailedMealEntity, DishEntity, ScheduledMealEntity, RequiredAccompanimentFlags, MainDishEntity, DishType } from '../types';
import { getMains, getSalad, getSalads, getSide, getSides, getVeggie, getVeggies } from '../selectors';
import { updateMainInMeal } from '../controllers';

export interface MealPropertySheetPropsFromParent {
  selectedMealInCalendar: CalendarEvent | null;
  handleClose: () => any;
}

export interface MealPropertySheetProps extends MealPropertySheetPropsFromParent {
  main: DishEntity | null;
  side: DishEntity | null;
  salad: DishEntity | null;
  veggie: DishEntity | null;
  accompanimentDishes: DishEntity[];
  mains: DishEntity[];
  sides: DishEntity[];
  salads: DishEntity[];
  veggies: DishEntity[];
  onUpdateMainInMeal: (mealId: string, newMainId: string) => any;
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
  };

  const handleCompleted = () => {
    console.log('handleCompleted');
  };

  const handleClear = () => {
    console.log('handleClear');
  };

  const handleRegenerate = () => {
    console.log('handleRegenerate');
  };

  const renderDishMenuItem = (dishEntity: DishEntity) => {
    return (
      <MenuItem value={dishEntity.id} key={dishEntity.id}>{dishEntity.name}</MenuItem>
    );
  };

  const renderDishMenuItems = (dishes: DishEntity[]) => {
    return dishes.map((mainDish: DishEntity) => {
      return renderDishMenuItem(mainDish);
    });
  };


  const renderMains = () => {
    const mainsMenuItems: JSX.Element[] = renderDishMenuItems(props.mains);
    return (
      <div>
        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="mainLabel">Main</InputLabel>
          <Select
            labelId="mainLabel"
            id="demo-simple-select-filled"
            value={(props.main as DishEntity).id}
            // onChange={(event) => setSelectedMain(event?.target.value)}
            onChange={(event) => handleUpdateMain(event)}
          >
            {mainsMenuItems}
          </Select>
        </FormControl>
      </div>
    );
  };

  const renderSides = () => {
    const sidesMenuItems: JSX.Element[] = renderDishMenuItems(props.sides);
    return (
      <div>
        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="sidesLabel">Side</InputLabel>
          <Select
            labelId="sidesLabel"
            value={isNil(props.side) ? '' : props.side.id}
            // onChange={(event) => setSelectedSide(event?.target.value)}
          >
            {sidesMenuItems}
          </Select>
        </FormControl>
      </div>
    );
  };

  const renderSalads = () => {
    const menuItems: JSX.Element[] = renderDishMenuItems(props.salads);
    return (
      <div>
        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="saladsLabel">Salad</InputLabel>
          <Select
            labelId="saladsLabel"
            value={isNil(props.salad) ? '' : props.salad.id}
            // onChange={(event) => setSelectedSalad(event?.target.value)}
          >
            {menuItems}
          </Select>
        </FormControl>
      </div>
    );
  };

  const renderVeggies = (): JSX.Element => {
    const veggieValue = isNil(props.veggie) ? '' : props.veggie.id;
    console.log('veggieValue');
    console.log(veggieValue);
    const menuItems: JSX.Element[] = renderDishMenuItems(props.veggies);
    return (
      <div>
        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="veggiesLabel">Veggie</InputLabel>
          <Select
            labelId="veggiesLabel"
            value={isNil(props.veggie) ? '' : props.veggie.id}
            // onChange={(event) => setSelectedVeggie(event?.target.value)}
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
        <Button className='buttonMarginLeft' color='inherit' variant='contained' onClick={handleCompleted}>Completed</Button>
        <Button className='buttonMarginLeft' color='inherit' variant='contained' onClick={handleClear}>Clear</Button>
        <Button className='buttonMarginLeft buttonMarginRight' color='inherit' variant='contained' onClick={handleRegenerate}>Regenerate</Button>
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
  let detailedMeal: DetailedMealEntity | null = null;
  let main: MainDishEntity | null = null;
  let side: DishEntity | null = null;
  let salad: DishEntity | null = null;
  let veggie: DishEntity | null = null;
  let accompanimentDishes: DishEntity[] = [];
  if (!isNil(ownProps.selectedMealInCalendar) && !isNil(ownProps.selectedMealInCalendar.detailedMeal)) {
    detailedMeal = ownProps.selectedMealInCalendar.detailedMeal as DetailedMealEntity;
    main = detailedMeal.mainDish as MainDishEntity;
    accompanimentDishes = detailedMeal.accompanimentDishes;
    side = getSide(accompanimentDishes);
    salad = getSalad(accompanimentDishes);
    veggie = getVeggie(accompanimentDishes);
  }

  return {
    main,
    side,
    salad,
    veggie,
    accompanimentDishes,
    mains: getMains(state),
    sides: getSides(state),
    salads: getSalads(state),
    veggies: getVeggies(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onUpdateMainInMeal: updateMainInMeal,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MealPropertySheet);
