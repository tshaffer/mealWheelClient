import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

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

import { MealWheelDispatch } from '../models';
import {
  DishEntity,
  DishRow,
  IngredientEntity,
  IngredientRow,
  Order,
  UiState
} from '../types';
import { isNil } from 'lodash';
import { sortIngredientsAndSetRows } from '../controllers';

export interface MWTableProps<ItemEntity, ItemRow> {
  uiState: UiState;
  items: ItemEntity[];
  currentEditItemRow: ItemRow;
  rows: ItemRow[];
  sortOrder: Order;
  sortBy: string;
  onAddItem: (item: ItemEntity) => any;
  onUpdateItem: (id: string, item: ItemEntity) => any;
  onDeleteItem: (id: string) => any;
  onSetSortOrder: (sortOrder: Order) => any;
  onSetSortBy: (sortBy: string) => any;
  onSortItemsAndSetRows: (sortOrder: Order, sortBy: string) => any;
  onSortItems: (sortOrder: Order, sortBy: string) => any;
  onSetRows: (rows: ItemRow[]) => any;
  onSetCurrentEditItemRow: (currentEditItem: ItemRow | null) => any;
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

interface TableProps<ItemEntity> {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof ItemEntity) => void;
  order: Order;
  orderBy: string;
}

const MWTableHead = (props: TableProps<DishEntity | IngredientEntity>) => {

  const { order, orderBy, onRequestSort } =
    props;

  const createSortHandler =
    // (property: keyof ItemEntity) => (event: React.MouseEvent<unknown>) => {
    (property: keyof (DishRow | IngredientRow)) => (event: React.MouseEvent<unknown>) => {
      // (property: (keyof DishRow) | (keyof IngredientRow)) => (event: React.MouseEvent<unknown>) => {
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

// const MWTable = (props: MWTableProps<DishEntity | IngredientEntity, DishRow | IngredientRow>) => {
function MWTable<ItemEntity, ItemRow>(props: MWTableProps<ItemEntity, ItemRow>) {

  const [itemEntityNameInRow, setItemEntityNameInRow] = React.useState<any>(null);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [snackbar, setSnackbar] = React.useState<Pick<AlertProps, 'children' | 'severity'> | null>(null);

  React.useEffect(() => {
    if (props.uiState === UiState.Ingredients) {
      const newRows: ItemRow[] = getRows();
      props.onSetRows(newRows);
    }
  }, [props.uiState]);

  React.useEffect(() => {
    if (!isNil(itemEntityNameInRow)) {
      const byTagNameResults = itemEntityNameInRow.getElementsByTagName('input');
      const nameField = byTagNameResults[0];
      nameField.focus();
    }
  }, [itemEntityNameInRow]);

  interface IdToNumberMap {
    [id: string]: number;
  }

  const itemEntityIdToItemRowIndex: IdToNumberMap = {};

  const getRows = (): ItemRow[] => {
    const rows: ItemRow[] = props.items.map((itemEntity: ItemEntity) => {
      const row: ItemRow = {
        itemEntity,
        name: itemEntity.name,
        showInGroceryList: itemEntity.showInGroceryList,
      };
      return row;
    });
    return rows;
  };

  const handleCloseSnackbar = () => setSnackbar(null);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof ItemRow,
  ) => {
    const isAsc = props.sortBy === property && props.sortOrder === 'asc';
    const sortOrder: Order = isAsc ? 'desc' : 'asc';
    props.onSetSortOrder(sortOrder);
    props.onSetSortBy(property);
    props.onSortItemsAndSetRows(sortOrder, property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getDefaultIngredientEntity = (): IngredientEntity => {
    const ingredient: IngredientEntity = {
      id: '',
      userId: '',
      name: '',
      showInGroceryList: true,
      ingredients: [],
    };
    return ingredient;
  };

  const getDefaultIngredientRow = (ingredient: IngredientEntity): IngredientRow => {

    const ingredientRow: IngredientRow = {
      ingredient,
      name: '',
      showInGroceryList: true,
    };

    return ingredientRow;
  };


  return (
    <div>pizza</div>
  );
};

function mapStateToProps(state: any) {
  return {
    items: [],
  };
}

const mapDispatchToProps = (dispatch: MealWheelDispatch) => {
  return bindActionCreators({
    onSortItemsAndSetRows: sortIngredientsAndSetRows,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MWTable);
