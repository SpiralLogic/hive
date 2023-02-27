import '../css/players.css';

import { PlayerId } from '../domain';
import GameTile from './GameTile';
import Player from './Player';
import { useGameState } from '../services/gameStateContext';

const Players = (properties: { currentPlayer: PlayerId }) => {
  const { currentPlayer } = properties;
  const { players } = useGameState();
  return (
    <aside className="players" aria-label={'PLayer pieces not yet on the board'}>
      {players.value.map((player) => (
        <Player key={`${player.id}`} name={player.name} id={player.id}>
          {player.tiles
            .map((tile) => ({
              ...tile,
              moves: undefined,
            }))
            .map((tile) => (
              <GameTile currentPlayer={currentPlayer} key={`${tile.id}`} {...tile} />
            ))}
        </Player>
      ))}
    </aside>
  );
};

Players.displayName = 'Players';
export default Players;
