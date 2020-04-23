import { areEqual, coordId } from './coordinateHelpers';
import { ICell, IEngine, IGameCoordinate, IGameState, IMove, IPlayer, ITile, PlayerId } from './domain';

const qr = (q: number, r: number): IGameCoordinate => ({ q, r });

let idSeed = 0;
const nextId = () => `${idSeed++}`;
const buildTile = (owner: string, text: string): ITile => ({
  id: nextId(),
  owner,
  content: {
    type: 'text',
    text,
  },
  availableMoves: [],
});

const tileTypes = ['queen', 'spider', 'spider', 'beetle', 'beetle', 'hopper', 'hopper', 'hopper', 'ant', 'ant', 'ant'];

const playerTiles = (id: PlayerId) => tileTypes.map(type => buildTile(id, type));

interface ITileDictionaryEntry {
  tile: ITile;
  container: string;
}

interface IAvailableTile extends ITileDictionaryEntry {
  container: 'player';
  player: IPlayer;
}

interface IPlacedTile extends ITileDictionaryEntry {
  container: 'cell';
  cell: ICell;
}

interface ITileDictionary {
  [k: string]: IAvailableTile | IPlacedTile;
}

interface IEngineState {
  currentPlayer: PlayerId;
  gameState: IGameState;
  tiles: ITileDictionary;
}

const activeColor = 'white';
const passiveColor = 'rgba(29, 29, 28, 0.7)';

const initialState = (): IEngineState => {
  const p1 = {
    id: 'player-1',
    color: 'rgb(197, 180, 91)',
    tileListColor: activeColor,
    name: 'Player 1',
    availableTiles: playerTiles('player-1'),
  };
  const p2 = {
    id: 'player-2',
    color: 'rgb(171, 96, 96)',
    tileListColor: passiveColor,
    name: 'Player 2',
    availableTiles: playerTiles('player-2'),
  };

  const origin = qr(0, 0);

  p1.availableTiles.forEach(tile => tile.availableMoves.push(origin));

  const currentPlayer = p1.id;

  const state: IGameState = {
    players: [p1, p2],
    cells: [],
  };

  const indexTiles = (player: IPlayer) =>
    player.availableTiles.reduce<ITileDictionary>(
      (acc: ITileDictionary, tile: ITile) => ({
        ...acc,
        [tile.id]: { tile, container: 'player', player },
      }),
      {},
    );

  const tiles: ITileDictionary = {
    ...indexTiles(p1),
    ...indexTiles(p2),
  };

  return { gameState: state, tiles, currentPlayer };
};

const copyState = (state: IGameState) => JSON.parse(JSON.stringify(state)) as IGameState;

const getTargetCell = (position: IGameCoordinate, state: IGameState) => {
  const cell = state.cells.find(c => areEqual(c.position, position));
  if (cell) {
    return cell;
  }

  const newCell: ICell = { position, tiles: [] };

  state.cells.push(newCell);

  return newCell;
};

const moveTile = ({ tileId, position }: IMove, { gameState, tiles }: IEngineState) => {
  const tileEntry = tiles[tileId];

  const targetCell = getTargetCell(position, gameState);

  let sourceTiles: ITile[] = [];

  if (tileEntry.container === 'player') {
    sourceTiles = tileEntry.player.availableTiles;
  }

  if (tileEntry.container === 'cell') {
    sourceTiles = tileEntry.cell.tiles;
  }

  const index = sourceTiles.indexOf(tileEntry.tile);
  sourceTiles.splice(index, 1);

  targetCell.tiles.unshift(tileEntry.tile);

  tiles[tileId] = {
    tile: tileEntry.tile,
    container: 'cell',
    cell: targetCell,
  };
};

const cleanCells = ({ gameState }: IEngineState) => {
  gameState.cells = gameState.cells.filter(cell => cell.tiles.length > 0);
};

const nextPlayer = ({ tileId }: IMove, engineState: IEngineState) => {
  const { gameState, tiles } = engineState;
  const playerId = tiles[tileId].tile.owner;
  const index = gameState.players.findIndex(p => p.id === playerId);
  gameState.players[index].tileListColor = passiveColor;
  const nextIndex = (index + 1) % gameState.players.length;
  gameState.players[nextIndex].tileListColor = activeColor;
  engineState.currentPlayer = gameState.players[nextIndex].id;
};

const neighbours = [qr(0, -1), qr(1, -1), qr(1, 0), qr(0, 1), qr(-1, 1), qr(-1, 0)];

const getNeighbours = (p: IGameCoordinate) => neighbours.map(({ q, r }) => qr(q + p.q, r + p.r));

const updateAvailableMoves = ({ gameState, tiles, currentPlayer }: IEngineState) => {
  const coordDict: { [k: string]: boolean } = {};
  const allCoords = gameState.cells
    .reduce<IGameCoordinate[]>((acc, { position }) => [...acc, position, ...getNeighbours(position)], [])
    .filter(c => {
      const id = coordId(c);
      if (coordDict[id]) {
        return false;
      }
      coordDict[id] = true;
      return true;
    });

  Object.values(tiles).forEach(entry => {
    entry.tile.availableMoves = entry.tile.owner !== currentPlayer ? [] : allCoords;
  });
};

const playMove = (move: IMove, engineState: IEngineState) => {
  moveTile(move, engineState);
  cleanCells(engineState);
  nextPlayer(move, engineState);
  updateAvailableMoves(engineState);
};

export const simpleEngine = (): IEngine => {
  const engineState = initialState();

  return {
    initialState: async () => copyState(engineState.gameState),
    playMove: async move => {
      playMove(move, engineState);
      return copyState(engineState.gameState);
    },
  };
};
