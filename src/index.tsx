import React from 'react';
import * as ReactIs from 'react-is';
import classNames from 'classnames';
import addEventListener, { ListenerEventHandler } from './addEventListener';
import {
  Position,
  getDistance,
  getInitElementPlacement,
  isTouchScreen,
  getElementSize
} from './utils';
import throttleWithRAF from './throttleWithRAF';

export interface MoveProps {
  children: React.ReactElement;
  name?: string;
  scalable?: boolean;
  monitorWindowResize?: boolean;
  minScalable?: number;
  maxScalable?: number;
  horizontalPlacement?: 'left' | 'center' | 'right';
  verticalPlacement?: 'top' | 'center' | 'bottom';
  onAfterChange?: (name?: string) => void;
}

const defaultPosition: Readonly<Position> = {
  x: 0,
  y: 0
};

export default class Move extends React.Component<MoveProps, any> {
  readonly prefixCls = 'ab-move';

  static defaultProps = {
    scalable: true,
    monitorWindowResize: true,
    minScalable: 1,
    maxScalable: 2,
    horizontalPlacement: 'left',
    verticalPlacement: 'top'
  };

  prevElementSize = { width: 0, height: 0 };
  elementSize = { width: 0, height: 0 };
  elementParentSize = { width: 0, height: 0 };
  startObj = { ...defaultPosition };
  prevObj = { ...defaultPosition };
  currentObj = { ...defaultPosition };
  moveObj = { ...defaultPosition };

  prevScaleSize = 1;
  currentScaleSize = 1;
  scaleStart = 0;
  scaleEnd = 0;

  isTouchScale = false;
  // 强制刷新元素位置
  isForceUpdatePlacement = false;

  moveRef = React.createRef<HTMLElement>();

  resizeHandler: ListenerEventHandler | null;
  startHandler: ListenerEventHandler | null;
  moveHandler: ListenerEventHandler | null;
  endHandler: ListenerEventHandler | null;

  updateTimer = null;

  constructor(props) {
    super(props);
  }

  componentDidMount(): void {
    this.isForceUpdatePlacement = true;
    this.componentDidUpdate();
  }
  componentDidUpdate(prevProps?: MoveProps) {
    clearTimeout(this.updateTimer);
    const element = this.getDomNode();
    if (!element) {
      return;
    }
    const parentNode = element.parentNode as HTMLElement;
    if (!parentNode) {
      return;
    }

    parentNode.style.overflow = 'hidden';

    const { horizontalPlacement, verticalPlacement } = this.props;
    if (
      prevProps &&
      (horizontalPlacement !== prevProps.horizontalPlacement ||
        verticalPlacement !== prevProps.verticalPlacement)
    ) {
      this.isForceUpdatePlacement = true;
    }

    this.updateTimer = setTimeout(() => {
      this.refreshInfo(element, prevProps);
      if (!this.startHandler) {
        const eventType = isTouchScreen() ? 'touchstart' : 'mousedown';
        this.startHandler = addEventListener(element, eventType, (ev) => this.onStart(ev, element));
      }

      // 加入 resize 监听
      if (this.props.monitorWindowResize && !this.resizeHandler) {
        this.resizeHandler = addEventListener(
          window,
          'resize',
          throttleWithRAF(() => this.refreshInfo(element, prevProps))
        );
      }
    }, 0);

    this.clearHandler();
  }

  componentWillUnmount(): void {
    clearTimeout(this.updateTimer);
    this.clearHandler();
  }

  clearHandler() {
    if (this.moveHandler) {
      this.moveHandler.remove();
      this.moveHandler = null;
    }
    if (this.endHandler) {
      this.endHandler.remove();
      this.endHandler = null;
    }
  }

  refreshInfo = (el, prevProps) => {
    const element = el || this.getDomNode();
    if (!element) {
      return;
    }
    const parentNode = element.parentNode as HTMLElement;
    if (!parentNode) {
      return;
    }
    const elementSize = getElementSize(element);
    this.elementSize = {
      width: this.currentScaleSize * elementSize.width,
      height: this.currentScaleSize * elementSize.height
    };

    if (
      this.elementSize.width !== this.prevElementSize.width ||
      this.elementSize.height !== this.prevElementSize.height
    ) {
      this.isForceUpdatePlacement = true;
    }

    this.prevElementSize = this.elementSize;
    this.elementParentSize = getElementSize(parentNode, true);

    const { horizontalPlacement, verticalPlacement } = this.props;
    if (
      !prevProps ||
      this.isForceUpdatePlacement ||
      horizontalPlacement !== prevProps.horizontalPlacement ||
      verticalPlacement !== prevProps.verticalPlacement
    ) {
      this.currentObj = getInitElementPlacement({
        horizontalPlacement,
        verticalPlacement,
        elementSize: this.elementSize,
        elementParentSize: this.elementParentSize
      });
      const { nextScaleSize, nextX, nextY } = this.checkRange();
      this.currentObj = {
        x: nextX,
        y: nextY
      };
      this.currentScaleSize = nextScaleSize;
      this.setElementInfo(element);
      element.style.visibility = 'visible';
      this.isForceUpdatePlacement = false;
    }
  };

  onStart = (event, element) => {
    if (event.preventDefault) {
      event.preventDefault();
    }
    if (event.stopPropagation) {
      event.stopPropagation();
    }

    this.isTouchScale = false;

    element.style.transition = '';

    const scalable = this.props.scalable;
    const isTouch = isTouchScreen();
    this.prevScaleSize = this.currentScaleSize;
    if (scalable && isTouch && event.touches.length > 1) {
      this.isTouchScale = true;
      // 记录双指的间距长度
      this.scaleStart = getDistance(
        {
          x: event.touches[0].pageX,
          y: event.touches[0].pageY
        },
        {
          x: event.touches[1].pageX,
          y: event.touches[1].pageY
        }
      );
    } else {
      this.moveObj = { ...defaultPosition };
      this.prevObj = { ...this.currentObj };
      this.startObj = {
        x: event.touches ? event.touches[0].pageX : event.clientX,
        y: event.touches ? event.touches[0].pageY : event.clientY
      };
    }

    this.moveHandler = addEventListener(
      window.document,
      isTouch ? 'touchmove' : 'mousemove',
      (ev) => this.onMove(ev, element)
    );
    this.endHandler = addEventListener(window.document, isTouch ? 'touchend' : 'mouseup', (ev) =>
      this.onEnd(ev, element)
    );
  };
  onMove = (event, element) => {
    if (event.preventDefault) {
      event.preventDefault();
    }
    if (event.stopPropagation) {
      event.stopPropagation();
    }
    if (this.isTouchScale && event.touches.length > 1) {
      this.scaleEnd = getDistance(
        {
          x: event.touches[0].pageX,
          y: event.touches[0].pageY
        },
        {
          x: event.touches[1].pageX,
          y: event.touches[1].pageY
        }
      );
      // 设置缩放尺寸
      this.currentScaleSize = (this.scaleEnd / this.scaleStart - 1) / 2 + this.prevScaleSize;
      this.setElementInfo(element);
      return;
    }

    if (this.isTouchScale && event.touches.length <= 1) {
      return;
    }

    this.moveObj = {
      x: event.touches ? event.touches[0].pageX : event.clientX,
      y: event.touches ? event.touches[0].pageY : event.clientY
    };
    this.currentObj = {
      x: this.prevObj.x + this.moveObj.x - this.startObj.x,
      y: this.prevObj.y + this.moveObj.y - this.startObj.y
    };
    this.setElementInfo(element);
  };
  onEnd = (event, element) => {
    if (event.preventDefault) {
      event.preventDefault();
    }
    if (event.stopPropagation) {
      event.stopPropagation();
    }
    this.clearHandler();

    const { nextX, nextY, nextScaleSize, isRefresh } = this.checkRange();
    if (isRefresh) {
      element.style.transition = 'transform 200ms ease-in-out';
      this.currentObj = {
        x: nextX,
        y: nextY
      };
      this.currentScaleSize = nextScaleSize;
      this.setElementInfo(element);
    }
  };

  checkRange() {
    const { x, y } = this.currentObj;
    const { width, height } = this.elementSize;
    const pSize = this.elementParentSize;
    let nextX = x;
    let nextY = y;
    // 内容小于或等于父级时，左右滑动不能超出
    if (pSize.width >= width) {
      if (x < 0) {
        nextX = 0;
      } else if (x + width > pSize.width) {
        nextX = pSize.width - width;
      }
    } else {
      // 内容大于父级时，左右滑动时，右边可以滑动到内容最右边
      if (x > 0) {
        nextX = 0;
      } else if (pSize.width > width + x) {
        nextX = pSize.width - width;
      }
    }
    if (pSize.height >= height) {
      if (y < 0) {
        nextY = 0;
      } else if (y + height > pSize.height) {
        nextY = pSize.height - height;
      }
    } else {
      // 内容大于父级时，左右滑动时，右边可以滑动到内容最右边
      if (y > 0) {
        nextY = 0;
      } else if (pSize.height > height + y) {
        nextY = pSize.height - height;
      }
    }
    let nextScaleSize = this.currentScaleSize;
    if (this.props.scalable) {
      if (this.currentScaleSize > this.props.maxScalable) {
        nextScaleSize = this.props.maxScalable;
      } else if (this.currentScaleSize < this.props.minScalable) {
        nextScaleSize = this.props.minScalable;
      }
    }
    return {
      isRefresh: nextX !== x || nextY !== y || nextScaleSize !== this.currentScaleSize,
      nextX,
      nextY,
      nextScaleSize
    };
  }

  setElementInfo(element) {
    const deviation = (1 - 1 / this.currentScaleSize) * 100;
    element.style.transform = `translate(calc(${this.currentObj.x}px + ${deviation}%), calc(${this.currentObj.y}px + ${deviation}%)) scale(${this.currentScaleSize})`;
    const { width, height } = this.prevElementSize;
    this.elementSize = {
      width: this.currentScaleSize * width,
      height: this.currentScaleSize * height
    };
  }

  onTransitionEnd = () => {
    const element = this.getDomNode();
    if (!element) {
      return;
    }
    element.style.transition = '';

    const { onAfterChange, name } = this.props;

    if (onAfterChange) {
      onAfterChange(name);
    }
  };

  getDomNode() {
    if (this.moveRef && this.moveRef.current) {
      return this.moveRef.current;
    }
    return null;
  }

  render() {
    const { children } = this.props;
    const child = React.Children.only(children) as React.ReactElement;
    if (ReactIs.isElement(child) && !ReactIs.isFragment(child)) {
      return React.cloneElement(child, {
        ref: this.moveRef,
        onTransitionEnd: this.onTransitionEnd,
        className: classNames(this.prefixCls, child.props.className)
      });
    }
    throw new Error('Move component only support HTMLElement!');
  }
}
