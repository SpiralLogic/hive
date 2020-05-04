import { createContext, useEffect, useState } from 'react';
import { coordinateAsId, ICell, IEngine, IGameState, IMove, PlayerId } from './domain'
import { IPlayer } from './domain/IPlayer'
 
export interface IGameContext {
  gameState: IGameState;
  allCells: ICell[];
  moveTile: (move: IMove) => void;
}

export const Context = createContext<IGameContext>({
  gameState: {
    cells: [],
    players: [],
  },
  allCells: [],
  moveTile: () => undefined
});

interface ICellMap {
  [k: string]: boolean;
}

const getAdditionalCells = ({ cells, players }: IGameState): ICell[] => {
  const cellMap: ICellMap = cells.reduce((cm: ICellMap, { coordinates }) => ({ ...cm, [coordinateAsId(coordinates)]: true }), {});

  const playerTiles = players.flatMap(p => p.availableTiles);
  const cellTiles = cells.flatMap(c => c.tiles);

  const targetCells: ICell[] = [];

  playerTiles
    .concat(cellTiles)
    .flatMap(t => t.availableMoves)
    .forEach(position => {
      const id = coordinateAsId(position);
      if (!cellMap[id]) {
        targetCells.push({
          coordinates: position,
          tiles: [],
        });
        cellMap[id] = true;
      }
    });

  return targetCells.concat(cells);
};


export const useGameContext = (engine: IEngine): [boolean, IGameContext] => {
  const [loading, setLoading] = useState(true);

  const [gameState, setGameState] = useState<IGameState>({
    cells: [],
    players: [],
  });

  useEffect(() => {
    setLoading(true);
    engine.initialState().then(state => {
      setGameState(state);
      setLoading(false);
    });
  }, [engine]);

  const moveTile = (move: IMove) => {
    engine.playMove(move).then(nextState => setGameState(nextState));
  };

  const allCells = getAdditionalCells(gameState);

  return [loading, { allCells, gameState, moveTile}];
};
