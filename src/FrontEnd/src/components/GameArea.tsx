import '../css/gameArea.css';
import { Cell, GameState, HexCoordinates, Player, PlayerId, Tile } from '../domain';
import { FunctionComponent, h } from 'preact';
import { HextilleBuilder } from '../services';
import { handleDragOver } from '../utilities/handlers';
import { shareGame } from '../utilities/clipboard';
import { useState } from 'preact/hooks';
import GameCell from './GameCell';
import GameOver from './GameOver';
import GameTile from './GameTile';
import Hextille from './Hextille';
import Links from './Links';
import PlayerConnected from './PlayerConnected';
import Players from './Players';
import Row from './Row';
import Rules from './Rules';
import Share from './Share';

const cellKey = ({ q, r }: HexCoordinates) => `${q}-${r}`;
const getAllTiles = (...parents: Array<Array<Player | Cell>>): Array<Tile> =>
  parents.flatMap((p) => p.flatMap((p) => p.tiles));

const getAllPlayerTiles = (playerId: PlayerId, ...parents: Array<Array<Player | Cell>>) =>
  getAllTiles(...parents).filter((t) => t.playerId !== playerId);

const removeOtherPlayerMoves = (
  playerId: number,
  { players, cells }: Pick<GameState, 'players' | 'cells'>
): void => getAllPlayerTiles(playerId, players, cells).forEach((t) => t.moves.splice(0, t.moves.length));

type Props = Pick<GameState, 'players' | 'cells' | 'gameStatus'> & {
  playerId: PlayerId;
};
const getShareUrl = () => {
  const parts = window.location.href.split('/');
  parts.push(parts.pop() === '1' ? '0' : '1');
  return parts.join('/');
};

const GameArea: FunctionComponent<Props> = ({ players, cells, playerId, gameStatus }) => {
  const attributes = {
    ondragover: handleDragOver,
    className: 'hive',
  };
  const hextilleBuilder = new HextilleBuilder(cells);
  removeOtherPlayerMoves(playerId, { players, cells });

  const [showRules, setShowRules] = useState<boolean>(false);
  const [showShare, setShowShare] = useState<boolean>(false);
  const rows = hextilleBuilder.createRows();
  const gameOver = ['Player1Win', 'Player0Win', 'AiWin', 'GameOver'].includes(gameStatus);
  const winner =
    (gameStatus === 'Player0Win' && playerId === 0) || (gameStatus === 'Player1Win' && playerId === 1);

  const shareComponent = () => {
    setShowShare(shareGame(getShareUrl()));
  };

  return (
    <div {...attributes} title={'Hive Game Area'}>
      <Players players={players} />
      <main>
        <Links
          shareUrl={getShareUrl()}
          onShowRules={() => setShowRules(true)}
          onShowShare={() => shareComponent()}
        />
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
      {showRules ? <Rules setShowRules={setShowRules} /> : ''}
      {showShare ? <Share setShowShare={setShowShare} /> : ''}
      <PlayerConnected />
      {gameOver ? <GameOver win={winner} /> : ''}
    </div>
  );
};

GameArea.displayName = 'GameArea';
export default GameArea;
