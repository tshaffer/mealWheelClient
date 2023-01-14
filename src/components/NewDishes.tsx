import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addDish, updateDish } from '../controllers';
import { getDishes } from '../selectors';
import { DishEntity, DishType, RequiredAccompanimentFlags } from '../types';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import Select from '@mui/material/Select';

import { cloneDeep, isNil } from 'lodash';
import MenuItem from '@mui/material/MenuItem';

interface DishRow {
  dish: DishEntity;
  name: string;
  type: DishType;
  requiresAccompaniment: boolean;
  requiresSalad: boolean;
  requiresSide: boolean;
  requiresVeggie: boolean;
}

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
  a: { [key in Key]: boolean | string | DishEntity },
  b: { [key in Key]: boolean | string | DishEntity },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
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
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof DishRow) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

const initialRows: DishRow[] = [];

export interface NewDishesProps {
  dishes: DishEntity[];
  onAddDish: (dish: DishEntity) => any;
  onUpdateDish: (id: string, dish: DishEntity) => any;

  // onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;

}

const DishesTableHead = (props: TableProps) => {

  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;

  const createSortHandler =
    (property: keyof DishRow) => (event: React.MouseEvent<unknown>) => {
      props.onRequestSort(event, property);
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

const NewDishes = (props: NewDishesProps) => {

  const [rowsRead, setRowsRead] = React.useState(false);
  const [rows, setRows] = React.useState<DishRow[]>(initialRows);
  const [currentEditDish, setCurrentEditDish] = React.useState<DishRow | null>(null);
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof DishRow>('name');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(75);
  const [addingDish, setAddingDish] = React.useState<boolean>(false);

  const mainOption = { value: 'main', label: 'Main' };
  const saladOption = { value: 'salad', label: 'Salad' };
  const sideOption = { value: 'side', label: 'Side' };
  const vegOption = { value: 'veggie', label: 'Veggie' };
  const dishTypeOptions = [mainOption, saladOption, sideOption, vegOption];

  const getRows = (): DishRow[] => {
    const rows: DishRow[] = props.dishes.map((dish: DishEntity) => {
      const requiresSide: boolean = isNil(dish.accompanimentRequired) ? false : (dish.accompanimentRequired & RequiredAccompanimentFlags.Side) !== 0;
      const requiresSalad = isNil(dish.accompanimentRequired) ? false : (dish.accompanimentRequired & RequiredAccompanimentFlags.Salad) !== 0;
      const requiresVeggie = isNil(dish.accompanimentRequired) ? false : (dish.accompanimentRequired & RequiredAccompanimentFlags.Veggie) !== 0;
      const row: DishRow = {
        dish,
        name: dish.name,
        type: dish.type,
        requiresAccompaniment: !isNil(dish.accompanimentRequired) && dish.accompanimentRequired !== RequiredAccompanimentFlags.None,
        requiresSide,
        requiresSalad,
        requiresVeggie,
      };
      return row;
    });
    return rows;
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof DishRow,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleEditClick = (dishEntityData: DishRow) => {
    setCurrentEditDish(dishEntityData);
  };

  const handleDeleteClick = (dishEntityData: DishRow) => {
    console.log('Delete ' + dishEntityData.dish.id);
    setCurrentEditDish(null);
  };

  const handleSaveClick = () => {
    if (!isNil(currentEditDish)) {
      if (addingDish) {
        // props.onAddDish(dish);
        console.log('add dish');
      } else {
        const updatedDish: DishEntity = cloneDeep(currentEditDish.dish);
        updatedDish.name = currentEditDish.name;
        updatedDish.type = currentEditDish.type;
        switch (currentEditDish.type) {
          case DishType.Main: {
            let accompanimentValue: RequiredAccompanimentFlags = RequiredAccompanimentFlags.None;
            if (currentEditDish.requiresSalad) {
              accompanimentValue = RequiredAccompanimentFlags.Salad;
            }
            if (currentEditDish.requiresSide) {
              accompanimentValue += RequiredAccompanimentFlags.Side;
            }
            if (currentEditDish.requiresVeggie) {
              accompanimentValue += RequiredAccompanimentFlags.Veggie;
            }
            updatedDish.accompanimentRequired = accompanimentValue;
            break;
          }
          case DishType.Salad:
          case DishType.Side:
          case DishType.Veggie:
            updatedDish.accompanimentRequired = RequiredAccompanimentFlags.None;
            break;
        }
        props.onUpdateDish(currentEditDish.dish.id, updatedDish);
      }
      setCurrentEditDish(null);
    }
  };

  const handleCancelClick = () => {
    setCurrentEditDish(null);
  };

  const handleUpdateDishType = (selectedDishRow: DishRow, updatedDishType: DishType) => {

    // get index of row getting edited.
    let selectedIndex = -1;
    const id = selectedDishRow.dish.id;
    rows.forEach((row, index) => {
      if (row.dish.id === id) {
        selectedIndex = index;
      }
    });

    if (selectedIndex !== -1) {
      const newRows = cloneDeep(rows);
      const selectedRow: DishRow = newRows[selectedIndex];
      selectedRow.type = updatedDishType;
      setRows(newRows);

      setCurrentEditDish(selectedRow);
    }
  };

  const handleToggleRequiresAccompaniment = (event: any) => {
    console.log('handleToggleRequiresAccompaniment');
    console.log(event.target.checked);
  };

  const handleToggleRequiresSalad = (event: any) => {
    console.log('handleToggleRequiresSalad');
    console.log(event.target.checked);
  };

  const handleToggleRequiresSide = (event: any) => {
    console.log('handleToggleRequiresSide');
    console.log(event.target.checked);
  };

  const handleToggleRequiresVeggie = (event: any) => {
    console.log('handleToggleRequiresVeggie');
    console.log(event.target.checked);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const newRows: DishRow[] = getRows();
  if (!rowsRead && newRows.length > 0) {
    setRowsRead(true);
    setRows(newRows);
  }

  const renderEditingRow = (row: DishRow) => {
    const isItemSelected = true;
    return (
      <TableRow
        hover
        onClick={(event) => handleClick(event, row.name)}
        role='checkbox'
        aria-checked={isItemSelected}
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
            value={row.name}
            variant='standard'
          // onChange={(event) => setDishName(event.target.value)}
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
            onChange={(event) => handleUpdateDishType(row, event.target.value as DishType)}
            placeholder={'Dish Type'}
            value={row.type}
          >
            <MenuItem value={'main'}>Main</MenuItem>
            <MenuItem value={'salad'}>Salad</MenuItem>
            <MenuItem value={'side'}>Side</MenuItem>
            <MenuItem value={'veggie'}>Veggie</MenuItem>
          </Select>
        </TableCell>
        <TableCell align='center'>
          <Checkbox
            color="primary"
            checked={row.requiresAccompaniment}
            onChange={handleToggleRequiresAccompaniment}
          />
        </TableCell>
        <TableCell align='center'>
          <Checkbox
            color="primary"
            checked={row.requiresSalad}
            onChange={handleToggleRequiresSalad}
          />
        </TableCell>
        <TableCell align='center'>
          <Checkbox
            color="primary"
            checked={row.requiresSide}
            onChange={handleToggleRequiresSide}
          />
        </TableCell>
        <TableCell align='center'>
          <Checkbox
            color="primary"
            checked={row.requiresVeggie}
            onChange={handleToggleRequiresVeggie}
          />
        </TableCell>
        <TableCell align='center'>
          <IconButton
            id={row.name}
            onClick={() => handleSaveClick()}
          >
            <SaveIcon />
          </IconButton>
          <IconButton
            id={row.name}
            onClick={() => handleCancelClick()}
          >
            <CancelIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  };


  const renderInactiveRow = (row: DishRow) => {
    const isItemSelected = false;
    return (
      <TableRow
        hover
        onClick={(event) => handleClick(event, row.name)}
        role='checkbox'
        aria-checked={isItemSelected}
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
            value={row.name}
            disabled
            variant='standard'
          // onChange={(event) => setDishName(event.target.value)}
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
        <TableCell align='center'>
          <Checkbox
            color="primary"
            checked={row.requiresAccompaniment}
            onChange={handleToggleRequiresAccompaniment}
            disabled
          />
        </TableCell>
        <TableCell align='center'>
          <Checkbox
            color="primary"
            checked={row.requiresSalad}
            onChange={handleToggleRequiresSalad}
            disabled
          />
        </TableCell>
        <TableCell align='center'>
          <Checkbox
            color="primary"
            checked={row.requiresSide}
            onChange={handleToggleRequiresSide}
            disabled
          />
        </TableCell>
        <TableCell align='center'>
          <Checkbox
            color="primary"
            checked={row.requiresVeggie}
            onChange={handleToggleRequiresVeggie}
            disabled
          />
        </TableCell>
        <TableCell align='center'>
          <IconButton
            id={row.name}
            onClick={() => handleEditClick(row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            id={row.name}
            onClick={() => handleDeleteClick(row)}
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        {/* Toolbar that includes Add Dish button? */}
        <Table
          sx={{ minWidth: 750 }}
          size={'small'}
        >

          <DishesTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
          />
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row: DishRow, index) => {
                // const isItemSelected = isSelected(row.name);
                // const labelId = `enhanced-table-checkbox-${index}`;
                let renderedRow;
                if (!isNil(currentEditDish) && currentEditDish.dish.id === row.dish.id) {
                  renderedRow = renderEditingRow(row);
                } else {
                  renderedRow = renderInactiveRow(row);
                }
                return renderedRow;
              })}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: (dense ? 33 : 53) * emptyRows,
                }}
              >
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
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

export default connect(mapStateToProps, mapDispatchToProps)(NewDishes);
