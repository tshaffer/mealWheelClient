import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

import { DishEntity, MealStatus, ScheduledMealEntity, VerboseScheduledMeal } from '../types';
import { isNil } from 'lodash';
import { getMainById, getMains, getSaladById, getSalads, getSideById, getSides, getVeggieById, getVeggies } from '../selectors';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { InputLabel, MenuItem, Select } from '@mui/material';

export interface ScheduledMealStatusResolverPropsFromParent {
  scheduledMealsToResolve: ScheduledMealEntity[];
  open: boolean;
  onClose: () => void;
}

export interface ScheduledMealStatusResolverProps extends ScheduledMealStatusResolverPropsFromParent {
  verboseScheduledMeals: VerboseScheduledMeal[];
  mains: DishEntity[];
  sides: DishEntity[];
  salads: DishEntity[];
  veggies: DishEntity[];
}

const ScheduledMealStatusResolver = (props: ScheduledMealStatusResolverProps) => {

  const { verboseScheduledMeals, open, onClose } = props;

  const handleClose = () => {
    onClose();
  };

  const handleUpdateMain = (event: any) => {
    // props.onUpdateMainInMeal(getScheduledMealId(), event.target.value);
    console.log('handleUpdateMain: ', event.target.value);
  };

  const handleUpdateSide = (event: any) => {
    // props.onUpdateSideInMeal(getScheduledMealId(), event.target.value);
    console.log('handleUpdateSide: ', event.target.value);
  };

  const handleUpdateSalad = (event: any) => {
    // props.onUpdateSaladInMeal(getScheduledMealId(), event.target.value);
    console.log('handleUpdateSalad: ', event.target.value);
  };

  const handleUpdateVeggie = (event: any) => {
    // props.onUpdateVeggieInMeal(getScheduledMealId(), event.target.value);
    console.log('handleUpdateVeggie: ', event.target.value);
  };

  const getDayOfWeek = (day: number): string => {
    const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return weekday[day];
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
  };

  const renderMains = (mainDish: DishEntity | null) => {
    let mainId = 'none';
    if (!isNil(mainDish)) {
      mainId = mainDish.id;
    }
    const mainsMenuItems: JSX.Element[] = renderDishMenuItems(props.mains, false);
    return (
      <div>
        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="mainLabel">Main</InputLabel>
          <Select
            labelId="mainLabel"
            id="selectMain"
            value={mainId}
            onChange={(event) => handleUpdateMain(event)}
          >
            {mainsMenuItems}
          </Select>
        </FormControl>
      </div>
    );
  };

  const renderSides = (sideDish: DishEntity | null) => {
    let sideId = 'none';
    if (!isNil(sideDish)) {
      sideId = sideDish.id;
    }
    const sidesMenuItems: JSX.Element[] = renderDishMenuItems(props.sides, true);
    return (
      <div>
        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="sideLabel">Side</InputLabel>
          <Select
            labelId="sideLabel"
            id="selectSide"
            value={sideId}
            onChange={(event) => handleUpdateSide(event)}
          >
            {sidesMenuItems}
          </Select>
        </FormControl>
      </div>
    );
  };

  const renderSalads = (salad: DishEntity | null) => {
    let saladId = 'none';
    if (!isNil(salad)) {
      saladId = salad.id;
    }
    const saladsMenuItems: JSX.Element[] = renderDishMenuItems(props.salads, true);
    return (
      <div>
        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="saladLabel">Salad</InputLabel>
          <Select
            labelId="saladLabel"
            id="selectSalad"
            value={saladId}
            onChange={(event) => handleUpdateSalad(event)}
          >
            {saladsMenuItems}
          </Select>
        </FormControl>
      </div>
    );
  };

  const renderVeggies = (veggie: DishEntity | null) => {
    let veggieId = 'none';
    if (!isNil(veggie)) {
      veggieId = veggie.id;
    }
    const veggiesMenuItems: JSX.Element[] = renderDishMenuItems(props.veggies, true);
    return (
      <div>
        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="veggieLabel">Veggie</InputLabel>
          <Select
            labelId="veggieLabel"
            id="selectVeggie"
            value={veggieId}
            onChange={(event) => handleUpdateVeggie(event)}
          >
            {veggiesMenuItems}
          </Select>
        </FormControl>
      </div>
    );
  };

  return (
    <Dialog onClose={handleClose} open={open} maxWidth={false}>
      <DialogTitle>About MealWheel</DialogTitle>
      <List sx={{ pt: 0 }}>
        {verboseScheduledMeals.map((verboseScheduledMeal: VerboseScheduledMeal) => (
          <ListItem key={verboseScheduledMeal.id}>
            <ListItemText>{getDayOfWeek(verboseScheduledMeal.dateScheduled.getDay())}</ListItemText>
            <ListItemText>
              {verboseScheduledMeal.dateScheduled.toLocaleDateString(
                'en-us',
                {
                  month: '2-digit',
                  day: '2-digit',
                }
              )}
            </ListItemText>
            <ListItemText>{verboseScheduledMeal.mainDishName}</ListItemText>
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                <FormControlLabel value="cooked" control={<Radio />} label="Cooked" />
                <FormControlLabel value="tbd" control={<Radio />} label="TBD" />
                <FormControlLabel value="different" control={<Radio />} label="Different" />
              </RadioGroup>
            </FormControl>
            {renderMains(verboseScheduledMeal.mainDish)}
            {renderSides(verboseScheduledMeal.side)}
            {renderSalads(verboseScheduledMeal.salad)}
            {renderVeggies(verboseScheduledMeal.veggie)}
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
};

function mapStateToProps(state: any, ownProps: ScheduledMealStatusResolverPropsFromParent) {

  const verboseScheduledMeals: VerboseScheduledMeal[] = [];
  for (const scheduledMeal of ownProps.scheduledMealsToResolve) {

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
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ScheduledMealStatusResolver);
