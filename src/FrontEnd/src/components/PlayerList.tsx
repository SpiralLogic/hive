import { FunctionComponent, h } from 'preact';
import { Players } from '../domain';
import ActiveTile from './ActiveTile';
import Player from './Player';

const Players: FunctionComponent<{ players: Players }> = (props) => {
  const { players } = props;
  return (
    <aside className="players">
      {players.map((player) => (
        <Player name={player.name} id={player.id} hide={!!player.tiles.length}>
          {player.tiles.map((tile) => (
            <ActiveTile key={tile.id} {...tile} />
          ))}
        </Player>
      ))}
    </aside>
  );
};

Players.displayName = 'Player List';
export default Players;
