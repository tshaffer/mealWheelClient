import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import Box from '@mui/material/Box';

import { DataGrid, GridCellParams } from '@mui/x-data-grid';
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
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertProps } from '@mui/material/Alert';

import { IngredientEntity, IngredientRowModel } from '../types';
import {
  getIngredients,
} from '../selectors';
import {
  addIngredient,
  updateIngredient
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
    const id = 'newIngredient' + uuidv4();
    setRows((oldRows) => [...oldRows, {
      id,
      name: '',
      showInGroceryList: false,
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
        Add ingredient
      </Button>
    </GridToolbarContainer>
  );
}

export interface IngredientsProps {
  ingredients: IngredientEntity[];
  onAddIngredient: (ingredient: IngredientEntity) => any;
  onUpdateIngredient: (id: string, ingredient: IngredientEntity) => any;
}
const initialRows: GridRowsProp = [];

const Ingredients = (props: IngredientsProps) => {

  const [rowsRead, setRowsRead] = React.useState(false);
  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
  const [snackbar, setSnackbar] = React.useState<Pick<AlertProps, 'children' | 'severity'> | null>(null);

  const handleCloseSnackbar = () => setSnackbar(null);

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
    // setSnackbar({ children: error.message, severity: 'error' });
  }, []);

  const processRowUpdate = (updatedIngredient: GridRowModel) => {

    // check for empty name
    if (updatedIngredient.name === '') {
      setSnackbar({ children: 'Error while saving user: name can\'t be empty.', severity: 'error' });
      return;
    }

    // check for duplicate ingredient names.
    const updatedIngredientName = updatedIngredient.name;
    for (let ingredientIndex = 0; ingredientIndex < rows.length; ingredientIndex++) {
      const existingIngredient: IngredientEntity = rows[ingredientIndex];
      if (updatedIngredient.id !== existingIngredient.id && existingIngredient.name === updatedIngredientName) {
        setSnackbar({ children: 'Error while saving user: duplicate ingredient name', severity: 'error' });
        return;
      }
    }

    const updatedRow = { ...updatedIngredient, isNew: false };
    setRows(rows.map((row) => (row.id === updatedIngredient.id ? updatedRow : row)));

    const ingredient: IngredientEntity = {
      id: updatedIngredient.id,
      name: updatedIngredient.name,
      showInGroceryList: updatedIngredient.showInGroceryList,
      ingredients: [],
    };
    if (updatedIngredient.id.startsWith('newIngredient')) {
      props.onAddIngredient(ingredient);
    } else {
      props.onUpdateIngredient(updatedRow.id, ingredient);
    }

    return updatedRow;
  };

  const ingredientsColumns: GridColumns = [
    { field: 'name', headerName: 'Name', width: 240, editable: true },
    {
      field: 'showInGroceryList',
      type: 'boolean',
      headerName: 'Show in Grocery List',
      width: 180,
      editable: true
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
    const rows: GridRowsProp = props.ingredients.map((ingredient: IngredientEntity) => {
      const row: GridRowModel = {
        id: ingredient.id,
        name: ingredient.name,
        showInGroceryList: ingredient.showInGroceryList,
      };
      return row;
    });
    return rows;
  };

  const getIsCellEditable = (params: GridCellParams): boolean => {

    // return value specific to the column field
    switch (params.field) {
      case 'id':
        return true;
      case 'name':
        return true;
      case 'showInGroceryList':
        return true;
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
        initialState={{
          sorting: {
            sortModel: [{ field: 'name', sort: 'asc' }],
          },
        }} rows={rows}
        columns={ingredientsColumns}
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
      {!!snackbar && (
        <Snackbar
          open
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          onClose={handleCloseSnackbar}
          autoHideDuration={6000}
        >
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </Box>
  );
};

function mapStateToProps(state: any) {
  return {
    ingredients: getIngredients(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onAddIngredient: addIngredient,
    onUpdateIngredient: updateIngredient,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Ingredients);
