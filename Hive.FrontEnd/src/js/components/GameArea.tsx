import { handleDragOver } from '../handlers';
import Hextille from './Hextille';
import PlayerList from './PlayerList';
import * as React from 'preact/compat';

type Props = {
    loading: boolean;
};

export const GameArea = (props: Props) => {
    const { loading } = props;
    if (loading) {
        return <h1>loading</h1>;
    }

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
