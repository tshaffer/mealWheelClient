import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import type { CSSProperties } from 'react';
import { useDrop } from 'react-dnd';

const style: CSSProperties = {
  height: '12rem',
  width: '12rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  color: 'white',
  padding: '1rem',
  textAlign: 'center',
  fontSize: '1rem',
  lineHeight: 'normal',
  float: 'left',
};


export interface DroppableDateInScheduleProps {
  dateInSchedule: Date;
  accept: string[]
  lastDroppedItem?: any
  onDrop: (item: any) => void
}

function DroppableDateInSchedule(props: DroppableDateInScheduleProps) {

  const { accept, lastDroppedItem, onDrop } = props;

  const [{ isOver, canDrop }, drop] = useDrop({
    // accept,
    accept: 'draggableMeal',
    drop: onDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = isOver && canDrop;
  let backgroundColor = '#222';
  if (isActive) {
    backgroundColor = 'darkgreen';
  } else if (canDrop) {
    backgroundColor = 'darkkhaki';
  }

  return (
    <div ref={drop} style={{ ...style, backgroundColor }}>
      {props.dateInSchedule.toDateString()}
      {/* {isActive
        ? 'Release to drop'
        : `This dustbin accepts: ${accept.join(', ')}`}

      {lastDroppedItem && (
        <p>Last dropped: {JSON.stringify(lastDroppedItem)}</p>
      )} */}
    </div>
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


export default connect(mapStateToProps, mapDispatchToProps)(DroppableDateInSchedule);

