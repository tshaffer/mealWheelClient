import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

import { DishEntity, MealStatus, ScheduledMealEntity, VerboseScheduledMeal } from '../types';
import { cloneDeep, initial, isNil } from 'lodash';
import { getMainById, getMains, getSaladById, getSalads, getScheduledMealsToResolve, getSideById, getSides, getVeggieById, getVeggies } from '../selectors';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { InputLabel, MenuItem, Select } from '@mui/material';
import {
  updateMainInMeal,
  updateSideInMeal,
  updateSaladInMeal,
  updateVeggieInMeal,
  updateMealStatus,
} from '../controllers';

import Box from '@mui/material/Box';

import { DataGrid, GridCellParams } from '@mui/x-data-grid';
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  GridColumns,
  GridRowParams,
  MuiEvent,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
} from '@mui/x-data-grid-pro';

const cookedOption = { value: 1, label: 'Cooked' };
const tbdOption = { value: 0, label: 'TBD' };
const differentOption = { value: 2, label: 'Different' };


export interface ScheduledMealStatusResolverPropsFromParent {
  onClose: () => void;
}

export interface ScheduledMealStatusResolverProps extends ScheduledMealStatusResolverPropsFromParent {
  verboseScheduledMeals: VerboseScheduledMeal[];
  mains: DishEntity[];
  sides: DishEntity[];
  salads: DishEntity[];
  veggies: DishEntity[];
  scheduledMealsToResolve: ScheduledMealEntity[];
  onUpdateSideInMeal: (mealId: string, newSideId: string) => any;
  onUpdateSaladInMeal: (mealId: string, newSaladId: string) => any;
  onUpdateVeggieInMeal: (mealId: string, newVeggieId: string) => any;
  onUpdateMainInMeal: (mealId: string, newMainId: string) => any;
  onUpdateMealStatus: (mealId: string, mealStatus: MealStatus) => any;
}

interface MiniMeal {
  mealId: string;
  mealStatus: MealStatus;
}

const ScheduledMealStatusResolver = (props: ScheduledMealStatusResolverProps) => {

  const { verboseScheduledMeals, onClose } = props;

  const [mealsStatus, setMealsStatus] = useState<MiniMeal[]>([]);

  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

  React.useEffect(() => {
    if (mealsStatus.length === 0) {
      const initialMealsStatus: MiniMeal[] = [];
      verboseScheduledMeals.forEach((verboseScheduledMeal: VerboseScheduledMeal) => {
        initialMealsStatus.push({
          mealId: verboseScheduledMeal.id,
          mealStatus: verboseScheduledMeal.status,
        });
      });
      setMealsStatus(initialMealsStatus);
    }
  }, [verboseScheduledMeals]);

  const handleClose = () => {
    onClose();
  };

  const handleUpdateMain = (mealId: string, event: any) => {
    props.onUpdateMainInMeal(mealId, event.target.value);
  };

  const handleUpdateSide = (mealId: string, event: any) => {
    props.onUpdateSideInMeal(mealId, event.target.value);
  };

  const handleUpdateSalad = (mealId: string, event: any) => {
    props.onUpdateSaladInMeal(mealId, event.target.value);
  };

  const handleUpdateVeggie = (mealId: string, event: any) => {
    props.onUpdateVeggieInMeal(mealId, event.target.value);
  };

  const handleUpdateMealStatus = (meal: VerboseScheduledMeal, event: any) => {
    const miniMeals: MiniMeal[] = cloneDeep(mealsStatus);
    // TODO - improve
    miniMeals.forEach((miniMeal: MiniMeal) => {
      if (miniMeal.mealId === meal.id) {
        miniMeal.mealStatus = parseInt(event.target.value, 10);
      }
    });
    setMealsStatus(miniMeals);
  };

  const getMealStatus = (mealId: string): MealStatus => {
    // TODO - make me better
    let mealStatus: MealStatus = MealStatus.pending;
    mealsStatus.forEach((miniMeal: MiniMeal) => {
      if (miniMeal.mealId === mealId) {
        mealStatus = miniMeal.mealStatus;
      }
    });
    return mealStatus;
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

  const renderMains = (mealId: string, mainDish: DishEntity | null) => {
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
            onChange={(event) => handleUpdateMain(mealId, event)}
          >
            {mainsMenuItems}
          </Select>
        </FormControl>
      </div>
    );
  };

  const renderSides = (mealId: string, sideDish: DishEntity | null) => {
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
            onChange={(event) => handleUpdateSide(mealId, event)}
          >
            {sidesMenuItems}
          </Select>
        </FormControl>
      </div>
    );
  };

  const renderSalads = (mealId: string, salad: DishEntity | null) => {
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
            onChange={(event) => handleUpdateSalad(mealId, event)}
          >
            {saladsMenuItems}
          </Select>
        </FormControl>
      </div>
    );
  };

  const renderVeggies = (mealId: string, veggie: DishEntity | null) => {
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
            onChange={(event) => handleUpdateVeggie(mealId, event)}
          >
            {veggiesMenuItems}
          </Select>
        </FormControl>
      </div>
    );
  };

  const renderAccompaniments = (verboseScheduledMeal: VerboseScheduledMeal) => {
    const mealStatus: MealStatus = getMealStatus(verboseScheduledMeal.id);
    if (mealStatus !== MealStatus.different) {
      return null;
    }
    return (
      <div>
        {renderMains(verboseScheduledMeal.id, verboseScheduledMeal.mainDish)}
        {renderSides(verboseScheduledMeal.id, verboseScheduledMeal.side)}
        {renderSalads(verboseScheduledMeal.id, verboseScheduledMeal.salad)}
        {renderVeggies(verboseScheduledMeal.id, verboseScheduledMeal.veggie)}\
      </div>
    );
  };

  const getIsCellEditable = (params: GridCellParams): boolean => {
    return false;
  };

  const getRows = () => {
    const rows: GridRowsProp = props.verboseScheduledMeals.map((verboseScheduledMeal: VerboseScheduledMeal) => {
      // const side = isNil(dish.accompanimentRequired) ? RequiredAccompanimentFlags.None : dish.accompanimentRequired & RequiredAccompanimentFlags.Side;
      // const salad = isNil(dish.accompanimentRequired) ? RequiredAccompanimentFlags.None : dish.accompanimentRequired & RequiredAccompanimentFlags.Salad;
      // const veggie = isNil(dish.accompanimentRequired) ? RequiredAccompanimentFlags.None : dish.accompanimentRequired & RequiredAccompanimentFlags.Veggie;
      const row: GridRowModel = {
        id: verboseScheduledMeal.id,
        dayOfWeek: getDayOfWeek(verboseScheduledMeal.dateScheduled.getDay()),
        mainName: verboseScheduledMeal.mainDishName,
        mealStatus: verboseScheduledMeal.status,
      };
      return row;
    });
    return rows;
  };

  const mealColumns: GridColumns = [
    { field: 'dayOfWeek', headerName: 'Day', width: 120, editable: false },
    { field: 'date', headerName: 'Date', width: 120, editable: false },
    { field: 'mainName', headerName: 'Main', width: 200, editable: false },
    {
      field: 'mealStatus',
      type: 'singleSelect',
      valueOptions: [
        cookedOption,
        tbdOption,
        differentOption,
      ],
      // https://github.com/mui/mui-x/issues/4437
      valueFormatter: ({ id: rowId, value, field, api }) => {
        const colDef = api.getColumn(field);
        const option = colDef.valueOptions.find(
          ({ value: optionValue }: any) => value === optionValue
        );
        return option.label;
      },
      headerName: 'Meal Status',
      width: 100,
      editable: true,
    },
  ];

  // return (
  //   <Dialog onClose={handleClose} open={props.scheduledMealsToResolve.length > 0} maxWidth={false}>
  //     <DialogTitle>About MealWheel</DialogTitle>
  //     <List sx={{ pt: 0 }}>
  //       {verboseScheduledMeals.map((verboseScheduledMeal: VerboseScheduledMeal) => (
  //         <ListItem key={verboseScheduledMeal.id}>
  //           <ListItemText>{getDayOfWeek(verboseScheduledMeal.dateScheduled.getDay())}</ListItemText>
  //           <ListItemText>
  //             {verboseScheduledMeal.dateScheduled.toLocaleDateString(
  //               'en-us',
  //               {
  //                 month: '2-digit',
  //                 day: '2-digit',
  //               }
  //             )}
  //           </ListItemText>
  //           <ListItemText>{verboseScheduledMeal.mainDishName}</ListItemText>
  //           <FormControl>
  //             <RadioGroup
  //               row
  //               aria-labelledby="demo-row-radio-buttons-group-label"
  //               name="row-radio-buttons-group"
  //               value={getMealStatus(verboseScheduledMeal.id)}
  //               onChange={(event) => handleUpdateMealStatus(verboseScheduledMeal, event)}
  //             >
  //               <FormControlLabel value={MealStatus.prepared} control={<Radio />} label="Cooked" />
  //               <FormControlLabel value={MealStatus.pending} control={<Radio />} label="TBD" />
  //               <FormControlLabel value={MealStatus.different} control={<Radio />} label="Different" />
  //             </RadioGroup>
  //           </FormControl>
  //           {renderAccompaniments(verboseScheduledMeal)}
  //         </ListItem>
  //       ))}
  //     </List>
  //   </Dialog>
  // );

  const rows = getRows();
  console.log('rows');
  console.log(rows);

  return (
    <Dialog onClose={handleClose} open={props.scheduledMealsToResolve.length > 0} maxWidth='xl'>
      <DialogTitle>About MealWheel</DialogTitle>
      <Box
        sx={{
          height: 500,
          width: '800px',
          '& .actions': {
            color: 'text.secondary',
          },
          '& .textPrimary': {
            color: 'text.primary',
          },
        }}
      >

        <DataGrid
          initialState={{
            sorting: {
              sortModel: [{ field: 'date', sort: 'asc' }],
            },
          }} rows={rows}
          columns={mealColumns}
          editMode='row'
          rowModesModel={rowModesModel}
          experimentalFeatures={{ newEditingApi: true }}
          isCellEditable={(params: GridCellParams) => { return getIsCellEditable(params); }}
        />
      </Box>
    </Dialog >
  );

};

function mapStateToProps(state: any) {

  const verboseScheduledMeals: VerboseScheduledMeal[] = [];

  const scheduledMealsToResolve: ScheduledMealEntity[] = getScheduledMealsToResolve(state);

  for (const scheduledMeal of scheduledMealsToResolve) {

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
    scheduledMealsToResolve: getScheduledMealsToResolve(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onUpdateSideInMeal: updateSideInMeal,
    onUpdateMainInMeal: updateMainInMeal,
    onUpdateSaladInMeal: updateSaladInMeal,
    onUpdateVeggieInMeal: updateVeggieInMeal,
    onUpdateMealStatus: updateMealStatus,

  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ScheduledMealStatusResolver);
