import '../css/players.css';
import { FunctionComponent, h } from 'preact';
import { useReducer } from 'preact/hooks';
import { PlayerId, Players } from '../domain';
import GameTile from './GameTile';
import Player from './Player';

const hidePlayer = (state: Array<boolean>, action: [boolean, PlayerId]) => {
  state[action[1]] = action[0];
  return [...state];
};
const Players: FunctionComponent<{ players: Players; currentPlayer: PlayerId }> = (props) => {
  const { currentPlayer, players } = props;
  const [hiddenPlayers, dispatch] = useReducer(
    hidePlayer,
    players.map((p) => p.tiles.length === 0)
  );
  return (
    <aside className="players">
      {players
        .filter((p) => !hiddenPlayers[p.id])
        .map((player) => (
          <Player key={player.id} onHidden={dispatch} name={player.name} id={player.id}>
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
