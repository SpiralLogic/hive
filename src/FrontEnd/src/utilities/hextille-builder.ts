import { Cell, GameState, Player, PlayerId, Tile } from '../domain';
import { Row } from '../domain/row';

const getAllTiles = (...parents: Array<Array<Player | Cell>>): Array<Tile> =>
  parents.flatMap((p) => p.flatMap((p) => p.tiles));

const getAllPlayerTiles = (playerId: PlayerId, ...parents: Array<Array<Player | Cell>>) =>
  getAllTiles(...parents).filter((t) => t.playerId !== playerId && playerId !== 2);

export const removeOtherPlayerMoves = (
  playerId: number,
  { players, cells }: Pick<GameState, 'players' | 'cells'>
) => {
  getAllPlayerTiles(playerId, players, cells).forEach((t) => t.moves.splice(0, t.moves.length));
};

const getWidth = (cells: Cell[]): [number, number] => {
  const [min, max] = cells.reduce(([min, max], c) => [Math.min(min, c.coords.q), Math.max(max, c.coords.q)], [
    0,
    0,
  ]);
  return [min, max - min + 1];
};

const getHeight = (sortedHexagons: Cell[]): [number, number] => {
  const firstCell = sortedHexagons[0] as Cell;
  const lastCell = sortedHexagons[sortedHexagons.length - 1] as Cell;
  const height = lastCell.coords.r - firstCell.coords.r + 1;
  return [firstCell.coords.r - 1, height + 2];
};

export const createRows = (cells: Cell[]): Row[] => {
  const sortedHexagons = cells.sort((c1, c2) => c1.coords.r - c2.coords.r || c1.coords.q - c2.coords.q);
  const [firstRow, height] = getHeight(sortedHexagons);
  const [firstColumn, width] = getWidth(sortedHexagons);

  const createEmptyRow = (i: number): Row => ({
    id: firstRow + i,
    hidden: i === 0 || i === height - 1,
    cells: Array.from(Array(width).keys(), (j: number) => ({
      coords: { q: firstColumn + j, r: firstRow + i },
      tiles: [],
      hidden: true,
    })),
  });

  const createEmptyRows = () => {
    return Array.from(Array(height).keys(), createEmptyRow);
  };

  return sortedHexagons.reduce((rows, cell) => {
    (rows[cell.coords.r - firstRow] as Row).cells[cell.coords.q - firstColumn] = cell;
    return rows;
  }, createEmptyRows());
};
