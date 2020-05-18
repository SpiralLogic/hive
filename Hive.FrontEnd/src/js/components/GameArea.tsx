import * as React from 'react';
import {Hextille} from './Hextille';
import {HexEngine} from '../domain';
import {PlayerList} from './playerList';
import {HiveContext, useGameContext} from '../gameContext';

interface GameArea {
    engine: HexEngine;
}

export const GameArea: React.FunctionComponent<GameArea> = ({engine}) => {
    const [loading, gameContext] = useGameContext(engine);

    if (loading) {
        return <h1>loading</h1>;
    }
    const attributes = {
        className: 'hive',
        style: {'--hex-size': '50px'},
    };

    return (
        <div {...attributes}>
            <HiveContext.Provider value={gameContext}>
                <PlayerList/>
                <Hextille/>
            </HiveContext.Provider>
        </div>
    );
};

GameArea.displayName = 'GameArea';
