import { FunctionComponent, h } from 'preact';
import { GameState, HexCoordinates, PlayerId } from '../domain';
import { createRows, removeOtherPlayerMoves } from '../utilities/hextille-builder';
import { handleDragOver } from '../utilities/handlers';
import ActiveCell from './ActiveCell';
import ActiveTile from './ActiveTile';
import Hextille from './Hextille';
import Players from './PlayerList';
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
      <Hextille>
        {rows.map((row) => (
          <Row key={row.id} {...row}>
            {row.cells.map((cell) => (
              <ActiveCell key={cellKey(cell.coords)} coords={cell.coords} hidden={!!cell.hidden}>
                {cell.tiles.slice(0, 1).map((tile) => (
                  <ActiveTile key={tile.id} {...tile} />
                ))}
              </ActiveCell>
            ))}
          </Row>
        ))}
      </Hextille>
    </div>
  );
};

GameArea.displayName = 'GameArea';
export default GameArea;
