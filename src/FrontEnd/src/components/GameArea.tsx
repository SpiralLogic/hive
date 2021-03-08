import { FunctionComponent, h } from 'preact';
import { GameState, HexCoordinates, PlayerId } from '../domain';
import { createRows, removeOtherPlayerMoves } from '../services';
import { handleDragOver } from '../utilities/handlers';
import GameCell from './GameCell';
import GameTile from './GameTile';
import Hextille from './Hextille';
import Players from './Players';
import Row from './Row';

const cellKey = ({ q, r }: HexCoordinates) => `${q}-${r}`;

const GameArea: FunctionComponent<Pick<GameState, 'players' | 'cells'> & { playerId: PlayerId }> = ({
  players,
  cells,
  playerId,
}) => {
  const attributes = {
    ondragover: handleDragOver,
    className: 'hive',
  };
  removeOtherPlayerMoves(playerId, { players, cells });

  const rows = createRows(cells);
  return (
    <div {...attributes}>
      <Players players={players} currentPlayer={playerId} />
      <main>
        <Hextille>
          {rows.map((row) => (
            <Row key={row.id} {...row}>
              {row.cells.map((cell) => (
                <GameCell key={cellKey(cell.coords)} coords={cell.coords} hidden={!!cell.hidden}>
                  {cell.tiles.slice(0, 1).map((tile) => (
                    <GameTile key={tile.id} {...tile} />
                  ))}
                </GameCell>
              ))}
            </Row>
          ))}
        </Hextille>
      </main>
    </div>
  );
};

GameArea.displayName = 'GameArea';
export default GameArea;
