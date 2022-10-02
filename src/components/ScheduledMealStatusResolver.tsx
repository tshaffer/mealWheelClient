import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

import { DishEntity, MealStatus, ScheduledMealEntity, VerboseScheduledMeal } from '../types';
import { isNil } from 'lodash';
import { getMainById, getMains, getSaladById, getSideById, getVeggieById } from '../selectors';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { InputLabel, MenuItem, Select } from '@mui/material';

export interface ScheduledMealStatusResolverPropsFromParent {
  scheduledMeals: ScheduledMealEntity[];
  open: boolean;
  onClose: () => void;
}

export interface ScheduledMealStatusResolverProps extends ScheduledMealStatusResolverPropsFromParent {
  verboseScheduledMeals: VerboseScheduledMeal[];
  mains: DishEntity[];
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
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
};

function mapStateToProps(state: any, ownProps: ScheduledMealStatusResolverPropsFromParent) {

  const verboseScheduledMeals: VerboseScheduledMeal[] = [];
  const currentDate: Date = new Date();
  for (const scheduledMeal of ownProps.scheduledMeals) {
    const mealDateAsStr = scheduledMeal.dateScheduled;
    const mealDate: Date = new Date(mealDateAsStr);
    if ((mealDate.getTime() < currentDate.getTime()) && (mealDate.getDate() !== currentDate.getDate())) {
      if (scheduledMeal.status === MealStatus.pending) {
        const mainDish: DishEntity | null = isNil(scheduledMeal.mainDishId) ? null : getMainById(state, scheduledMeal.mainDishId);
        const mainDishName: string = isNil(scheduledMeal.mainDishId) ? '' :
          isNil(getMainById(state, scheduledMeal.mainDishId)) ? '' : (getMainById(state, scheduledMeal.mainDishId) as DishEntity).name;
        const veggie: string = isNil(scheduledMeal.veggieId) ? '' :
          isNil(getVeggieById(state, scheduledMeal.veggieId)) ? '' : (getVeggieById(state, scheduledMeal.veggieId) as DishEntity).name;
        const side: string = isNil(scheduledMeal.sideId) ? '' :
          isNil(getSideById(state, scheduledMeal.sideId)) ? '' : (getSideById(state, scheduledMeal.sideId) as DishEntity).name;
        const salad: string = isNil(scheduledMeal.saladId) ? '' :
          isNil(getSaladById(state, scheduledMeal.saladId)) ? '' : (getSaladById(state, scheduledMeal.saladId) as DishEntity).name;
        verboseScheduledMeals.push({
          ...scheduledMeal,
          mainDish,
          mainDishName,
          salad,
          veggie,
          side,
        });
      }
    }
  }

  return {
    verboseScheduledMeals,
    mains: getMains(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ScheduledMealStatusResolver);

/*
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';

export default function CheckboxListSecondary() {
  const [checked, setChecked] = React.useState([1]);

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {[0, 1, 2, 3].map((value) => {
        const labelId = `checkbox-list-secondary-label-${value}`;
        return (
          <ListItem
            key={value}
            secondaryAction={
              <Checkbox
                edge='end'
                onChange={handleToggle(value)}
                checked={checked.indexOf(value) !== -1}
                inputProps={{ 'aria-labelledby': labelId }}
              />
            }
            disablePadding
          >
            <ListItemButton>
              <ListItemAvatar>
                <Avatar
                  alt={`Avatar n°${value + 1}`}
                  src={`/static/images/avatar/${value + 1}.jpg`}
                />
              </ListItemAvatar>
              <ListItemText id={labelId} primary={`Line item ${value + 1}`} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}
*/
