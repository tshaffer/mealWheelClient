import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const MealSchedule = () => {
  return (
    <div>MealSchedule</div>
  );
}

function mapStateToProps(state: any) {
  return {
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MealSchedule);
