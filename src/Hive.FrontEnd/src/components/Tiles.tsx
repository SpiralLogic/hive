import { Cell, PlayerId } from '../domain';
import GameTile from './GameTile';

const Tiles = ({ cell, currentPlayer }: { cell: Cell; currentPlayer: PlayerId }) => {
  cell.tiles.reverse();

  return (
    <>
      {cell.tiles.map((tile, index) => (
        <GameTile
          key={`${tile.id}`}
          currentPlayer={currentPlayer}
          {...tile}
          stacked={index === cell.tiles.length - 1 && cell.tiles.length > 1}
        />
      ))}
    </>
  );
};

Tiles.displayName = 'Tiles';
export default Tiles;
