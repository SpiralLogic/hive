import cxs from 'cxs';
import { Color, IGameCoordinate } from '../domain';
import { generateMeasures, ISizes } from './GameContext';

const textColor = '#ffffff';
const cellColor = '#ababab';

export interface IHexStyles {
  cell: (color: Color | undefined, position: IGameCoordinate, canDrop: boolean, isOver: boolean) => string;
  tile: (color: Color, active: boolean, up: boolean) => string;
  tileImage: string;
}

export const generateStyles = (
  screenSize?: { width: number; height: number },
  ratio: number = 1,
  shift: { x: number; y: number } = { x: 0, y: 0 },
): IHexStyles => {
  const { cellSizes, tileSizes, gameToScreen } = generateMeasures(`calc(1px* ${ratio})`, screenSize, shift);

  const hex = ({ height, width, margin, border }: ISizes, color: Color) => {
    const beforeAfter = {
      'border-left': `${margin} solid transparent`,
      'border-right': `${margin} solid transparent`,
      content: '""',
      left: 0,
      position: 'absolute',
      width: 0,
    };

    return {
      'align-item': 'center',
      display: 'flex',
      position: 'absolute',
      'justify-content': 'center',
      fill: 'white',
      width,
      height,
      color: textColor,

      'background-color': color,
      'border-top-color': color,
      'border-bottom-color': color,
      '::before': {
        ...beforeAfter,
        'border-bottom': `${border} solid ${color}`,
        bottom: '100%',
      },
      '::after': {
        ...beforeAfter,
        'border-top': `${border} solid ${color}`,
        top: '100%',
      },
    };
  };

  const cell = (color: Color = cellColor, position: IGameCoordinate, canDrop: boolean, isOver: boolean) =>
    cxs({
      ...gameToScreen(position),
      ...hex(cellSizes, isOver ? (canDrop ? 'green' : 'red') : color),
      margin: `${cellSizes.border} 0`,
    });

  const tile = (color: Color, active: boolean, up: boolean) =>
    cxs({
      ...hex(tileSizes, color),
      'margin-top': tileSizes.gutter,
      'z-index': 99,
      cursor: active ? (up ? 'grabbing' : 'grab') : 'not-allowed',
      ':hover': {
        'box-shadow': active ? '0 0 20px black' : undefined,
        transition: 'all .1s ease-in',
      },
    });

  const tileImage = cxs({
    width: tileSizes.height,
    height: tileSizes.height,
  });

  return {
    cell,
    tile,
    tileImage,
  };
};
