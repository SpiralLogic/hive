import { Cell, HexCoordinate, Player, PlayerId, Tile } from '../domain';

const getAllTiles = (...parents: Array<Array<Player | Cell>>): Array<Tile> =>
  parents.flatMap((g) => g.flatMap((p) => p.tiles));

export const getAllPlayerTiles = (playerId: PlayerId, ...parents: Array<Array<Player | Cell>>) =>
  getAllTiles(...parents).filter((t) => t.playerId === playerId);

export const cellKey = ({ q, r }: HexCoordinate) => `${q}-${r}`;
