import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { cloneDeep, isNil } from 'lodash';

import MWTable from './MWTable';
import { DishEntity, DishRow, DishType, Order, UiState } from '../types';
import { MealWheelDispatch } from '../models';

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

export interface DishesNewProps {
  currentEditDish: DishRow | null,
  dishes: DishEntity[];
  rows: DishRow[];
  onAddDish: (dish: DishEntity) => any;
  onUpdateDish: (id: string, dish: DishEntity) => any;
  sortOrder: Order;
  sortBy: string;
  uiState: UiState;
  onDeleteDish: (id: string) => any;
  onSortDishesAndSetRows: (sortOrder: Order, sortBy: string) => any;
  onSortDishes: (sortOrder: Order, sortBy: string) => any;
  onSetRows: (rows: DishRow[]) => any;
  onSetCurrentEditDish: (currentEditDish: DishRow | null) => any;
  onSetSortOrder: (sortOrder: Order) => any;
  onSetSortBy: (sortBy: string) => any;

  
}

const DishesNew = (props: DishesNewProps) => {

  const handleUpdateItem = (id: string, item: any) => {
    console.log('handleUpdateItem: ', item);
  };

  interface IdToNumberMap {
    [id: string]: number;
  }

  const handleSave = (ingredientIdToDishRowIndex: IdToNumberMap) => {
    debugger;
    console.log('handleSave');
  };

  const handleDeleteItem = (id: string) => {
    console.log('handleDeleteItem: ', id);
  };

  const handleSortItemsAndRows = (sortOrder: Order, sortBy: string) => {
    console.log('handleSortItemsAndRows: ', sortOrder, sortBy);
    props.onSortDishesAndSetRows(sortOrder, sortBy);
  };

  const handleSortItems = (sortOrder: Order, sortBy: string) => {
    console.log('handleSortItems: ', sortOrder, sortBy);
    props.onSortDishes(sortOrder, sortBy);
  };

  const handleSetRows = (rows: DishRow[]) => {
    console.log('handleSetRows: ', rows);
    props.onSetRows(rows);
  };

  const handleSetCurrentEditItem = (currentEditItem: DishRow | null) => {
    console.log('handleSetCurrentEditItem: ', currentEditItem);
    props.onSetCurrentEditDish(currentEditItem);
  };

  const handleSetSortOrder = (sortOrder: Order) => {
    console.log('handleSetSortOrder: ', sortOrder);
    props.onSetSortOrder(sortOrder);
  };

  const handleSetSortBy = (sortBy: string) => {
    console.log('handleSetSortBy: ', sortBy);
    props.onSetSortBy(sortBy);
  };

  const handleGetItems = (): DishEntity[] => {
    console.log('handleGetItems: ');
    return props.dishes;
  };

  const handleGetDefaultItem = (): DishEntity => {
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
    return dish;
  };

  const handleGetDefaultItemRow = (dish: DishEntity): DishRow => {
    
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

    return dishRow;
  };


  return (
    <div>foo</div>
  );
};

function mapStateToProps(state: any) {
  return {
  //   dishes: getDishes(state),
  //   rows: getDishRows(state),
  //   currentEditDish: getCurrentEditDish(state),
  //   uiState: getUiState(state),
  //   sortOrder: getDishSortOrder(state),
  //   sortBy: getDishSortBy(state),
  };
}

const mapDispatchToProps = (dispatch: MealWheelDispatch) => {
  return bindActionCreators({
    // onAddDish: addDish,
    // onUpdateDish: updateDish,
    // onDeleteDish: deleteDish,
    // onSortDishes: sortDishes,
    // onSetRows: setDishRows,
    // onSetCurrentEditDish: setCurrentEditDish,
    // onSetSortOrder: setDishSortOrder,
    // onSetSortBy: setDishSortBy,
    // onSortDishesAndSetRows: sortDishesAndSetRows,

  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(DishesNew);

