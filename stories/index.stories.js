// import React from 'react';
// import Vconsole from 'vconsole';

import './base.scss';
import './markdown.scss';
import { addNewStories } from './utils';
import MoveDemo, { moveDoc } from './move';

addNewStories('数据展示型组件', [
  {
    name: 'Move',
    component: MoveDemo,
    doc: moveDoc,
    inline: false
  }
]);
