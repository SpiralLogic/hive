import { IGameCoordinate } from '../domain';

export interface ISizes {
  width: string;
  height: string;
  margin: string;
  border: string;
}

const sqrt3 = Math.sqrt(3);
const f1 = sqrt3 / 2;
const f3 = 3 / 2;

export const generateMeasures = (
  unit: string,
  screenSize: { width: number; height: number } | undefined,
  shift = { x: 0, y: 0 },
) => {
  const units = (unitCount: number) => `calc(${unit} * ${unitCount})`;

  const cellWidth = units(80);
  const size = `calc(${cellWidth} * 0.625)`;

  let originX: string;
  let originY: string;
  if (screenSize) {
    originX = `${screenSize.width / 2}px`;
    originY = `${screenSize.height / 2}px`;
  } else {
    originX = `calc(50vw - ${size})`;
    originY = `calc(50vh - ${size})`;
  }

  const cellBetween = `calc(${cellWidth} * 0.0875)`;
  const cellHeight = `calc(${cellWidth} / ${sqrt3})`;
  const cellMargin = `calc(${cellWidth} / 2)`;
  const cellBorder = `calc(${cellMargin} / ${sqrt3})`;

  const cellSizes: ISizes & { between: string } = {
    width: cellWidth,
    between: cellBetween,
    height: cellHeight,
    margin: cellMargin,
    border: cellBorder,
  };

  const tileWidth = `calc(${cellWidth} * 0.875)`;
  const tileHeight = `calc(${tileWidth} / ${sqrt3})`;
  const tileMargin = `calc(${tileWidth} / 2)`;
  const tileBorder = `calc(${tileMargin} / ${sqrt3})`;
  const tileGutter = `calc(${cellBetween} / 2.1)`;

  const tileSizes: ISizes & { gutter: string } = {
    width: tileWidth,
    height: tileHeight,
    margin: tileMargin,
    border: tileBorder,
    gutter: tileGutter,
  };

  const gameToScreen = ({ q, r }: IGameCoordinate) => {
    const left = `calc(${size} * ${sqrt3 * q + f1 * r} + ${originX} - ${units(shift.x)})`;
    const top = `calc(${size} * ${f3 * r} + ${originY} - ${units(shift.y)})`;
    return { left, top };
  };

  return {
    units,
    size,
    cellSizes,
    tileSizes,
    gameToScreen,
  };
};
