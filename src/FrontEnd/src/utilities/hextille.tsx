import { Cell, GameState, HexCoordinates, Player, PlayerId, Tile } from '../domain';

export const cellKey = ({ q, r }: HexCoordinates) => `${q}-${r}`;
const getAllTiles = (...parents: Array<Array<Player | Cell>>): Array<Tile> =>
  parents.flatMap((p) => p.flatMap((p) => p.tiles));
const getAllPlayerTiles = (playerId: PlayerId, ...parents: Array<Array<Player | Cell>>) =>
  getAllTiles(...parents).filter((t) => t.playerId !== playerId);
export const removeOtherPlayerMoves = (
  playerId: number,
  { players, cells }: Pick<GameState, 'players' | 'cells'>
): void => getAllPlayerTiles(playerId, players, cells).forEach((t) => t.moves.splice(0, t.moves.length));
