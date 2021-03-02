import { FunctionComponent, h } from 'preact';
import { Players } from '../domain';
import Player from './Player';
import Tile from './Tile';

const Players: FunctionComponent<{ players: Players }> = (props) => {
  const { players } = props;
  return (
    <aside className="players">
      {players.map((player) => (
        <Player name={player.name} id={player.id} hide={!!player.tiles.length}>
          {player.tiles.map((tile) => (
            <Tile key={tile.id} {...tile} />
          ))}
        </Player>
      ))}
    </aside>
  );
};

Players.displayName = 'Player List';
export default Players;
