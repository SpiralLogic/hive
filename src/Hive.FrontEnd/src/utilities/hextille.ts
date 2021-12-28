import { Cell, GameState, HexCoordinates, Player, PlayerId, Tile } from '../domain';
import { HiveDispatcher, TileEvent } from '../services';

const getAllTiles = (...parents: Array<Array<Player | Cell>>): Array<Tile> =>
  parents.flatMap((g) => g.flatMap((p) => p.tiles));

const getAllPlayerTiles = (playerId: PlayerId, ...parents: Array<Array<Player | Cell>>) =>
  getAllTiles(...parents).filter((t) => t.playerId !== playerId);

export const cellKey = ({ q, r }: HexCoordinates) => `${q}-${r}`;

export const removeOtherPlayerMoves = (
  playerId: number,
  { players, cells }: Pick<GameState, 'players' | 'cells'>
): void => {
  for (const t of getAllPlayerTiles(playerId, players, cells)) t.moves.splice(0, t.moves.length);
};

export const resetOtherPlayerSelected = (
  playerId: number,
  { players, cells }: Pick<GameState, 'players' | 'cells'>,
  dispatcher: HiveDispatcher
): void => {
  for (const tile of getAllPlayerTiles(playerId, players, cells))
    dispatcher.dispatch<TileEvent>({ type: 'tileDeselected', tile });
};
