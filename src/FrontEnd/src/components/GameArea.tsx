import '../css/gameArea.css';
import { Cell, GameState, HexCoordinates, Player, PlayerId, Tile } from '../domain';
import { FunctionComponent, h } from 'preact';
import { HextilleBuilder } from '../services';
import { handleDragOver } from '../utilities/handlers';
import GameCell from './GameCell';
import GameTile from './GameTile';
import Hextille from './Hextille';
import Players from './Players';
import Row from './Row';

const cellKey = ({ q, r }: HexCoordinates) => `${q}-${r}`;
const getAllTiles = (...parents: Array<Array<Player | Cell>>): Array<Tile> =>
  parents.flatMap((p) => p.flatMap((p) => p.tiles));

const getAllPlayerTiles = (playerId: PlayerId, ...parents: Array<Array<Player | Cell>>) =>
  getAllTiles(...parents).filter((t) => t.playerId !== playerId && playerId !== 2);

const removeOtherPlayerMoves = (
  playerId: number,
  { players, cells }: Pick<GameState, 'players' | 'cells'>
): void => getAllPlayerTiles(playerId, players, cells).forEach((t) => t.moves.splice(0, t.moves.length));

type Props = Pick<GameState, 'players' | 'cells'> & { playerId: PlayerId };

const GameArea: FunctionComponent<Props> = ({ players, cells, playerId }) => {
  const attributes = {
    ondragover: handleDragOver,
    className: 'hive',
  };
  const hextilleBuilder = new HextilleBuilder(cells);

  removeOtherPlayerMoves(playerId, { players, cells });

  const rows = hextilleBuilder.createRows();
  return (
    <div {...attributes} title={'Hive Game Area'}>
      <Players players={players} />
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
