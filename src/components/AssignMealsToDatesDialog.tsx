import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { cloneDeep, isNil } from 'lodash';

// import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
// import { List, ListItem, ListItemText } from '@mui/material';

import { MealEntity, MealOnDate, ScheduledMealEntity } from '../types';
import { assignMealToDate, deleteScheduledMeal, updateMealAssignedToDate } from '../controllers';
import { getNumberOfMealsToGenerate, getStartDate, getUnassignedMeals, getScheduledMealsForDays, getMealsOnDatesForDays } from '../selectors';

import '../styles/MealWheel.css';

import { DndProvider, DragSourceMonitor, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableMeal from './DraggableMeal';
import DroppableDateInSchedule from './DroppableDateInSchedule';

export interface AssignMealsToDatesDialogPropsFromParent {
  open: boolean;
  onClose: () => void;
}

export interface AssignMealsToDatesDialogProps extends AssignMealsToDatesDialogPropsFromParent {
  meals: MealEntity[];
  startDate: Date;
  numberOfMealsToGenerate: number,
  scheduledMeals: ScheduledMealEntity[];
  mealOnDates: MealOnDate[];
  onAssignMealToDate: (meal: MealEntity, date: Date) => void;
  onUpdateMealAssignedToDate: (meal: MealEntity, date: Date) => void;
  onDeleteScheduledMeal: (id: string) => void;
}

function AssignMealsToDatesDialog(props: AssignMealsToDatesDialogProps) {

  const [mealOnDates, setMealOnDates] = React.useState<MealOnDate[]>([]);
  // const [selectedMeal, setSelectedMeal] = React.useState<MealEntity | null>(null);
  // const [selectedMealOnDate, setSelectedMealOnDate] = React.useState<MealOnDate | null>(null);

  React.useEffect(() => {
    setMealOnDates(props.mealOnDates);
  }, [props.startDate, props.mealOnDates]);

  // const inlineBlockStyle = {
  //   display: 'inline-block'
  // };

  // const selectedStyle = {
  //   backgroundColor: 'rgb(211, 211, 211)'
  // };

  // const unselectedStyle = {
  //   backgroundColor: 'white'
  // };

  const handleClose = () => {
    props.onClose();
  };

  // const getSelectedMeal = (): MealEntity | null => {
  //   for (const meal of props.meals) {
  //     if (!isNil(selectedMeal) && meal.id === selectedMeal.id) {
  //       return meal;
  //     }
  //   }
  //   return null;
  // };

  // const getSelectedMealOnDate = (): MealOnDate | null => {
  //   for (const mealOnDate of mealOnDates) {
  //     if (!isNil(selectedMealOnDate) && getDatesEqual(mealOnDate.date, selectedMealOnDate.date)) {
  //       return mealOnDate;
  //     }
  //   }
  //   return null;
  // };

  // const handleClickMealItem = (meal: MealEntity) => {
  //   setSelectedMeal(meal);
  // };

  // const handleClickMealOnDateItem = (mealOnDate: MealOnDate) => {
  //   setSelectedMealOnDate(mealOnDate);
  // };

  const handleClearAssignedMealOnDate = (mealOnDate: MealOnDate) => {
    console.log('clear assigned meal on: ', mealOnDate.date.toDateString());
    if (!isNil(mealOnDate.meal)) {

      // get scheduledMeal associated with this date
      for (const scheduledMeal of props.scheduledMeals) {
        if (getDatesEqual(scheduledMeal.dateScheduled, mealOnDate.date)) {
          props.onDeleteScheduledMeal(scheduledMeal.id);
        }
      }
    }
  };

  const getDatesEqual = (date1: Date, date2: Date): boolean => {
    return (date2.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate());
  };

  // const getRenderedListOfMealsItems = () => {
  //   const renderedListOfMeals = props.meals.map((meal: MealEntity, index: number) => {
  //     let listItemStyle = unselectedStyle;
  //     if (!isNil(selectedMeal) && meal.id === selectedMeal.id) {
  //       listItemStyle = selectedStyle;
  //     }
  //     return (
  //       <ListItem
  //         key={index}
  //         style={listItemStyle}
  //         onClick={() => handleClickMealItem(meal)}
  //       >
  //         <ListItemText>
  //           {getFormattedMeal('', meal)}
  //         </ListItemText>
  //       </ListItem>
  //     );
  //   });

  //   return renderedListOfMeals;
  // };

  // const getRenderedListOfMeals = () => {
  //   const listOfMealsItems = getRenderedListOfMealsItems();
  //   return (
  //     <List
  //       style={inlineBlockStyle}
  //     >
  //       {listOfMealsItems}
  //     </List>
  //   );
  // };

  // const getRenderedListOfMealOnDateItems = () => {

  //   const renderedListOfMealOnDates = mealOnDates.map((mealOnDate: MealOnDate, mealOnDateIndex: number) => {

  //     let listItemStyle = unselectedStyle;
  //     if (!isNil(selectedMealOnDate) && getDatesEqual(mealOnDate.date, selectedMealOnDate.date)) {
  //       listItemStyle = selectedStyle;
  //     }

  //     return (
  //       <ListItem
  //         key={mealOnDateIndex}
  //         style={listItemStyle}
  //         onClick={() => handleClickMealOnDateItem(mealOnDate)}
  //       >
  //         <ListItemText>
  //           {getFormattedMealOnDate(mealOnDate)}
  //         </ListItemText>
  //         <Button
  //           onClick={() => handleClearAssignedMealOnDate(mealOnDate)}
  //           disabled={isNil(mealOnDate.meal)}
  //         >
  //           Clear Assigned Meal
  //         </Button>
  //       </ListItem>
  //     );
  //   });

  //   return renderedListOfMealOnDates;
  // };

  // const getRenderedListOfMealOnDates = () => {
  //   const listOfMealOnDateItems = getRenderedListOfMealOnDateItems();
  //   return (
  //     <List
  //       style={inlineBlockStyle}
  //     >
  //       {listOfMealOnDateItems}
  //     </List>
  //   );
  // };

  // const listOfMeals = getRenderedListOfMeals();
  // const listOfMealOnDates = getRenderedListOfMealOnDates();

  const assignMealToDate = (meal: MealEntity, mealOnDate: MealOnDate) => {
    if (isNil(mealOnDate.meal)) {
      props.onAssignMealToDate(meal, mealOnDate.date);
    } else {
      props.onUpdateMealAssignedToDate(meal, mealOnDate.date);
    }
};

  const handleDrop = (meal: MealEntity, mealOnDate: MealOnDate) => {
    console.log('drop');
    console.log(meal);
    console.log(mealOnDate);
    assignMealToDate(meal, mealOnDate);
  };

  const getDroppableDatesInSchedule = (): JSX.Element[] => {

    const renderedListOfMealOnDates = mealOnDates.map((mealOnDate: MealOnDate, mealOnDateIndex: number) => {
      return (
        <DroppableDateInSchedule
          key={mealOnDateIndex}
          mealOnDate={mealOnDate}
          accept={['draggableMeal']}
          onDrop={(item) => { handleDrop(item, mealOnDate); }}
          onClearAssignedMealOnDate={(mealOnDate) => { handleClearAssignedMealOnDate(mealOnDate)}}
        />
      );
    });

    return renderedListOfMealOnDates;

    // const droppableDatesInSchedule: JSX.Element[] = [];

    // const startDate: Date = props.startDate;
    // const numberOfMealsToGenerate: number = props.numberOfMealsToGenerate;

    // for (let mealIndex = 0; mealIndex < numberOfMealsToGenerate; mealIndex++) {
    //   const mealDate = new Date(startDate.valueOf() + (24 * 60 * 60 * 1000 * mealIndex));
    //   droppableDatesInSchedule.push(getDroppableDateInSchedule(mealDate));
    // }

    // return droppableDatesInSchedule;
  };

  const getDraggableMeal = (mealEntity: MealEntity): JSX.Element => {
    return (
      <DraggableMeal
        key={mealEntity.id}
        meal={mealEntity}
      />
    );
  };

  const getDraggableMeals = (): JSX.Element[] => {
    const draggableMealsJsx = props.meals.map((mealEntity: MealEntity, index: number) => {
      return getDraggableMeal(mealEntity);
    });
    return draggableMealsJsx;
  };

  const droppableDatesInSchedule = getDroppableDatesInSchedule();
  const draggableMeals = getDraggableMeals();

  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      PaperProps={{ sx: { width: '1200px', height: '750px' } }}
      fullScreen={true}
    >
      <DialogTitle>Assign Meals to Dates</DialogTitle>
      <DialogContent>
        <div>
          <DndProvider backend={HTML5Backend}>
            <div style={{ overflow: 'hidden', clear: 'both' }}>
              {droppableDatesInSchedule}
            </div>

            <div style={{ overflow: 'hidden', clear: 'both' }}>
              {draggableMeals}
              {/* {boxes.map(({ name, type }, index) => (
                <Box
                  name={name}
                  type={type}
                  isDropped={isDropped(name)}
                  key={index}
                /> */}
              {/* ))} */}
            </div>

          </DndProvider>
        </div>
        {/* <div className="container">
          <DndProvider backend={HTML5Backend}>
            <Column title='Column 1' className='column first-column'>
              {isFirstColumn && Item}
            </Column>
            <Column title='Column 2' className='column second-column'>
              {!isFirstColumn && Item}
            </Column>
          </DndProvider>
        </div> */}

        {/* <Box
          sx={{
            height: 500,
            width: '100%',
            '& .actions': {
              color: 'text.secondary',
            },
            '& .textPrimary': {
              color: 'text.primary',
            },
          }}
        >
          {listOfMeals}
          <Button
            style={inlineBlockStyle}
            onClick={handleAssignMealToDate}
          >
            Assign meal to date
          </Button>
          {listOfMealOnDates}
        </Box> */}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

function mapStateToProps(state: any, ownProps: AssignMealsToDatesDialogPropsFromParent) {

  const startDate: Date = getStartDate(state);
  const numberOfMealsToGenerate: number = getNumberOfMealsToGenerate(state);
  return {
    meals: getUnassignedMeals(state),
    startDate,
    numberOfMealsToGenerate,
    scheduledMeals: getScheduledMealsForDays(state, startDate, numberOfMealsToGenerate),
    mealOnDates: getMealsOnDatesForDays(state, startDate, numberOfMealsToGenerate),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onAssignMealToDate: assignMealToDate,
    onUpdateMealAssignedToDate: updateMealAssignedToDate,
    onDeleteScheduledMeal: deleteScheduledMeal,
  }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(AssignMealsToDatesDialog);

