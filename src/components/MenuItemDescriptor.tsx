import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { isNil } from 'lodash';

import { AccompanimentTypeNameById, DishEntity, MealEntity } from '../types';
import { MealWheelDispatch } from '../models';
import { getAccompanimentTypeNamesById } from '../selectors';

export interface MenuItemPropsFromParent {
  meal: MealEntity;
}

export interface MenuItemProps extends MenuItemPropsFromParent {
  accompanimentTypeNameById: AccompanimentTypeNameById;
}

const MenuItemDescriptor = (props: MenuItemProps) => {

  const { meal } = props;

  const getAccompanimentLabel = (accompanimentTypeEntityId: string): string => {
    return props.accompanimentTypeNameById[accompanimentTypeEntityId];
  };

  const renderDish = (dishEntity: DishEntity, dishLabel: string, insertBreak: boolean): JSX.Element => {
    return (
      <React.Fragment>
        {insertBreak ? (<br />) : null}
        {dishLabel + ': ' + dishEntity.name}
      </React.Fragment>
    );
  };

  const renderAccompaniments = (): JSX.Element[] => {
    if (!isNil(meal.accompanimentDishes)) {
      const accompaniments = meal.accompanimentDishes.map((accompanimentDish: DishEntity) => {
        const accompanimentLabel = getAccompanimentLabel(accompanimentDish.dishType);
        return renderDish(accompanimentDish, accompanimentLabel, true);
      });
      return accompaniments;
    }
    return [];
  };

  const accompaniments: JSX.Element[] = renderAccompaniments();

  return (
    <div key={meal.id}>
      {renderDish(meal.mainDish, 'Main', false)}
      {accompaniments}
    </div>
  );
};

function mapStateToProps(state: any, ownProps: MenuItemPropsFromParent) {
  return {
    accompanimentTypeNameById: getAccompanimentTypeNamesById(state),
  };
}

const mapDispatchToProps = (dispatch: MealWheelDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuItemDescriptor);

