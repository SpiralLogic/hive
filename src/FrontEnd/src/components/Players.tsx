import '../css/players.css';
import { FunctionComponent } from 'preact';
import { PlayerId, Players as PlayersType } from '../domain';
import GameTile from './GameTile';
import Player from './Player';

const Players: FunctionComponent<{ players: PlayersType; currentPlayer: PlayerId }> = (props) => {
  const { currentPlayer, players } = props;
  return (
    <aside className="players">
      {players.map((player) => (
        <Player key={player.id} name={player.name} id={player.id}>
          {player.tiles.map((tile) => (
            <GameTile currentPlayer={currentPlayer} key={tile.id} {...tile} />
          ))}
        </Player>
      ))}
    </aside>
  );
};

Players.displayName = 'Players';
export default Players;
