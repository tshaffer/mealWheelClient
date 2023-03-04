import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { cloneDeep, isNil, isNumber, isString } from 'lodash';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { visuallyHidden } from '@mui/utils';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import Select from '@mui/material/Select';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertProps } from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';

import { DishEntity, DishRow, DishType, RequiredAccompanimentFlags, UiState } from '../types';
import AssignIngredientsToDishDialog from './AssignIngredientsToDishDialog';
import { addDish, deleteDish, updateDish } from '../controllers';
import { getDishes, getDishRows, getUiState } from '../selectors';
import { MealWheelDispatch, sortDishes } from '../models';
import { setRows } from '../models/dishesUI';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
    a: { [key in Key]: boolean | string | number | DishEntity | Date | null },
    b: { [key in Key]: boolean | string | number | DishEntity | Date | null },
  ) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof DishRow;
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
    id: 'type',
    numeric: false,
    disablePadding: true,
    label: 'Type',
  },
  {
    id: 'minimumInterval',
    numeric: true,
    disablePadding: true,
    label: 'Minimum interval in days (0 for no minimum)',
  },
  {
    id: 'requiresAccompaniment',
    numeric: false,
    disablePadding: true,
    label: 'Requires accompaniment',
  },
  {
    id: 'requiresSalad',
    numeric: false,
    disablePadding: true,
    label: 'Salad',
  },
  {
    id: 'requiresSide',
    numeric: false,
    disablePadding: true,
    label: 'Side',
  },
  {
    id: 'requiresVeggie',
    numeric: false,
    disablePadding: true,
    label: 'Veggie',
  },
];

interface TableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof DishRow) => void;
  order: Order;
  orderBy: string;
}

export interface DishesProps {
  dishes: DishEntity[];
  rows: DishRow[];
  uiState: UiState;
  onAddDish: (dish: DishEntity) => any;
  onUpdateDish: (id: string, dish: DishEntity) => any;
  onDeleteDish: (id: string) => any;
  onSortDishes: () => any;
  onSetRows: (rows: DishRow[]) => any;
}

const DishesTableHead = (props: TableProps) => {

  const { order, orderBy, onRequestSort } =
    props;

  const createSortHandler =
    (property: keyof DishRow) => (event: React.MouseEvent<unknown>) => {
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

const Dishes = (props: DishesProps) => {

  const [currentEditDish, setCurrentEditDish] = React.useState<DishRow | null>(null);
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof DishRow>('name');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [showAssignIngredientsToDish, setShowAssignIngredientsToDish] = React.useState(false);
  const [dishId, setDishId] = React.useState('');

  const [snackbar, setSnackbar] = React.useState<Pick<AlertProps, 'children' | 'severity'> | null>(null);

  React.useEffect(() => {
    if (props.uiState === UiState.Dishes) {

      const newRows: DishRow[] = getRows();
      props.onSetRows(newRows);
    }
  }, [props.uiState]);


  interface IdToNumberMap {
    [id: string]: number;
  }

  let dishIdToDishRowIndex: IdToNumberMap = {};

  const getRows = (): DishRow[] => {

    const rows: DishRow[] = props.dishes.map((dish: DishEntity) => {
      const requiresSide: boolean = isNil(dish.accompanimentRequired) ? false : (dish.accompanimentRequired & RequiredAccompanimentFlags.Side) !== 0;
      const requiresSalad = isNil(dish.accompanimentRequired) ? false : (dish.accompanimentRequired & RequiredAccompanimentFlags.Salad) !== 0;
      const requiresVeggie = isNil(dish.accompanimentRequired) ? false : (dish.accompanimentRequired & RequiredAccompanimentFlags.Veggie) !== 0;
      const row: DishRow = {
        dish,
        name: dish.name,
        type: dish.type,
        last: dish.last,
        minimumInterval: dish.minimumInterval,
        requiresAccompaniment: !isNil(dish.accompanimentRequired) && dish.accompanimentRequired !== RequiredAccompanimentFlags.None,
        requiresSide,
        requiresSalad,
        requiresVeggie,
      };
      return row;
    });
    return rows;
  };

  const handleCloseSnackbar = () => setSnackbar(null);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof DishRow,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddRow = () => {

    const dish: DishEntity = {
      id: '',
      name: '',
      type: DishType.Main,
      minimumInterval: 5,
      last: null,
      prepEffort: 5,
      prepTime: 15,
      cleanupEffort: 5,
    };

    const dishRow: DishRow = {
      dish,
      name: '',
      type: DishType.Main,
      minimumInterval: 5,
      last: null,
      requiresAccompaniment: false,
      requiresSalad: false,
      requiresSide: false,
      requiresVeggie: false,
    };

    const newRows = cloneDeep(props.rows);
    newRows.unshift(dishRow);
    props.onSetRows(newRows);

    setCurrentEditDish(dishRow);

  };

  const handleEditClick = (dishEntityData: DishRow) => {
    setCurrentEditDish(dishEntityData);
  };

  const handleAssignIngredientsToDish = (dishEntityData: DishRow) => {
    setDishId(dishEntityData.dish.id);
    setShowAssignIngredientsToDish(true);
  };

  const handleCloseAssignIngredientsToDish = () => {
    setShowAssignIngredientsToDish(false);
  };

  const handleDeleteClick = (dishEntityData: DishRow) => {
    props.onSetRows(props.rows.filter((row) => row.dish.id !== dishEntityData.dish.id));
    props.onDeleteDish(dishEntityData.dish.id);
    setCurrentEditDish(null);
  };

  const getAccompanimentRequired = (dishRow: DishRow): RequiredAccompanimentFlags => {
    switch (dishRow.type) {
      case DishType.Main: {
        let accompanimentValue: RequiredAccompanimentFlags = RequiredAccompanimentFlags.None;
        if (dishRow.requiresSalad) {
          accompanimentValue = RequiredAccompanimentFlags.Salad;
        }
        if (dishRow.requiresSide) {
          accompanimentValue += RequiredAccompanimentFlags.Side;
        }
        if (dishRow.requiresVeggie) {
          accompanimentValue += RequiredAccompanimentFlags.Veggie;
        }
        return accompanimentValue;
      }
      case DishType.Salad:
      case DishType.Side:
      case DishType.Veggie:
        return RequiredAccompanimentFlags.None;
    }
  };

  const handleSaveClick = () => {

    if (!isNil(currentEditDish)) {

      // check for empty name
      if (currentEditDish.name === '') {
        setSnackbar({ children: 'Error while saving dish: name can\'t be empty.', severity: 'error' });
        return;
      }

      // check for duplicate dish names.
      const updatedDishName = currentEditDish.name;
      for (let dishIndex = 0; dishIndex < props.dishes.length; dishIndex++) {
        const existingDish: DishEntity = props.dishes[dishIndex];
        if (currentEditDish.dish.id !== existingDish.id && existingDish.name === updatedDishName) {
          setSnackbar({ children: 'Error while saving dish: duplicate dish name', severity: 'error' });
          return;
        }
      }

      // if requiresAccompaniment, ensure that one is specified
      if (currentEditDish.requiresAccompaniment) {
        if (!currentEditDish.requiresSalad && !currentEditDish.requiresSide && !currentEditDish.requiresVeggie) {
          setSnackbar({ children: 'Error while saving dish: accompaniment required.', severity: 'error' });
          return;
        }
      }

      if (currentEditDish.dish.id === '') {
        const newDish: DishEntity = {
          id: '',
          name: currentEditDish.name,
          type: currentEditDish.type,
          minimumInterval: currentEditDish.minimumInterval,
          accompanimentRequired: getAccompanimentRequired(currentEditDish),
          last: null,
          prepEffort: 5,
          prepTime: 15,
          cleanupEffort: 5,
        };
        props.onAddDish(newDish)
          .then((newDishId: string) => {
            const selectedDishRowIndex = dishIdToDishRowIndex[''];
            if (selectedDishRowIndex !== -1) {
              const clonedRows = cloneDeep(props.rows);
              const selectedRow: DishRow = clonedRows[selectedDishRowIndex];
              selectedRow.dish.id = newDishId;
              props.onSetRows(clonedRows);
            }
          });
      } else {
        const updatedDish: DishEntity = cloneDeep(currentEditDish.dish);
        updatedDish.name = currentEditDish.name;
        updatedDish.type = currentEditDish.type;
        updatedDish.minimumInterval = currentEditDish.minimumInterval;
        updatedDish.accompanimentRequired = getAccompanimentRequired(currentEditDish);
        props.onUpdateDish(currentEditDish.dish.id, updatedDish);
      }
      setCurrentEditDish(null);
    }
  };

  const handleCancelClick = () => {

    if (!isNil(currentEditDish) && !isNil(currentEditDish.dish) && (currentEditDish.dish.id === '')) {
      // new dish - discard row

      const selectedIndex = dishIdToDishRowIndex[''];
      if (selectedIndex !== -1) {
        const newRows = cloneDeep(props.rows);
        newRows.splice(selectedIndex, 1);
        debugger;
        props.onSetRows(newRows);
      }

    } else {

      // revert to row before edits
      //    dishEntity hasn't been updated yet

      if (!isNil(currentEditDish)) {
        const selectedDishRowIndex = dishIdToDishRowIndex[currentEditDish.dish.id];
        const selectedDishRow: DishRow = props.rows[selectedDishRowIndex];
        const unmodifiedDishEntity: DishEntity = selectedDishRow.dish;
        selectedDishRow.name = unmodifiedDishEntity.name;
        selectedDishRow.type = unmodifiedDishEntity.type;
        selectedDishRow.minimumInterval = unmodifiedDishEntity.minimumInterval;
        selectedDishRow.last = unmodifiedDishEntity.last;
        if (isNil(unmodifiedDishEntity.accompanimentRequired)) {
          selectedDishRow.requiresAccompaniment = false;
          selectedDishRow.requiresSalad = false;
          selectedDishRow.requiresSide = false;
          selectedDishRow.requiresVeggie = false;
        } else {
          selectedDishRow.requiresAccompaniment = unmodifiedDishEntity.accompanimentRequired !== RequiredAccompanimentFlags.None;
          selectedDishRow.requiresSalad = (unmodifiedDishEntity.accompanimentRequired & RequiredAccompanimentFlags.Salad) !== 0;
          selectedDishRow.requiresSide = (unmodifiedDishEntity.accompanimentRequired & RequiredAccompanimentFlags.Side) !== 0;
          selectedDishRow.requiresVeggie = (unmodifiedDishEntity.accompanimentRequired & RequiredAccompanimentFlags.Veggie) !== 0;
        }
        const clonedRows = cloneDeep(props.rows);
        debugger;
        // rows[selectedDishRowIndex] = selectedDishRow;
        props.onSetRows(clonedRows);

      }

    }

    setCurrentEditDish(null);
  };

  const handleUpdateDishName = (selectedDishRow: DishRow, dishName: string) => {
    selectedDishRow.name = dishName;
  };

  const updateSelectedRowProperty = (selectedDishRow: DishRow, propertyName: string, propertyValue: any): DishRow => {
    const clonedRows = cloneDeep(props.rows);
    const selectedDishRowIndex = dishIdToDishRowIndex[selectedDishRow.dish.id];
    const selectedRow: DishRow = clonedRows[selectedDishRowIndex];
    (selectedRow as any)[propertyName] = propertyValue;
    props.onSetRows(clonedRows);
    return selectedRow;
  };

  const handleUpdateDishType = (selectedDishRow: DishRow, updatedDishType: DishType) => {
    const selectedRow: DishRow = updateSelectedRowProperty(selectedDishRow, 'type', updatedDishType);
    setCurrentEditDish(selectedRow);
  };

  const handleUpdateMinimumInterval = (selectedDishRow: DishRow, minimumIntervalInput: string) => {
    const minimumInterval = parseInt(minimumIntervalInput, 10);
    const selectedRow: DishRow = updateSelectedRowProperty(selectedDishRow, 'minimumInterval', minimumInterval);
    setCurrentEditDish(selectedRow);
  };

  const handleToggleRequiresAccompaniment = (selectedDishRow: DishRow, requiresAccompaniment: boolean) => {
    const selectedRow: DishRow = updateSelectedRowProperty(selectedDishRow, 'requiresAccompaniment', requiresAccompaniment);
    setCurrentEditDish(selectedRow);
  };

  const handleToggleRequiresSalad = (selectedDishRow: DishRow, requiresSalad: boolean) => {
    const selectedRow: DishRow = updateSelectedRowProperty(selectedDishRow, 'requiresSalad', requiresSalad);
    setCurrentEditDish(selectedRow);
  };

  const handleToggleRequiresSide = (selectedDishRow: DishRow, requiresSide: boolean) => {
    const selectedRow: DishRow = updateSelectedRowProperty(selectedDishRow, 'requiresSide', requiresSide);
    setCurrentEditDish(selectedRow);
  };

  const handleToggleRequiresVeggie = (selectedDishRow: DishRow, requiresVeggie: boolean) => {
    const selectedRow: DishRow = updateSelectedRowProperty(selectedDishRow, 'requiresVeggie', requiresVeggie);
    setCurrentEditDish(selectedRow);
  };

  // Avoid a layout jump when reaching the last page with empty props.rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - props.rows.length) : 0;

  const accompanimentChoices = [
    {
      value: 'main',
      label: 'Main',
    },
    {
      value: 'salad',
      label: 'Salad',
    },
    {
      value: 'side',
      label: 'Side',
    },
    {
      value: 'veggie',
      label: 'Veggie',
    },
  ];


  const renderEditingRow = (row: DishRow) => {
    const isItemSelected = true;
    return (
      <TableRow
        hover
        role='checkbox'
        tabIndex={-1}
        // key={row.name}
        selected={isItemSelected}
      >
        <TableCell
          component='th'
          scope='row'
          padding='none'
          align='center'
        >
          <TextField
            sx={{ m: 1, maxHeight: '40px', marginTop: '12px' }}
            type='string'
            label='Dish name'
            defaultValue={row.name}
            variant='standard'
            onBlur={(event) => handleUpdateDishName(row, event.target.value)}
          />
        </TableCell>
        <TableCell
          padding='none'
          align='center'
        >
          <TextField
            id="dishTypeTextField"
            select
            label="Dish Type"
            SelectProps={{
              native: true,
            }}
            helperText="Please select your dish type"
            onChange={(event) => handleUpdateDishType(row, event.target.value as DishType)}
            placeholder={'Dish Type'}
            value={row.type}
          >
            {accompanimentChoices.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
        </TableCell>
        <TableCell>
          <TextField
            sx={{ m: 1, maxHeight: '40px', marginTop: '12px' }}
            type='number'
            label='Min interval'
            defaultValue={row.minimumInterval}
            variant='standard'
            onBlur={(event) => handleUpdateMinimumInterval(row, event.target.value)}
            InputProps={{
              inputProps: {
                min: 0
              }
            }}
          />

        </TableCell>
        <TableCell align='center'>
          <Checkbox
            color="primary"
            checked={row.requiresAccompaniment}
            onChange={(event) => handleToggleRequiresAccompaniment(row, event.target.checked)}
            disabled={row.type !== DishType.Main}
          />
        </TableCell>
        <TableCell align='center'>
          <Checkbox
            color="primary"
            checked={row.requiresSalad}
            onChange={(event) => handleToggleRequiresSalad(row, event.target.checked)}
            disabled={row.type !== DishType.Main || !row.requiresAccompaniment}
          />
        </TableCell>
        <TableCell align='center'>
          <Checkbox
            color="primary"
            checked={row.requiresSide}
            onChange={(event) => handleToggleRequiresSide(row, event.target.checked)}
            disabled={row.type !== DishType.Main || !row.requiresAccompaniment}
          />
        </TableCell>
        <TableCell align='center'>
          <Checkbox
            color="primary"
            checked={row.requiresVeggie}
            onChange={(event) => handleToggleRequiresVeggie(row, event.target.checked)}
            disabled={row.type !== DishType.Main || !row.requiresAccompaniment}
          />
        </TableCell>
        <TableCell align='center'>
          <Tooltip title="Save">
            <IconButton
              id={row.name}
              onClick={() => handleSaveClick()}
            >
              <SaveIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Cancel">
            <IconButton
              id={row.name}
              onClick={() => handleCancelClick()}
            >
              <CancelIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    );
  };

  const renderInactiveRow = (row: DishRow) => {
    const isItemSelected = false;
    return (
      <TableRow
        hover
        role='checkbox'
        tabIndex={-1}
        key={row.name}
        selected={isItemSelected}
      >
        <TableCell
          component='th'
          // id={labelId}
          scope='row'
          padding='none'
          align='center'
        >
          <TextField
            sx={{ m: 1, maxHeight: '40px', marginTop: '12px' }}
            type='string'
            label='Dish name'
            defaultValue={row.name}
            disabled
            variant='standard'
          />
        </TableCell>
        <TableCell
          // component='th'
          // id={labelId}
          // scope='row'
          // padding='none'
          padding='none'
          align='center'
        >
          <Select
            placeholder={'Dish Type'}
            value={row.type}
            disabled
          >
            <MenuItem value={'main'}>Main</MenuItem>
            <MenuItem value={'salad'}>Salad</MenuItem>
            <MenuItem value={'side'}>Side</MenuItem>
            <MenuItem value={'veggie'}>Veggie</MenuItem>
          </Select>
        </TableCell>

        <TableCell>
          <TextField
            sx={{ m: 1, maxHeight: '40px', marginTop: '12px' }}
            type='number'
            label='Min interval'
            defaultValue={row.minimumInterval}
            disabled
            variant='standard'
          />
        </TableCell>

        <TableCell align='center'>
          <Checkbox
            color="primary"
            checked={row.requiresAccompaniment}
            disabled
          />
        </TableCell>
        <TableCell align='center'>
          <Checkbox
            color="primary"
            checked={row.requiresSalad}
            disabled
          />
        </TableCell>
        <TableCell align='center'>
          <Checkbox
            color="primary"
            checked={row.requiresSide}
            disabled
          />
        </TableCell>
        <TableCell align='center'>
          <Checkbox
            color="primary"
            checked={row.requiresVeggie}
            disabled
          />
        </TableCell>
        <TableCell align='center'>
          <Tooltip title="Edit">
            <IconButton
              id={row.name}
              onClick={() => handleEditClick(row)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Assign Ingredients to Dish">
            <IconButton
              id={row.name}
              onClick={() => handleAssignIngredientsToDish(row)}
            >
              <LocalGroceryStoreIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              id={row.name}
              onClick={() => handleDeleteClick(row)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    );
  };

  // TEDTODO - only invoke this when necesssary
  const buildDishIdToDishRowIndex = () => {
    dishIdToDishRowIndex = {};
    for (let index = 0; index < props.rows.length; index++) {
      dishIdToDishRowIndex[props.rows[index].dish.id] = index;
    }
  };

  const renderSortedTableContents = () => {
    buildDishIdToDishRowIndex();
    const sortedDishes: DishRow[] = props.rows;
    // const sortedDishes: DishRow[] = rows.slice().sort(getComparator(order, orderBy));
    const pagedSortedDishes = sortedDishes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    return (
      <React.Fragment>
        {pagedSortedDishes
          .map((row: DishRow, index: number) => {
            let renderedRow;
            if (!isNil(currentEditDish) && currentEditDish.dish.id === row.dish.id) {
              renderedRow = renderEditingRow(row);
            } else {
              renderedRow = renderInactiveRow(row);
            }
            return renderedRow;
          })}
      </React.Fragment>
    );
  };

  return (
    <div>
      <AssignIngredientsToDishDialog
        open={showAssignIngredientsToDish}
        dishId={dishId}
        onClose={handleCloseAssignIngredientsToDish}
      />
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
              <DishesTableHead
                order={order}
                orderBy={orderBy}
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
    </div>);
};

function mapStateToProps(state: any) {
  return {
    dishes: getDishes(state),
    rows: getDishRows(state),
    uiState: getUiState(state),
  };
}

const mapDispatchToProps = (dispatch: MealWheelDispatch) => {
  return bindActionCreators({
    onAddDish: addDish,
    onUpdateDish: updateDish,
    onDeleteDish: deleteDish,
    onSortDishes: sortDishes,
    onSetRows: setRows,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Dishes);
