import '../css/players.css'
import { FunctionComponent, h } from 'preact';
import { Players } from '../domain';
import GameTile from './GameTile';
import Player from './Player';

const Players: FunctionComponent<{ players: Players }> = (props) => {
  const { players } = props;
  return (
    <aside className="players">
      {players.map((player) => (
        <Player name={player.name} id={player.id} show={!!player.tiles.length}>
          {player.tiles.map((tile) => (
            <GameTile key={tile.id} {...tile} />
          ))}
        </Player>
      ))}
    </aside>
  );
};

Players.displayName = 'Players';
export default Players;
