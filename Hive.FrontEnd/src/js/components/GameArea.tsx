import * as React from 'react';
import { Hextille } from './Hextille';
import { PlayerList } from './playerList';

type Props = {
    loading: boolean,
}
export const GameArea = (props: Props) => {
    const { loading } = props;
    if (loading) {
        return <h1>loading</h1>;
    }

    function handleDragOver (e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        return false;
    }

    const attributes = {
        onDragOver: handleDragOver,
        className: 'hive',
        style: { '--hex-size': '50px' },
    };

    return <div {...attributes}>
        <PlayerList/>
        <Hextille/>
    </div>;
};

GameArea.displayName = 'GameArea';
