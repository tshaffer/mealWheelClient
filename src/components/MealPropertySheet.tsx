import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isNil } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import 'react-big-calendar/lib/css/react-big-calendar.css';

import Button from '@mui/material/Button';
import { CalendarEvent } from './MealSchedule';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

import '../styles/MealWheel.css';

import {
  DishEntity,
  ScheduledMealEntity
} from '../types';
import {
  getMains,
  getScheduledMeal,
  getMainById,
  getAccompanimentById,
  getAccompaniments
} from '../selectors';
import {
  addDish,
  deleteScheduledMeal,
  generateMeal,
  updateMainInMeal,
  // updateAccompanimentInMeal,
} from '../controllers';

import NewDishDialog from './NewDishDialog';
import { MealWheelDispatch } from '../models';

export interface MealPropertySheetPropsFromParent {
  scheduledMealId: string;
  selectedMealInCalendar: CalendarEvent | null;
  handleClose: () => any;
  onUpdateCalendarEvent: (calendarEvent: CalendarEvent) => any;
}

export interface MealPropertySheetProps extends MealPropertySheetPropsFromParent {
  scheduledMeal: ScheduledMealEntity | null,
  mainValue: DishEntity | null;
  accompanimentValues: DishEntity[],
  // veggieValue: DishEntity | null;
  // sideValue: DishEntity | null;
  // saladValue: DishEntity | null;
  mains: DishEntity[];
  accompaniments: DishEntity[];
  // sides: DishEntity[];
  // salads: DishEntity[];
  // veggies: DishEntity[];
  onUpdateMainInMeal: (mealId: string, newMainId: string) => any;
  onUpdateAccompanimentInMeal: (mealId: string, accompanimentId: string) => any;
  onGenerateMeal: (mealId: string, date: Date) => any;
  onDeleteMeal: (mealId: string) => any;
  onAddDish: (dish: DishEntity) => any;
  state: any;
}


const MealPropertySheet = (props: MealPropertySheetProps) => {

  const [comments, setComments] = React.useState('');

  const [showNewDishDialog, setShowNewDishDialog] = React.useState(false);
  // const [dishType, setDishType] = React.useState(DishType.Main);

  const getScheduledMealId = (): string => {
    if (!isNil(props.scheduledMeal)) {
      return props.scheduledMeal.id;
    } else {
      return '';
    }
  };

  if (getScheduledMealId() === '') {
    return null;
  }

  if (isNil(props.selectedMealInCalendar) || isNil(props.selectedMealInCalendar.scheduledMealId) || props.selectedMealInCalendar.scheduledMealId === '') {
    return null;
  }

  const handleUpdateMain = (event: any) => {
    if (event.target.value === 'new') {
      // setDishType(DishType.Main);
      setShowNewDishDialog(true);
    } else {
      props.onUpdateMainInMeal(getScheduledMealId(), event.target.value);
    }
  };

  const handleUpdateAccompaniment = (accompanimentId: string, event: any) => {
    console.log('handleUpdateAccompaniment');
    console.log(accompanimentId);
    console.log(event);
    // if (event.target.value === 'new') {
    //   // setDishType(DishType.Main);
    //   setShowNewDishDialog(true);
    // } else {
    //   props.onUpdateMainInMeal(getScheduledMealId(), event.target.value);
    // }
  };

  const handleDelete = () => {
    console.log('handleDelete');
    props.onDeleteMeal(getScheduledMealId());
    props.handleClose();
  };

  const handleRegenerate = () => {
    console.log('handleRegenerate');
    if (!isNil(props.scheduledMeal)) {
      props.onGenerateMeal(props.scheduledMeal.id, new Date(props.scheduledMeal.dateScheduled));
    }
  };

  // const handleAddDish = (dishName: string, dishTypeFromDialog: string, minimumInterval: number, requiredAccompanimentFlags?: RequiredAccompanimentFlags) => {
  const handleAddDish = (dishName: string, dishTypeFromDialog: string, minimumInterval: number) => {
    console.log('handleAddDish: ', dishTypeFromDialog);
    console.log(dishName);
    // console.log(requiredAccompanimentFlags);
    // TODO - I don't think the 'addedDish' is necessary.
    const dishId: string = 'addedDish' + uuidv4();
    const dishEntity: DishEntity = {
      id: dishId,
      name: dishName,
      type: dishTypeFromDialog,
      minimumInterval,
      // accompanimentRequired: requiredAccompanimentFlags,
      last: null,
      prepEffort: 5,
      prepTime: 15,
      cleanupEffort: 5,
    };
    const addDishPromise = props.onAddDish(dishEntity);
    addDishPromise
      .then((updatedDishId: string) => {
        const scheduledMealId = getScheduledMealId();
        switch (dishTypeFromDialog) {
          case 'main':
            props.onUpdateMainInMeal(scheduledMealId, updatedDishId);
            break;
          // case DishType.Salad:
          //   props.onUpdateSaladInMeal(scheduledMealId, updatedDishId);
          //   break;
          // case DishType.Side:
          //   props.onUpdateSideInMeal(scheduledMealId, updatedDishId);
          //   break;
          // case DishType.Veggie:
          //   props.onUpdateVeggieInMeal(scheduledMealId, updatedDishId);
          //   break;
        }
        setShowNewDishDialog(false);
      });
  };

  const handleCloseNewDishDialog = () => {
    setShowNewDishDialog(false);
  };

  const renderNewMenuItem = (): JSX.Element => {
    // return (
    //   <Button color='inherit' onClick={handleNew}>New</Button>
    // );
    return (
      <MenuItem value={'new'} key={'new'}>New</MenuItem>
    );
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
    dishMenuItems.unshift(renderNewMenuItem());
    return dishMenuItems;
  };

  const renderMains = () => {
    let mainId = 'none';
    if (!isNil(props.mainValue)) {
      mainId = props.mainValue.id;
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

  // const renderAccompaniments = (accompaniment: DishEntity): JSX.Element | null | any => {
  //   const accompanimentId = accompaniment.id;
  //   const accompanimentsMenuItems: JSX.Element[] = renderDishMenuItems(props.accompaniments, false);
  //   return (
  //     <div>
  //       <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
  //         <InputLabel id="mainLabel">Main</InputLabel>
  //         <Select
  //           labelId="mainLabel"
  //           id="demo-simple-select-filled"
  //           value={accompanimentId}
  //           onChange={(event) => handleUpdateAccompaniment(accompanimentId, event)}
  //         >
  //           {accompanimentsMenuItems}
  //         </Select>
  //       </FormControl>
  //     </div>
  //   );
  // };

  // const renderEachAccompaniment = () => {
  //   const accompanimentsJsx: JSX.Element[] = [];
  //   props.accompanimentValues.forEach((accompaniment: DishEntity) => {
  //     const dishJsx: JSX.Element | null = renderAccompaniment(accompaniment);
  //     if (!isNil(dishJsx)) {
  //       accompanimentsJsx.push(dishJsx);
  //     }
  //   });
  // };

  // const renderSides = () => {
  //   let sideId = 'none';
  //   if (!isNil(props.sideValue)) {
  //     sideId = props.sideValue.id;
  //   }
  //   const sidesMenuItems: JSX.Element[] = renderDishMenuItems(props.sides, true);
  //   return (
  //     <div>
  //       <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
  //         <InputLabel id="sidesLabel">Side</InputLabel>
  //         <Select
  //           labelId="sidesLabel"
  //           value={sideId}
  //           onChange={(event) => handleUpdateSide(event)}
  //         >
  //           {sidesMenuItems}
  //         </Select>
  //       </FormControl>
  //     </div>
  //   );
  // };

  // const renderSalads = () => {
  //   let saladId = 'none';
  //   if (!isNil(props.saladValue)) {
  //     saladId = props.saladValue.id;
  //   }
  //   const menuItems: JSX.Element[] = renderDishMenuItems(props.salads, true);
  //   return (
  //     <div>
  //       <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
  //         <InputLabel id="saladsLabel">Salad</InputLabel>
  //         <Select
  //           labelId="saladsLabel"
  //           value={saladId}
  //           onChange={(event) => handleUpdateSalad(event)}
  //         >
  //           {menuItems}
  //         </Select>
  //       </FormControl>
  //     </div>
  //   );
  // };

  // const renderVeggies = (): JSX.Element => {

  //   let veggieId = 'none';
  //   if (!isNil(props.veggieValue)) {
  //     veggieId = props.veggieValue.id;
  //   }
  //   const menuItems: JSX.Element[] = renderDishMenuItems(props.veggies, true);
  //   return (
  //     <div>
  //       <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
  //         <InputLabel id="veggiesLabel">Veggie</InputLabel>
  //         <Select
  //           labelId="veggiesLabel"
  //           value={veggieId}
  //           onChange={(event) => handleUpdateVeggie(event)}
  //         >
  //           {menuItems}
  //         </Select>
  //       </FormControl>
  //     </div>
  //   );
  // };

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
        <Button className='buttonMarginLeft' color='inherit' variant='contained' onClick={handleDelete}>Delete</Button>
        <Button className='buttonMarginLeft buttonMarginRight' color='inherit' variant='contained' onClick={handleRegenerate}>Suggest another</Button>
      </div>
    );
  };

  const mainDishElement = renderMains();
  // const sideDishElement = renderSides();
  // const saladsDishElement = renderSalads();
  // const veggiesDishElement = renderVeggies();

  const linkToRecipeElement = renderLinkToRecipe();
  const commentsElement = renderComments();

  const actionButtons = renderActionButtons();

  console.log('MealPropertySheet props: ', props);

  return (
    <div>
      <div>
        <NewDishDialog
          open={showNewDishDialog}
          onAddDish={handleAddDish}
          onClose={handleCloseNewDishDialog}
          dishType='pizza'
        />
      </div>
      <div className='mealPropertySheet'>
        <p className='shortParagraph'>{'Main: ' + (props.mainValue as DishEntity).name}</p>
        {mainDishElement}
        {/* {sideDishElement}
        {saladsDishElement}
        {veggiesDishElement} */}
        {linkToRecipeElement}
        {commentsElement}
        {actionButtons}
        <Button color='inherit' onClick={props.handleClose}>Close</Button>
      </div>

    </div>
  );
};

function mapStateToProps(state: any, ownProps: MealPropertySheetPropsFromParent) {
  let scheduledMeal: ScheduledMealEntity | null = null;
  let mainValue: DishEntity | null = null;
  const accompanimentValues: DishEntity[] = [];

  if (!isNil(ownProps.selectedMealInCalendar) && !isNil(ownProps.selectedMealInCalendar.scheduledMealId) && ownProps.selectedMealInCalendar.scheduledMealId !== '') {
    scheduledMeal = getScheduledMeal(state, ownProps.scheduledMealId);
    if (!isNil(scheduledMeal)) {
      mainValue = getMainById(state, scheduledMeal.mainDishId);
      if (!isNil(scheduledMeal.accompanimentIds)) {
        scheduledMeal.accompanimentIds.forEach((accompanimentId: string) => {
          const accompanimentValue = getAccompanimentById(state, accompanimentId);
          if (!isNil(accompanimentValue)) {
            accompanimentValues.push(accompanimentValue);
          }
        });
      }
    }
  }

  return {
    scheduledMeal,
    mainValue,
    accompanimentValues,
    mains: getMains(state),
    accompaniments: getAccompaniments(state),
    state,
  };
}

const mapDispatchToProps = (dispatch: MealWheelDispatch) => {
  return bindActionCreators({
    onUpdateMainInMeal: updateMainInMeal,
    onGenerateMeal: generateMeal,
    onDeleteMeal: deleteScheduledMeal,
    onAddDish: addDish,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MealPropertySheet);
