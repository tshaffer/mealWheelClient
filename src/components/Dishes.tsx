import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isNil } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import Box from '@mui/material/Box';

import { DataGrid, GridCellEditStartParams, GridCellParams } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
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

import { DishEntity, DishRowModel, DishType, RequiredAccompanimentFlags } from '../types';
import { getDishes } from '../selectors';
import {
  addDish,
  updateDish
} from '../controllers';

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;

  const handleAddRow = () => {
    const id = 'newDish' + uuidv4();
    setRows((oldRows) => [...oldRows, {
      id,
      name: '',
      type: DishType.Main,
      requiresAccompaniment: RequiredAccompanimentFlags.None,
      side: RequiredAccompanimentFlags.None,
      salad: RequiredAccompanimentFlags.None,
      veg: RequiredAccompanimentFlags.None,
      isNew: true
    }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleAddRow}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

export interface DishesProps {
  dishes: DishEntity[];
  onAddDish: (dish: DishEntity) => any;
  onUpdateDish: (id: string, dish: DishEntity) => any;
}

const mainOption = { value: 'main', label: 'Main' };
const saladOption = { value: 'salad', label: 'Salad' };
const sideOption = { value: 'side', label: 'Side' };
const vegOption = { value: 'veg', label: 'Veg' };

const initialRows: GridRowsProp = [];

const Dishes = (props: DishesProps) => {

  const [rowsRead, setRowsRead] = React.useState(false);
  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

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

  const handleProcessRowUpdateError = React.useCallback((error: Error) => {
    console.log('handleProcessRowUpdateError: ', error.message);
  }, []);


  const processRowUpdate = (newRow: GridRowModel) => {

    // check for empty name
    if (newRow.name === '') {
      console.log('name is empty');
      Promise.reject(new Error('Error while saving user: name can\'t be empty.'));
      return;
    }

    // if it's a new dish, check for duplicate dish names.
    const dishName = newRow.name;
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const existingDish: DishEntity = rows[rowIndex];
      if (existingDish.id.startsWith('newDish')) {
        if (existingDish.name === dishName) {
          console.log('Duplicate name with dish: ');
          console.log(existingDish);
          Promise.reject(new Error('Error while saving user: duplicate dish name'));
          return;
        }
      }
    }

    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

    let accompaniment: RequiredAccompanimentFlags = RequiredAccompanimentFlags.None;
    if (newRow.side) {
      accompaniment = accompaniment + RequiredAccompanimentFlags.Side;
    }
    if (newRow.salad) {
      accompaniment = accompaniment + RequiredAccompanimentFlags.Salad;
    }
    if (newRow.veg) {
      accompaniment = accompaniment + RequiredAccompanimentFlags.Veg;
    }

    const dish: DishEntity = {
      id: newRow.id,
      name: newRow.name,
      type: newRow.type,
      accompaniment,
    };
    if (newRow.id.startsWith('newDish')) {
      props.onAddDish(dish);
    } else {
      props.onUpdateDish(updatedRow.id, dish);
    }

    return updatedRow;
  };

  const dishesColumns: GridColumns = [
    { field: 'name', headerName: 'Name', width: 240, editable: true },
    {
      field: 'type',
      type: 'singleSelect',
      valueOptions: [
        mainOption,
        saladOption,
        sideOption,
        vegOption,
      ],
      // https://github.com/mui/mui-x/issues/4437
      valueFormatter: ({ id: rowId, value, field, api }) => {
        const colDef = api.getColumn(field);
        const option = colDef.valueOptions.find(
          ({ value: optionValue }) => value === optionValue
        );
        return option.label;
      },
      headerName: 'Type',
      width: 180,
      editable: true,
    },
    {
      field: 'requiresAccompaniment',
      type: 'boolean',
      headerName: 'Requires accompaniment',
      width: 180,
      editable: true,
    },
    {
      field: 'side',
      type: 'boolean',
      headerName: 'Side',
      width: 90,
      editable: true,
    },
    {
      field: 'salad',
      type: 'boolean',
      headerName: 'Salad',
      width: 90,
      editable: true,
    },
    {
      field: 'veg',
      type: 'boolean',
      headerName: 'Veg',
      width: 90,
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

  const getRows = () => {
    const rows: GridRowsProp = props.dishes.map((dish: DishEntity) => {
      const row: GridRowModel = {
        id: dish.id,
        name: dish.name,
        type: dish.type,
        requiresAccompaniment: !isNil(dish.accompaniment) && dish.accompaniment !== RequiredAccompanimentFlags.None,
        side: dish.accompaniment & RequiredAccompanimentFlags.Side,
        salad: dish.accompaniment & RequiredAccompanimentFlags.Salad,
        veg: dish.accompaniment & RequiredAccompanimentFlags.Veg,
      };
      return row;
    });
    return rows;
  };

  const getAccompanimentEditEnabled = (dish: DishRowModel): boolean => {
    if (dish.type !== 'main') {
      return false;
    }
    return dish.requiresAccompaniment;
  };

  const getIsCellEditable = (params: GridCellParams): boolean => {

    const dishRowModel: DishRowModel = params.row;

    // return value specific to the column field
    switch (params.field) {
      case 'id':
        return true;
      case 'name':
        return true;
      case 'type':
        return true;
      case 'requiresAccompaniment':
        return dishRowModel.type === 'main';
      case 'side':
      case 'salad':
      case 'veg':
        return getAccompanimentEditEnabled(dishRowModel);
      default:
        return true;
    }
  };

  const newRows: GridRowsProp = getRows();
  if (!rowsRead && newRows.length > 0) {
    setRowsRead(true);
    setRows(newRows);
  }

  return (
    <Box
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
      <DataGrid
        rows={rows}
        columns={dishesColumns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        components={{
          Toolbar: EditToolbar,
        }}
        componentsProps={{
          toolbar: { setRows, setRowModesModel },
        }}
        experimentalFeatures={{ newEditingApi: true }}
        isCellEditable={(params: GridCellParams) => { return getIsCellEditable(params); }}
      />
    </Box>
  );
};

function mapStateToProps(state: any) {
  return {
    dishes: getDishes(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onAddDish: addDish,
    onUpdateDish: updateDish,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Dishes);
