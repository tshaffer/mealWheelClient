import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import 'react-big-calendar/lib/css/react-big-calendar.css';

import { DetailedMealEntity } from '../types';
import { isNil } from 'lodash';
import Button from '@mui/material/Button';
import { CalendarEvent } from './MealSchedule';

export interface MealPropertySheetProps {
  selectedMealInCalendar: CalendarEvent | null;
  handleClose: () => any;
}
const MealPropertySheet = (props: MealPropertySheetProps) => {

  if (isNil(props.selectedMealInCalendar) || isNil(props.selectedMealInCalendar.detailedMeal)) {
    return null;
  }
  const detailedMeal: DetailedMealEntity = props.selectedMealInCalendar.detailedMeal as unknown as DetailedMealEntity;

  return (
    <div>
      <p className='shortParagraph'>{'Main: ' + detailedMeal.mainDish.name}</p>
      <Button color='inherit' onClick={props.handleClose}>Close</Button>
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MealPropertySheet);

