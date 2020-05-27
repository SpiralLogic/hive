import { handleDragOver } from '../handlers';
import Hextille from './Hextille';
import PlayerList from './PlayerList';
import { h } from 'preact';

export const GameArea = () => {
    const attributes = {
        ondragover: handleDragOver,
        className: 'hive',
        style: { '--hex-size': '50px' },
    };

    return (
        <div {...attributes}>
            <PlayerList />
            <Hextille />
        </div>
    );
};

GameArea.displayName = 'GameArea';
