import { Cell, Player } from '../domain';
import { FunctionComponent, h } from 'preact';
import { handleDragOver } from '../handlers';
import Hextille from './Hextille';
import PlayerList from './PlayerList';

type Props = { players: Player[]; cells: Cell[] };

const GameArea: FunctionComponent<Props> = ({ players, cells }) => {
  const attributes = {
    ondragover: handleDragOver,
    className: 'hive',
  };
  return (
    <div {...attributes}>
      <PlayerList players={players} />
      <Hextille cells={cells} />
    </div>
  );
};

GameArea.displayName = 'GameArea';
export default GameArea;
