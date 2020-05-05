import React from 'react';
import { boolean, number, select } from '@storybook/addon-knobs';
import README from './README.md';
import Move from 'src/index';
import './style.scss';

class MoveData extends React.Component {
  render() {
    return (
      <div className="demo-move">
        <Move {...this.props}>
          <div className="111" style={{ width: '100px', height: '100px', backgroundColor: '#ccc' }}>
            1111
          </div>
        </Move>
      </div>
    );
  }
}

export default function MoveDemo() {
  return (
    <MoveData
      scalable={boolean('scalable', true)}
      monitorWindowResize={boolean('monitorWindowResize', true)}
      minScalable={number('minScalable', 1)}
      maxScalable={number('maxScalable', 2)}
      horizontalPlacement={select('horizontalPlacement', ['left', 'center', 'right'], 'left')}
      verticalPlacement={select('verticalPlacement', ['top', 'center', 'bottom'], 'top')}
    />
  );
}

export const moveDoc = README;
