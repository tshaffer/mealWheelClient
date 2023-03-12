import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { cloneDeep, isNil } from 'lodash';
import { IngredientRow, IngredientEntity, Order, UiState } from '../types';

import { TableHead, TableRow, TableCell, TableSortLabel, Box, AlertProps, Alert, Button, Paper, Snackbar, Table, TableBody, TableContainer, TablePagination } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';


import { visuallyHidden } from '@mui/utils';
import { MealWheelDispatch } from '../models';
import { addIngredient, updateIngredient } from '../controllers';
import { getIngredients, getSortBy, getSortOrder, getUiState } from '../selectors';


interface HeadCell {
  disablePadding: boolean;
  id: keyof IngredientEntity;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Main',
  },
  {
    id: 'showInGroceryList',
    numeric: false,
    disablePadding: true,
    label: 'Show In Grocery List',
  },
];

interface TableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof IngredientEntity) => void;
  order: Order;
  orderBy: string;
}

export interface IngredientsProps {
  ingredients: IngredientEntity[];
  rows: IngredientRow[];
  onAddIngredient: (ingredient: IngredientEntity) => any;
  onUpdateIngredient: (id: string, ingredient: IngredientEntity) => any;
  sortOrder: Order;
  sortBy: string;
  uiState: UiState;

  // rows: IngredientRow[];
  // uiState: UiState;
  // onAddDish: (dish: DishEntity) => any;
  // onUpdateDish: (id: string, dish: DishEntity) => any;
  // onDeleteDish: (id: string) => any;
  // onSortIngredientsAndSetRows: (sortOrder: Order, sortBy: string) => any;
  // onSortIngredients: (sortOrder: Order, sortBy: string) => any;
  // onSetRows: (rows: IngredientRow[]) => any;
  // onSetCurrentEditDish: (currentEditDish: IngredientRow | null) => any;
  // onSetSortOrder: (sortOrder: Order) => any;
  // onSetSortBy: (sortBy: string) => any;
}

const IngredientsTableHead = (props: TableProps) => {

  const { order, orderBy, onRequestSort } =
    props;

  const createSortHandler =
    (property: keyof IngredientEntity) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={'center'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component='span' sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell
          key={'actions'}
          align={'center'}
          padding={'none'}
        >
          Actions
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

const Ingredients = (props: IngredientsProps) => {

  const [dishNameInRow, setDishNameInRow] = React.useState<any>(null);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [showAssignIngredientsToDish, setShowAssignIngredientsToDish] = React.useState(false);
  const [dishId, setDishId] = React.useState('');

  const [snackbar, setSnackbar] = React.useState<Pick<AlertProps, 'children' | 'severity'> | null>(null);

  React.useEffect(() => {
    if (props.uiState === UiState.Ingredients) {
      const newRows: IngredientRow[] = getRows();
      props.onSetRows(newRows);
    }
  }, [props.uiState]);

  React.useEffect(() => {
    if (!isNil(dishNameInRow)) {

      // const querySelectorAllResults = dishNameInRow.querySelectorAll('input');
      // console.log('querySelectorAll results:');
      // console.log(querySelectorAllResults);
      // const nameField = querySelectorAllResults[0];
      // nameField.focus();

      const byTagNameResults = dishNameInRow.getElementsByTagName('input');
      // console.log('getElementsByTagName results:');
      // console.log(byTagNameResults);
      const nameField = byTagNameResults[0];
      nameField.focus();

      // const nameField: any = dishNameInRow.children[1].firstChild;
      // nameField.focus();
    }
  }, [dishNameInRow]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseSnackbar = () => setSnackbar(null);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof IngredientRow,
  ) => {
  };

  const handleAddRow = () => {
  };

  // Avoid a layout jump when reaching the last page with empty props.rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - props.rows.length) : 0;

  const renderSortedTableContents = () => {
    return (<div>pizza</div>);
  };

  return (
    <div>
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <div>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleAddRow}>
              Add dish
            </Button>
          </div>
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              size={'small'}
            >
              <IngredientsTableHead
                order={props.sortOrder}
                orderBy={props.sortBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {renderSortedTableContents()}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (33) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={props.rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
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

        </Paper>
      </Box>
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
    ingredients: getIngredients(state),
    uiState: getUiState(state),
    sortOrder: getSortOrder(state),
    sortBy: getSortBy(state),
    rows: [],
    // dishes: getDishes(state),
    // rows: getDishRows(state),
    // currentEditDish: getCurrentEditDish(state),
    // uiState: getUiState(state),
    // sortOrder: getSortOrder(state),
    // sortBy: getSortBy(state),
  };
}

const mapDispatchToProps = (dispatch: MealWheelDispatch) => {
  return bindActionCreators({
    onAddIngredient: addIngredient,
    onUpdateIngredient: updateIngredient,
    // onAddDish: addDish,
    // onUpdateDish: updateDish,
    // onDeleteDish: deleteDish,
    // onSortDishes: sortDishes,
    // onSetRows: setRows,
    // onSetCurrentEditDish: setCurrentEditDish,
    // onSetSortOrder: setSortOrder,
    // onSetSortBy: setSortBy,
    // onSortDishesAndSetRows: sortDishesAndSetRows,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Ingredients);

