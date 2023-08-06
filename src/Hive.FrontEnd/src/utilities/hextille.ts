import { Cell, HexCoordinate, Player, Tile } from '../domain';

const getAllTiles = (...parents: Array<Array<Player | Cell>>): Array<Tile> =>
  parents.flatMap((g) => g.flatMap((p) => p.tiles));

export const getAllPlayerTiles = (playerId: number, ...parents: Array<Array<Player | Cell>>) =>
  getAllTiles(...parents).filter((t) => t.playerId === playerId);

export const cellKey = ({ q, r }: HexCoordinate) => `${q}-${r}`;
