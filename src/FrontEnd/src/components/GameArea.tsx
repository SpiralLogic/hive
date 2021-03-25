import '../css/gameArea.css';
import { GameState, PlayerId } from '../domain';
import { FunctionComponent, h } from 'preact';
import { HextilleBuilder } from '../services';
import { handleDragOver } from '../utilities/handlers';
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
import { cellKey, removeOtherPlayerMoves } from '../utilities/hextille';
import { shareGame } from '../utilities/share';

type Props = Omit<GameState, 'gameId'> & { playerId: PlayerId };

const GameArea: FunctionComponent<Props> = ({ players, cells, playerId, gameStatus }) => {
  const [showRules, setShowRules] = useState<boolean>(false);
  const [showShare, setShowShare] = useState<boolean>(false);
  const gameOver = ['Player1Win', 'Player0Win', 'AiWin', 'GameOver'].includes(gameStatus);
  const winner =
    (gameStatus === 'Player0Win' && playerId === 0) || (gameStatus === 'Player1Win' && playerId === 1);

  const shareComponent = () => {
    setShowShare(shareGame());
  };
  const attributes = { ondragover: handleDragOver, className: 'hive' };
  const hextilleBuilder = new HextilleBuilder(cells);
  const rows = hextilleBuilder.createRows();

  removeOtherPlayerMoves(playerId, { players, cells });

  return (
    <div {...attributes} title={'Hive Game Area'}>
      <Players players={players} />
      <main>
        <Links
          onShowRules={() => setShowRules(true)}
          onShowShare={() => shareComponent()}
          playerId={playerId}
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
