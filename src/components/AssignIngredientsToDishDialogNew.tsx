import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DishEntity } from '../types';
import { addIngredientToDish, replaceIngredientInDish, deleteIngredientFromDish } from '../controllers';
import { MealWheelDispatch } from '../models';
import { getDishById, getIngredients, getIngredientsByDish } from '../selectors';

export interface AssignIngredientsToDishDialogNewPropsFromParent {
  open: boolean;
  dishId: string;
  onClose: () => void;
}

export interface AssignIngredientsToDishNewDialogProps extends AssignIngredientsToDishDialogNewPropsFromParent {
  dish: DishEntity | null;
}

function AssignIngredientsToDishNewDialog(props: AssignIngredientsToDishNewDialogProps) {
  return (
    <div>poo</div>
  );
}

function mapStateToProps(state: any, ownProps: AssignIngredientsToDishDialogNewPropsFromParent) {
  return {
    dish: getDishById(state, ownProps.dishId),
    allIngredients: getIngredients(state),
    ingredientsInDish: getIngredientsByDish(state, ownProps.dishId),
  };
}

const mapDispatchToProps = (dispatch: MealWheelDispatch) => {
  return bindActionCreators({
    onAddIngredientToDish: addIngredientToDish,
    onReplaceIngredientInDish: replaceIngredientInDish,
    onDeleteIngredientFromDish: deleteIngredientFromDish,
  }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(AssignIngredientsToDishDialogNew);

