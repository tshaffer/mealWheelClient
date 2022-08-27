import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isNil } from 'lodash';

import 'react-big-calendar/lib/css/react-big-calendar.css';

import Button from '@mui/material/Button';
import { CalendarEvent } from './MealSchedule';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { DetailedMealEntity, DishEntity } from '../types';
import { getMainDishes } from '../selectors';

export interface MealPropertySheetPropsFromParent {
  selectedMealInCalendar: CalendarEvent | null;
  handleClose: () => any;
}

export interface MealPropertySheetProps extends MealPropertySheetPropsFromParent {
  mainDishes: DishEntity[];
}


const MealPropertySheet = (props: MealPropertySheetProps) => {

  // const [age, setAge] = React.useState('');
  const [selectedMainCourseId, setSelectedMainCourseId] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedMainCourseId(event.target.value);
  };

  if (isNil(props.selectedMealInCalendar) || isNil(props.selectedMealInCalendar.detailedMeal)) {
    return null;
  }
  const detailedMeal: DetailedMealEntity = props.selectedMealInCalendar.detailedMeal as unknown as DetailedMealEntity;

  const renderMainCourseMenuItem = (dishEntity: DishEntity) => {
    return (
      <MenuItem value={dishEntity.id} key={dishEntity.id}>{dishEntity.name}</MenuItem>
    );
  };

  const renderMainCourseMenuItems = () => {
    return props.mainDishes.map( (mainDish: DishEntity) => {
      return renderMainCourseMenuItem(mainDish);
    });
  };

  const mainCourseMenuItems = renderMainCourseMenuItems();

  const renderMainCourse = () => {

    return (
      <div>
        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="mainLabel">Main</InputLabel>
          <Select
            labelId="mainLabel"
            id="demo-simple-select-filled"
            value={selectedMainCourseId}
            onChange={handleChange}
          >
            {mainCourseMenuItems}
          </Select>
        </FormControl>
      </div>
    );
  };

  const mainDishElement = renderMainCourse();

  return (
    <div>
      <p className='shortParagraph'>{'Main: ' + detailedMeal.mainDish.name}</p>
      {mainDishElement}
      <Button color='inherit' onClick={props.handleClose}>Close</Button>
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
    mainDishes: getMainDishes(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MealPropertySheet);
