import * as React from 'react';
import { Hexagon, Player } from '../domain';
import { Hextille } from './Hextille';
import { PlayerList } from './playerList';

type Props = {
    loading: boolean,
    players: Player[],
    hexagons: Hexagon[]
}
export const GameArea = (props: Props) => {
    const { loading, players, hexagons } = props;
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
        <PlayerList players={players}/>
        <Hextille hexagons={hexagons}/>
    </div>;
};

GameArea.displayName = 'GameArea';
