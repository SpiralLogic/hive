import { create } from 'react-test-renderer';
import * as React from 'react';
import { Tile, TILE_TYPE } from './Tile';

import { GameContext, HiveContext } from '../gameContext';
import { DndProvider } from 'react-dnd';
import { getBackendFromInstance, wrapInTestContext } from 'react-dnd-test-utils';
import createBackend, { TestBackend } from 'react-dnd-test-backend';
import HTML5Backend from 'react-dnd-html5-backend/lib/HTML5Backend';
import { renderIntoDocument } from 'react-dom/test-utils';

const mockContext: GameContext = {
    getPlayerColor: jest.fn().mockReturnValueOnce('pink'),
    moveTile: jest.fn(),
    gameState: jest.genMockFromModule('../domain/gameState'),
};

const tileProps = {
    id: 1,
    playerId: 1,
    content: 'ant',
    availableMoves: [{ q: 1, r: 1 }]
};

describe('Tile component', () => {
    const component = create(
        <DndProvider backend={createBackend}>
            <HiveContext.Provider value={mockContext}>
                <Tile {...tileProps}/>
            </HiveContext.Provider>
        </DndProvider>
    );

    test('is players color', () => {
        expect(component.root.find(n => n.props['style']).props.style['--color']).toBe('pink');
    });

    test('matches current snapshot', () => {
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe('Tile drag and drop', () => {

});
