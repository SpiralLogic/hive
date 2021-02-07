import { FunctionComponent, h } from 'preact';
import { Player } from '../domain';
import PlayerTiles from './PlayerTiles';

type Props = { players: Player[] };

const PlayerList: FunctionComponent<Props> = (props: Props) => {
  const { players } = props;
  return (
    <div className="players">
      {players.map((player) => (
        <PlayerTiles key={player.id} {...player} />
      ))}
    </div>
  );
};

PlayerList.displayName = 'Player List';
export default PlayerList;
