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

import DeleteIcon from '@mui/icons-material/DeleteOutlined';

import '../styles/MealWheel.css';

import {
  AccompanimentTypeNameById,
  DishEntity,
  ScheduledMealEntity
} from '../types';
import {
  getMains,
  getScheduledMeal,
  getMainById,
  getAccompanimentById,
  getAccompaniments,
  getAccompanimentTypeNamesById
} from '../selectors';
import {
  addDish,
  deleteScheduledMeal,
  generateMeal,
  updateAccompanimentInMeal,
  updateMainInMeal,
  // updateAccompanimentInMeal,
} from '../controllers';

import NewDishDialog from './NewDishDialog';
import { MealWheelDispatch } from '../models';
import { IconButton, Tooltip } from '@mui/material';

export interface MealPropertySheetPropsFromParent {
  scheduledMealId: string;
  selectedMealInCalendar: CalendarEvent | null;
  handleClose: () => any;
  onUpdateCalendarEvent: (calendarEvent: CalendarEvent) => any;
}

export interface MealPropertySheetProps extends MealPropertySheetPropsFromParent {
  scheduledMeal: ScheduledMealEntity | null,
  currentMain: DishEntity | null;
  currentAccompaniments: DishEntity[],
  allMains: DishEntity[];
  allAccompaniments: DishEntity[];
  accompanimentTypeNameById: AccompanimentTypeNameById;
  onUpdateMainInMeal: (mealId: string, newMainId: string) => any;
  onGenerateMeal: (mealId: string, date: Date) => any;
  onDeleteMeal: (mealId: string) => any;
  onAddDish: (dish: DishEntity) => any;
  onUpdateAccompanimentInMeal: (
    mealId: string,
    accompanimentId: string,
  ) => any;
  state: any;
}


const MealPropertySheet = (props: MealPropertySheetProps) => {

  const [comments, setComments] = React.useState('');

  const [showNewDishDialog, setShowNewDishDialog] = React.useState(false);
  const [dishType, setDishType] = React.useState('main');

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
      setDishType('main');
      setShowNewDishDialog(true);
    } else {
      props.onUpdateMainInMeal(getScheduledMealId(), event.target.value);
    }
  };

  const handleUpdateAccompaniment = (accompanimentTypeId: string, event: any) => {
    console.log('handleUpdateAccompaniment');
    console.log(event);
    const selectedAccompanimentId: string = event.target.value;
    if (event.target.value === 'new') {
      setDishType(accompanimentTypeId);
      setShowNewDishDialog(true);
    } else {
      props.onUpdateAccompanimentInMeal(
        getScheduledMealId(),
        selectedAccompanimentId,
      );
    }
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

  const handleAddDish = (
    dishName: string,
    dishType: string,
    minimumInterval: number,
    numAccompanimentsRequired?: number,
    allowableAccompanimentTypeEntityIds?: string[],
  ) => {
    console.log('handleAddDish: ', dishType);
    console.log(dishName);
    // console.log(requiredAccompanimentFlags);
    // TODO - I don't think the 'addedDish' is necessary.
    const dishId: string = 'addedDish' + uuidv4();
    const dishEntity: DishEntity = {
      id: dishId,
      name: dishName,
      type: dishType,
      minimumInterval,
      last: null,
      prepEffort: 5,
      prepTime: 15,
      cleanupEffort: 5,
    };
    if (!isNil(numAccompanimentsRequired)) {
      dishEntity.numAccompanimentsRequired = numAccompanimentsRequired;
      dishEntity.allowableAccompanimentTypeEntityIds = allowableAccompanimentTypeEntityIds;
    }
    const addDishPromise = props.onAddDish(dishEntity);
    addDishPromise
      .then((updatedDishId: string) => {
        const scheduledMealId = getScheduledMealId();
        switch (dishType) {
          case 'main':
            props.onUpdateMainInMeal(scheduledMealId, updatedDishId);
            break;
        }
        setShowNewDishDialog(false);
      });
  };

  const handleCloseNewDishDialog = () => {
    setShowNewDishDialog(false);
  };

  const renderNewMenuItem = (): JSX.Element => {
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
    if (!isNil(props.currentMain)) {
      mainId = props.currentMain.id;
    }
    const mainsMenuItems: JSX.Element[] = renderDishMenuItems(props.allMains, false);
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

  const handleDeleteClick = (id: any) => {
    console.log('Delete accompaniment type ' + id);
  };

  const renderAccompanimentsSelectForSpecificAccompanimentType = (accompanimentTypeEntityId: string): JSX.Element => {

    // how to get the current accompaniment - that translates to the item in the select to highlight?
    //    currentAccompaniments is the list of accompaniments associated with the scheduled meal
    //    need to pull out the accompanimentId whose associated accompaniment(dish) is of the type specified here

    let currentAccompanimentId: string = '';
    props.currentAccompaniments.forEach((accompaniment: DishEntity) => {
      if (accompaniment.type === accompanimentTypeEntityId) {
        currentAccompanimentId = accompaniment.id;
      }
    });

    const dishEntitiesForThisAccompanimentType: DishEntity[] = [];
    props.allAccompaniments.forEach((accompanimentDish: DishEntity) => {
      if (accompanimentDish.type === accompanimentTypeEntityId) {
        dishEntitiesForThisAccompanimentType.push(accompanimentDish);
      }
    });
    const accompanimentMenuItems: JSX.Element[] = renderDishMenuItems(dishEntitiesForThisAccompanimentType, false);
    return (
      <div>
        <div>
          <Tooltip title="Delete">
            <IconButton
              id={accompanimentTypeEntityId}
              onClick={() => handleDeleteClick(accompanimentTypeEntityId)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="mainLabel">{props.accompanimentTypeNameById[accompanimentTypeEntityId]}</InputLabel>
            <Select
              labelId="mainLabel"
              id="demo-simple-select-filled"
              value={currentAccompanimentId}
              onChange={(event) => handleUpdateAccompaniment(accompanimentTypeEntityId, event)}
            >
              {accompanimentMenuItems}
            </Select>
          </FormControl>
        </div>
      </div>
    );

  };

  const renderAccompanimentSelects = (): JSX.Element[] | null => {

    if (isNil(props.currentMain?.allowableAccompanimentTypeEntityIds)) {
      return null;
    }

    const renderedAccompanimentsSelects: JSX.Element[] = [];
    props.currentMain?.allowableAccompanimentTypeEntityIds.forEach((allowableAccompanimentTypeId: string) => {
      const renderedAccompanimentSelect = renderAccompanimentsSelectForSpecificAccompanimentType(allowableAccompanimentTypeId);
      renderedAccompanimentsSelects.push(renderedAccompanimentSelect);
    });
    return renderedAccompanimentsSelects;

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
        <Button className='buttonMarginLeft' color='inherit' variant='contained' onClick={handleDelete}>Delete</Button>
        <Button className='buttonMarginLeft buttonMarginRight' color='inherit' variant='contained' onClick={handleRegenerate}>Suggest another</Button>
      </div>
    );
  };

  const mainDishElement = renderMains();
  const accompanimentElements = renderAccompanimentSelects();

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
          dishType={dishType}
        />
      </div>
      <div className='mealPropertySheet'>
        <p className='shortParagraph'>{'Main: ' + (props.currentMain as DishEntity).name}</p>
        {mainDishElement}
        {accompanimentElements}
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
  let currentMain: DishEntity | null = null;
  const currentAccompaniments: DishEntity[] = [];

  if (!isNil(ownProps.selectedMealInCalendar) && !isNil(ownProps.selectedMealInCalendar.scheduledMealId) && ownProps.selectedMealInCalendar.scheduledMealId !== '') {
    scheduledMeal = getScheduledMeal(state, ownProps.scheduledMealId);
    if (!isNil(scheduledMeal)) {
      currentMain = getMainById(state, scheduledMeal.mainDishId);
      if (!isNil(scheduledMeal.accompanimentDishIds)) {
        scheduledMeal.accompanimentDishIds.forEach((accompanimentId: string) => {
          const accompanimentValue = getAccompanimentById(state, accompanimentId);
          if (!isNil(accompanimentValue)) {
            currentAccompaniments.push(accompanimentValue);
          }
        });
      }
    }
  }

  return {
    scheduledMeal,
    currentMain,
    currentAccompaniments,
    allMains: getMains(state),
    allAccompaniments: getAccompaniments(state),
    state,
    accompanimentTypeNameById: getAccompanimentTypeNamesById(state),
  };
}

const mapDispatchToProps = (dispatch: MealWheelDispatch) => {
  return bindActionCreators({
    onUpdateMainInMeal: updateMainInMeal,
    onGenerateMeal: generateMeal,
    onDeleteMeal: deleteScheduledMeal,
    onAddDish: addDish,
    onUpdateAccompanimentInMeal: updateAccompanimentInMeal,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MealPropertySheet);
