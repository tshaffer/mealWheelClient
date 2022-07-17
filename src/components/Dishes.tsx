import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isNil } from 'lodash';

import Box from '@mui/material/Box';

import { DataGrid } from '@mui/x-data-grid';
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
  DataGridPro,
  GridColumns,
  GridRowParams,
  MuiEvent,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
} from '@mui/x-data-grid-pro';

import {
  randomCreatedDate,
  randomTraderName,
  randomUpdatedDate,
  randomId,
} from '@mui/x-data-grid-generator';

import { DishEntity, RequiredAccompanimentFlags } from '../types';
import { getDishes } from '../selectors';

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [...oldRows, { id, name: '', age: '', isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}










export interface DishesProps {
  dishes: DishEntity[];
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

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const dishesColumns: GridColumns = [
    { field: 'id', headerName: 'ID', width: 32, editable: false },
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

  const newRows: GridRowsProp = getRows();
  if (!rowsRead && newRows.length > 0) {
    setRowsRead(true);
    setRows(newRows);
  }

  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={dishesColumns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        components={{
          Toolbar: EditToolbar,
        }}
        componentsProps={{
          toolbar: { setRows, setRowModesModel },
        }}
        experimentalFeatures={{ newEditingApi: true }}
      />
    </div>
  );
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
      <DataGridPro
        rows={rows}
        columns={dishesColumns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        components={{
          Toolbar: EditToolbar,
        }}
        componentsProps={{
          toolbar: { setRows, setRowModesModel },
        }}
        experimentalFeatures={{ newEditingApi: true }}
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
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Dishes);
