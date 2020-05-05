export type Position = {
  x: number;
  y: number;
};

export function getDistance(start: Position, end: Position): number {
  return Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
}

export function getInitElementPlacement({
  elementSize,
  elementParentSize,
  horizontalPlacement,
  verticalPlacement
}): Position {
  let translateX = 0;
  let translateY = 0;

  switch (horizontalPlacement) {
    case 'center':
      translateX = (elementParentSize.width - elementSize.width) / 2;
      break;
    case 'right':
      translateX = elementParentSize.width - elementSize.width;
      break;
    default:
      translateX = 0;
  }

  switch (verticalPlacement) {
    case 'center':
      translateY = (elementParentSize.height - elementSize.height) / 2;
      break;
    case 'bottom':
      translateY = elementParentSize.height - elementSize.height;
      break;
    default:
      translateY = 0;
  }

  return {
    x: translateX,
    y: translateY
  };
}

export function getElementSize(elem: HTMLElement, isRemoveBorder?: boolean) {
  if (isRemoveBorder) {
    return {
      width: elem.clientWidth,
      height: elem.clientHeight
    };
  }
  return {
    width: elem.offsetWidth,
    height: elem.offsetHeight
  };
}

export function isTouchScreen() {
  return 'ontouchstart' in document.documentElement;
}
