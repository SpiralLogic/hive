import { createContext, useEffect, useState } from 'react';
import { generateStyles, IHexStyles } from './styles/hex';
import { coordinateAsId, ICell, IEngine, IGameCoordinate, IGameState, IMove } from './domain'
 
export interface IGameContext {
  gameState: IGameState;
  allCells: ICell[];
  styles: IHexStyles;
  moveTile: (move: IMove) => void;
  setSize: (width: number, height: number) => void;
}

export const Context = createContext<IGameContext>({
  gameState: {
    cells: [],
    players: [],
  },
  allCells: [],
  styles: generateStyles( { width: 100, height: 100 }),
  moveTile: () => undefined,
  setSize: () => undefined,
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
          color: 'rgba(0, 0, 0,0.02)',
          tiles: [],
        });
        cellMap[id] = true;
      }
    });

  return targetCells.concat(cells);
};

const sqrt3 = Math.sqrt(3);
const f1 = sqrt3 / 2;
const f3 = 3 / 2;
const size = 50;

const gameToScreen = ({ q, r }: IGameCoordinate) => {
  const x = size * (sqrt3 * q + f1 * r);
  const y = size * f3 * r;
  return { x, y };
};

const minMax = <T>(arr: T[]) => [arr[0], arr.slice(-1)[0]];

const getStyles = (allCells: ICell[], screenSize: IScreenSize) => {
  if (!allCells.length) {
    return generateStyles( screenSize);
  }

  const screenCoords = allCells.map(c => gameToScreen(c.coordinates));

  const [minX, maxX] = minMax(screenCoords.map(c => c.x).sort((a, b) => a - b));
  const [minY, maxY] = minMax(screenCoords.map(c => c.y).sort((a, b) => a - b));

  const width = Math.abs(minX - maxX) + size * 2;
  const height = Math.abs(minY - maxY) + size * 2;

  const midX = maxX - width / 2 + size * 1.8;
  const midY = maxY - height / 2 + size * 1.9;

  let ratio = 1;

  if (width > screenSize.width || height > screenSize.height) {
    const widthRatio = screenSize.width / width;
    const heightRatio = screenSize.height / height;

    ratio = Math.min(widthRatio, heightRatio);
  }
  return generateStyles( screenSize, ratio, { x: midX, y: midY });
};

interface IScreenSize {
  width: number;
  height: number;
}

export const useGameContext = (engine: IEngine): [boolean, IGameContext] => {
  const [loading, setLoading] = useState(true);

  const [gameState, setGameState] = useState<IGameState>({
    cells: [],
    players: [],
  });

  const [screenSize, setScreenSize] = useState<IScreenSize>({ width: 0, height: 0 });

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

  const setSize = (width: number, height: number) => {
    setScreenSize({ width, height });
  };

  const allCells = getAdditionalCells(gameState);

  const styles = getStyles(allCells, screenSize);

  return [loading, { allCells, gameState, moveTile, setSize, styles }];
};
