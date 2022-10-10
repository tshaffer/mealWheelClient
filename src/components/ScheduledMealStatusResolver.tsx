import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

import { DishEntity, MealStatus, ScheduledMealEntity, VerboseScheduledMeal } from '../types';
import { isNil } from 'lodash';
import {
  getMainById,
  getMains,
  getSaladById,
  getSalads,
  getScheduledMealsToResolve,
  getSideById,
  getSides,
  getVeggieById,
  getVeggies
} from '../selectors';

import Box from '@mui/material/Box';

import { DataGrid, GridCellParams } from '@mui/x-data-grid';
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  GridColumns,
  GridRowParams,
  MuiEvent,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
} from '@mui/x-data-grid-pro';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';

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

// interface ScheduledMealToResolveRowModel {
//   id: string;
//   dayOfWeek: string;
//   mainName: string;
//   mealStatus: MealStatus;
// }

interface MiniMeal {
  mealId: string;
  mealStatus: MealStatus;
}

const initialRows: GridRowsProp = [];

const ScheduledMealStatusResolver = (props: ScheduledMealStatusResolverProps) => {

  const { verboseScheduledMeals, onClose } = props;

  const [mealsStatus, setMealsStatus] = useState<MiniMeal[]>([]);

  const [rowsRead, setRowsRead] = React.useState(false);
  const [rows, setRows] = React.useState(initialRows);
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

  const handleRowEditStart = (
    params: GridRowParams,
    event: MuiEvent<React.SyntheticEvent>,
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (updatedMeal: GridRowModel) => {
    console.log('processRowUpdate');
    console.log(updatedMeal);
    return updatedMeal;
  };


  const handleProcessRowUpdateError = React.useCallback((error: Error) => {
    debugger;
    console.log('handleProcessRowUpdateError: ', error.message);
    // setSnackbar({ children: error.message, severity: 'error' });
  }, []);

  const handleClose = () => {
    onClose();
  };

  const getDayOfWeek = (day: number): string => {
    const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return weekday[day];
  };

  const getIsCellEditable = (params: GridCellParams): boolean => {

    // console.log('getIsCellEditable');
    // console.log(params.row);

    // const scheduledMealToResolveRowModel: ScheduledMealToResolveRowModel = params.row;

    switch (params.field) {
      case 'mealStatus':
      case 'mains':
      case 'sides':
      case 'salads':
      case 'veggies':
        return true;
      default:
        return false;
    }
  };

  const getRows = () => {
    const rows: GridRowsProp = props.verboseScheduledMeals.map((verboseScheduledMeal: VerboseScheduledMeal) => {
      const row: GridRowModel = {
        id: verboseScheduledMeal.id,
        dayOfWeek: getDayOfWeek(verboseScheduledMeal.dateScheduled.getDay()),
        date: verboseScheduledMeal.dateScheduled,
        mainName: verboseScheduledMeal.mainDishName,
        mealStatus: verboseScheduledMeal.status,
        mains: (verboseScheduledMeal.mainDish as DishEntity).id,
        sides: isNil(verboseScheduledMeal.sideId) ? 'none' : verboseScheduledMeal.sideId,
        salads: isNil(verboseScheduledMeal.saladId) ? 'none' : verboseScheduledMeal.saladId,
        veggies: isNil(verboseScheduledMeal.veggieId) ? 'none' : verboseScheduledMeal.veggieId,
      };
      return row;
    });
    return rows;
  };

  const getMainValueOptions = (): any[] => {
    const mainValueOptions = props.mains.map((main: DishEntity) => {
      return ({
        value: main.id,
        label: main.name,
      });
    });
    return mainValueOptions;
  };

  const getSideValueOptions = (): any[] => {
    const sideValueOptions = props.sides.map((side: DishEntity) => {
      return ({
        value: side.id,
        label: side.name,
      });
    });
    sideValueOptions.unshift({
      value: 'none',
      label: 'None',
    });

    return sideValueOptions;
  };

  const getSaladValueOptions = (): any[] => {
    const saladValueOptions = props.salads.map((salad: DishEntity) => {
      return ({
        value: salad.id,
        label: salad.name,
      });
    });
    saladValueOptions.unshift({
      value: 'none',
      label: 'None',
    });

    return saladValueOptions;
  };

  const getVeggieValueOptions = (): any[] => {
    const veggieValueOptions = props.veggies.map((veggie: DishEntity) => {
      return ({
        value: veggie.id,
        label: veggie.name,
      });
    });
    veggieValueOptions.unshift({
      value: 'none',
      label: 'None',
    });
    return veggieValueOptions;
  };

  const mealColumns: GridColumns = [
    { field: 'dayOfWeek', type: 'string', headerName: 'Day', width: 120, editable: true },
    { field: 'date', type: 'date', headerName: 'Date', width: 120, editable: true },
    { field: 'mainName', type: 'string', headerName: 'Main', width: 300, editable: true },
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
    {
      field: 'mains',
      type: 'singleSelect',
      valueOptions: getMainValueOptions(),
      // https://github.com/mui/mui-x/issues/4437
      valueFormatter: ({ id: rowId, value, field, api }) => {
        const colDef = api.getColumn(field);
        const option = colDef.valueOptions.find(
          ({ value: optionValue }: any) => value === optionValue
        );
        return option.label;
      },
      headerName: 'Main',
      width: 300,
      editable: true,
    },
    {
      field: 'sides',
      type: 'singleSelect',
      valueOptions: getSideValueOptions(),
      // https://github.com/mui/mui-x/issues/4437
      valueFormatter: ({ id: rowId, value, field, api }) => {
        const colDef = api.getColumn(field);
        const option = colDef.valueOptions.find(
          ({ value: optionValue }: any) => value === optionValue
        );
        if (isNil(option)) {
          return 'None';
        }
        return option.label;
      },
      headerName: 'Side',
      width: 300,
      editable: true,
    },
    {
      field: 'salads',
      type: 'singleSelect',
      valueOptions: getSaladValueOptions(),
      // https://github.com/mui/mui-x/issues/4437
      valueFormatter: ({ id: rowId, value, field, api }) => {
        const colDef = api.getColumn(field);
        const option = colDef.valueOptions.find(
          ({ value: optionValue }: any) => value === optionValue
        );
        if (isNil(option)) {
          return 'None';
        }
        return option.label;
      },
      headerName: 'Salad',
      width: 300,
      editable: true,
    },
    {
      field: 'veggies',
      type: 'singleSelect',
      valueOptions: getVeggieValueOptions(),
      // https://github.com/mui/mui-x/issues/4437
      valueFormatter: ({ id: rowId, value, field, api }) => {
        const colDef = api.getColumn(field);
        const option = colDef.valueOptions.find(
          ({ value: optionValue }: any) => value === optionValue
        );
        if (isNil(option)) {
          return 'None';
        }
        return option.label;
      },
      headerName: 'Veggie',
      width: 300,
      editable: true,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
              key={0}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
              key={0}
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
            key={0}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
            key={0}
          />,
        ];
      },
    },
  ];

  const newRows: GridRowsProp = getRows();
  if (!rowsRead && newRows.length > 0) {
    setRowsRead(true);
    setRows(newRows);
  }

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
            // https://stackoverflow.com/questions/71588166/how-can-i-hide-a-column-in-mui
            // https://mui.com/x/react-data-grid/column-visibility/#controlled-visible-columns

            columns: {
              columnVisibilityModel: {
                date: false,
              },
            },
          }} rows={rows}
          columns={mealColumns}
          editMode='row'
          rowModesModel={rowModesModel}
          onRowEditStart={handleRowEditStart}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={handleProcessRowUpdateError}
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
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ScheduledMealStatusResolver);
