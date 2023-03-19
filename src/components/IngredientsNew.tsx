import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { cloneDeep, isNil } from 'lodash';

import MWTable from './MWTable';

import { addIngredient, updateIngredient, deleteIngredient, sortIngredientsAndSetRows } from '../controllers';
import { MealWheelDispatch, sortIngredients, setIngredientRows, setCurrentEditIngredient, setIngredientSortOrder, setIngredientSortBy } from '../models';
import { getIngredients, getIngredientRows, getCurrentEditIngredient, getUiState, getIngredientSortOrder, getIngredientSortBy } from '../selectors';
import { IngredientRow, IngredientEntity, Order, UiState } from '../types';

interface HeadCell {
  disablePadding: boolean;
  id: keyof IngredientRow;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
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


export interface IngredientsNewProps {
  currentEditIngredient: IngredientRow | null,
  ingredients: IngredientEntity[];
  rows: IngredientRow[];
  onAddIngredient: (ingredient: IngredientEntity) => any;
  onUpdateIngredient: (id: string, ingredient: IngredientEntity) => any;
  sortOrder: Order;
  sortBy: string;
  uiState: UiState;
  onDeleteIngredient: (id: string) => any;
  onSortIngredientsAndSetRows: (sortOrder: Order, sortBy: string) => any;
  onSortIngredients: (sortOrder: Order, sortBy: string) => any;
  onSetRows: (rows: IngredientRow[]) => any;
  onSetCurrentEditIngredient: (currentEditIngredient: IngredientRow | null) => any;
  onSetSortOrder: (sortOrder: Order) => any;
  onSetSortBy: (sortBy: string) => any;
}

const IngredientsNew = (props: IngredientsNewProps) => {

  const handleUpdateItem = (id: string, item: any) => {
    console.log('handleUpdateItem: ', item);
  };

  interface IdToNumberMap {
    [id: string]: number;
  }

  const handleSave = (ingredientIdToIngredientRowIndex: IdToNumberMap) => {
    debugger;
    console.log('handleSave');
    if (!isNil(props.currentEditIngredient)) {

      // implement separate function to check for other errors
      //   // check for duplicate ingredient names.
      //   const updatedIngredientName = props.currentEditIngredient.name;
      //   for (let ingredientIndex = 0; ingredientIndex < props.ingredients.length; ingredientIndex++) {
      //     const existingIngredient: IngredientEntity = props.ingredients[ingredientIndex];
      //     if (props.currentEditIngredient.ingredient.id !== existingIngredient.id && existingIngredient.name === updatedIngredientName) {
      //       setSnackbar({ children: 'Error while saving ingredient: duplicate ingredient name', severity: 'error' });
      //       return;
      //     }
      //   }

      if (props.currentEditIngredient.ingredient.id === '') {
        const newIngredient: IngredientEntity = {
          id: '',
          userId: '',
          name: props.currentEditIngredient.name,
          showInGroceryList: props.currentEditIngredient.showInGroceryList,
          ingredients: [],
        };
        props.onAddIngredient(newIngredient)
          .then((newIngredientId: string) => {
            const selectedIngredientRowIndex = ingredientIdToIngredientRowIndex[''];
            if (selectedIngredientRowIndex !== -1) {
              const clonedRows = cloneDeep(props.rows);
              const selectedRow: IngredientRow = clonedRows[selectedIngredientRowIndex];
              selectedRow.ingredient.id = newIngredientId;

              // auto add new row
              const ingredient: IngredientEntity = handleGetDefaultItem();
              const ingredientRow: IngredientRow = handleGetDefaultItemRow(ingredient);

              clonedRows.unshift(ingredientRow);
              // following call updates id in row that was just saved and adds a new row
              props.onSetRows(clonedRows);

              props.onSetCurrentEditIngredient(ingredientRow);
            }
          });
      } else {
        const updatedIngredient: IngredientEntity = cloneDeep(props.currentEditIngredient.ingredient);
        updatedIngredient.name = props.currentEditIngredient.name;
        updatedIngredient.showInGroceryList = props.currentEditIngredient.showInGroceryList;
        props.onUpdateIngredient(props.currentEditIngredient.ingredient.id, updatedIngredient);
      }
      props.onSetCurrentEditIngredient(null);
    }
  };

  const handleDeleteItem = (id: string) => {
    console.log('handleDeleteItem: ', id);
  };

  const handleSortItemsAndRows = (sortOrder: Order, sortBy: string) => {
    console.log('handleSortItemsAndRows: ', sortOrder, sortBy);
    props.onSortIngredientsAndSetRows(sortOrder, sortBy);
  };

  const handleSortItems = (sortOrder: Order, sortBy: string) => {
    console.log('handleSortItems: ', sortOrder, sortBy);
    props.onSortIngredients(sortOrder, sortBy);
  };

  const handleSetRows = (rows: IngredientRow[]) => {
    console.log('handleSetRows: ', rows);
    props.onSetRows(rows);
  };

  const handleSetCurrentEditItem = (currentEditItem: IngredientRow | null) => {
    console.log('handleSetCurrentEditItem: ', currentEditItem);
    props.onSetCurrentEditIngredient(currentEditItem);
  };

  const handleSetSortOrder = (sortOrder: Order) => {
    console.log('handleSetSortOrder: ', sortOrder);
    props.onSetSortOrder(sortOrder);
  };

  const handleSetSortBy = (sortBy: string) => {
    console.log('handleSetSortBy: ', sortBy);
    props.onSetSortBy(sortBy);
  };

  const handleGetItems = (): IngredientEntity[] => {
    console.log('handleGetItems: ');
    return props.ingredients;
  };

  const handleGetDefaultItem = (): IngredientEntity => {
    console.log('handleUpdateItem: ');
    const ingredient: IngredientEntity = {
      id: '',
      userId: '',
      name: '',
      showInGroceryList: true,
      ingredients: [],
    };
    return ingredient;
  };

  const handleGetDefaultItemRow = (ingredient: IngredientEntity) => {
    console.log('handleGetDefaultItemRow: ', ingredient);
    const ingredientRow: IngredientRow = {
      ingredient,
      name: '',
      id: '',
      showInGroceryList: true,
    };

    return ingredientRow;
  };

  const handleSetCurrentEditItemRow = (item: IngredientRow) => {
    console.log('handleSetCurrentEditItemRow: ', item);
    props.onSetCurrentEditIngredient(item);
  };

  const getRows = (): IngredientRow[] => {
    const rows: IngredientRow[] = props.ingredients.map((ingredient: IngredientEntity) => {
      const row: IngredientRow = {
        ingredient,
        name: ingredient.name,
        id: ingredient.id,
        showInGroceryList: ingredient.showInGroceryList,
      };
      return row;
    });
    return rows;
  };

  const handleGetRows = () => {
    console.log('handleGetRows: ');
    const rows: IngredientRow[] = getRows();
    return rows;
  };

  const rowIds: string[] = props.rows.map((row: IngredientRow) => {
    return row.ingredient.id;
  });

  return (
    <MWTable
      headCells={headCells}
      currentEditItemRow={props.currentEditIngredient}
      items={props.ingredients}
      rows={props.rows}
      rowIds={rowIds}
      myUIState={UiState.Ingredients}
      sortOrder={'asc'}
      sortBy={'name'}
      onUpdateItem={handleUpdateItem}
      onDeleteItem={handleDeleteItem}
      onSortItemsAndSetRows={handleSortItemsAndRows}
      onSortItems={handleSortItems}
      onSetRows={handleSetRows}
      onSetCurrentEditItem={handleSetCurrentEditItem}
      onSetSortOrder={handleSetSortOrder}
      onSetSortBy={handleSetSortBy}
      onGetItems={handleGetItems}
      onGetDefaultItem={handleGetDefaultItem}
      onGetDefaultItemRow={handleGetDefaultItemRow}
      onSetCurrentEditItemRow={handleSetCurrentEditItemRow}
      onGetRows={handleGetRows}
      onSave={handleSave}
    />
  );
};

function mapStateToProps(state: any) {
  return {
    ingredients: getIngredients(state),
    rows: getIngredientRows(state),
    currentEditIngredient: getCurrentEditIngredient(state),
    uiState: getUiState(state),
    sortOrder: getIngredientSortOrder(state),
    sortBy: getIngredientSortBy(state),
  };
}

const mapDispatchToProps = (dispatch: MealWheelDispatch) => {
  return bindActionCreators({
    onAddIngredient: addIngredient,
    onUpdateIngredient: updateIngredient,
    onDeleteIngredient: deleteIngredient,
    onSortIngredients: sortIngredients,
    onSetRows: setIngredientRows,
    onSetCurrentEditIngredient: setCurrentEditIngredient,
    onSetSortOrder: setIngredientSortOrder,
    onSetSortBy: setIngredientSortBy,
    onSortIngredientsAndSetRows: sortIngredientsAndSetRows,

  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(IngredientsNew);
