import * as React from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import { Hextille } from './Hextille';
import { HexEngine } from '../domain';
import { PlayerList } from './playerList';
import { HiveContext, useGameContext } from '../gameContext';

function dragend_handler (ev: React.DragEvent<HTMLDivElement>) {
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('valid-cell', 'active', 'invalid-cell');
    });
    return false;
}

export const GameArea: React.FunctionComponent<{ engine: HexEngine; }> = ({ engine }) => {
    const [loading, gameContext] = useGameContext(engine);

    if (loading) {
        return <h1>loading</h1>;
    }
    const attributes = {
        className: 'hive',
        style: { '--hex-size': '50px' },
        onDragEnd: dragend_handler,
    };

    return (
        <DndProvider backend={Backend}>
            <div {...attributes}>
                <HiveContext.Provider value={gameContext}>
                    <PlayerList/>
                    <Hextille/>
                </HiveContext.Provider>
            </div>
        </DndProvider>
    );
};

GameArea.displayName = 'GameArea';
DndProvider.displayName = 'Drag and Drop Provider';