import { Cell } from '../domain';
import GameTile from './GameTile';

const Tiles = ({ cell, currentPlayer }: { cell: Cell; currentPlayer: number }) => {
  const tiles = cell.tiles.toReversed();

  return (
    <>
      {tiles.map((tile, index) => (
        <GameTile
          key={`${tile.id}`}
          currentPlayer={currentPlayer}
          {...tile}
          stacked={index === tiles.length - 1 && tiles.length > 1}
        />
      ))}
    </>
  );
};

Tiles.displayName = 'Tiles';
export default Tiles;
