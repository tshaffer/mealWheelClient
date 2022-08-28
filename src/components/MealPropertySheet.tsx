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

import { DetailedMealEntity, DishEntity } from '../types';
import { getMains, getSalads, getSides, getVeggies } from '../selectors';

export interface MealPropertySheetPropsFromParent {
  selectedMealInCalendar: CalendarEvent | null;
  handleClose: () => any;
}

export interface MealPropertySheetProps extends MealPropertySheetPropsFromParent {
  mains: DishEntity[];
  sides: DishEntity[];
  salads: DishEntity[];
  veggies: DishEntity[];
}


const MealPropertySheet = (props: MealPropertySheetProps) => {

  const [selectedMain, setSelectedMain] = React.useState('');
  const [selectedSide, setSelectedSide] = React.useState('');
  const [selectedSalad, setSelectedSalad] = React.useState('');
  const [selectedVeggie, setSelectedVeggie] = React.useState('');

  const [checked, setChecked] = React.useState(true);

  const [comments, setComments] = React.useState('');

  if (isNil(props.selectedMealInCalendar) || isNil(props.selectedMealInCalendar.detailedMeal)) {
    return null;
  }
  const detailedMeal: DetailedMealEntity = props.selectedMealInCalendar.detailedMeal as unknown as DetailedMealEntity;

  const handleCheckedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
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
            value={selectedMain}
            onChange={(event) => setSelectedMain(event?.target.value)}
          >
            {mainsMenuItems}
          </Select>
        </FormControl>
      </div>
    );
  };

  const renderAccompanimentRequired = () => {
    return (
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={checked}
              onChange={handleCheckedChange}
            />
          }
          label="Label" />
        <FormControlLabel disabled control={<Checkbox />} label="Disabled" />
      </FormGroup>
    );
  };

  const renderSides = () => {
    const sidesMenuItems: JSX.Element[] = renderDishMenuItems(props.sides);
    return (
      <div>
        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="sidesLabel">Sides</InputLabel>
          <Select
            labelId="sidesLabel"
            value={selectedSide}
            onChange={(event) => setSelectedSide(event?.target.value)}
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
          <InputLabel id="saladsLabel">Salads</InputLabel>
          <Select
            labelId="saladsLabel"
            value={selectedSalad}
            onChange={(event) => setSelectedSalad(event?.target.value)}
          >
            {menuItems}
          </Select>
        </FormControl>
      </div>
    );
  };

  const renderVeggies = (): JSX.Element => {
    const menuItems: JSX.Element[] = renderDishMenuItems(props.veggies);
    return (
      <div>
        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="veggiesLabel">Veggies</InputLabel>
          <Select
            labelId="veggiesLabel"
            value={selectedVeggie}
            onChange={(event) => setSelectedVeggie(event?.target.value)}
          >
            {menuItems}
          </Select>
        </FormControl>
      </div>
    );
  };

  /* mui example
        <TextField
          id="filled-helperText"
          label="Helper text"
          defaultValue="Default Value"
          helperText="Some important text"
          variant="filled"
        />
  */
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
  const accompanimentRequired = renderAccompanimentRequired();
  const sideDishElement = renderSides();
  const saladsDishElement = renderSalads();
  const veggiesDishElement = renderVeggies();

  const linkToRecipeElement = renderLinkToRecipe();
  const commentsElement = renderComments();

  const actionButtons = renderActionButtons();

  return (
    <div className='mealPropertySheet'>
      <p className='shortParagraph'>{'Main: ' + detailedMeal.mainDish.name}</p>
      {mainDishElement}
      {accompanimentRequired}
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

function mapStateToProps(state: any) {
  return {
    mains: getMains(state),
    sides: getSides(state),
    salads: getSalads(state),
    veggies: getVeggies(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MealPropertySheet);
