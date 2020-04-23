import cxs from 'cxs';
import { Color } from '../domain';
import { generateMeasures } from './measures';

const { units, tileSizes } = generateMeasures('1px', undefined);

export const listContainer = cxs({
  display: 'flex',
  'flex-direction': 'row',
  height: '100%',
});

const borderWidth = units(3);
const borderRadius = `calc(${borderWidth} * 5)`;

export const playerContainer = (color: Color, bgColor?: Color) =>
  cxs({
    border: `${borderWidth} solid ${color}`,
    'border-radius': borderRadius,
    'margin-right': '1px',
    position: 'relative',
    'background-color': bgColor,
    height: '100%',
    overflow: 'auto',
  });

export const player = cxs({
  display: 'flex',
  'flex-direction': 'column',
  padding: `calc(${tileSizes.border} / 2)`,
  'min-width': `calc(${tileSizes.border} + ${tileSizes.width})`,
});

export const playerTile = cxs({
  flex: `1 1 calc(${tileSizes.height} + ${tileSizes.border} * 2 + ${tileSizes.gutter})`,
  'padding-top': tileSizes.border,
});
