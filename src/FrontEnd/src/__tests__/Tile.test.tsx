import { fireEvent } from '@testing-library/preact';
import { h } from 'preact';
import Tile from '../components/Tile';
import { TileDragEvent, useTileDragEmitter } from '../emitters';
import { renderElement, simulateEvent } from './helpers';

const tileCanMove = { id: 1, playerId: 1, creature: 'ant', moves: [{ q: 1, r: 1 }] };
const tileNoMove = { id: 2, playerId: 0, creature: 'fly', moves: [] };

const createTileCanMove = () => {
    return renderElement(<Tile {...tileCanMove} />);
};

const createTileNoMove = () => {
    return renderElement(<Tile {...tileNoMove} />);
};

describe('Tile Render', () => {
    test("tile color is the player's color", () => {
        expect(createTileCanMove()).toHaveStyle('--color: #f64c72');
        expect(createTileNoMove()).toHaveStyle('--color: #85dcbc');
    });

    test('has creature', () => {
        expect(createTileNoMove()).toHaveTextContent('fly');
        expect(createTileCanMove()).toHaveTextContent('ant');
    });
});

describe('drag and drop', () => {
    test('Tile is draggable when there are available moves', () => {
        expect(createTileCanMove()).toHaveAttribute('draggable', 'true');
    });

    test('is *not* draggable when there are no moves available', () => {
        expect(createTileNoMove()).toHaveAttribute('draggable', 'false');
    });

    test('on drag emits start event', () => {
        jest.spyOn(useTileDragEmitter(), 'emit');
        fireEvent.dragStart(createTileCanMove());

        const expectedEvent: TileDragEvent = {
            type: 'start',
            tile: tileCanMove
        };

        expect(useTileDragEmitter().emit).toHaveBeenCalledWith(expectedEvent);
    });

    test('on dragEnd emits end event', () => {
        jest.spyOn(useTileDragEmitter(), 'emit');
        fireEvent.dragEnd(createTileCanMove());
        const expectedEvent: TileDragEvent = {
            type: 'end',
            tile: tileCanMove
        };

        expect(useTileDragEmitter().emit).toHaveBeenCalledWith(expectedEvent);
    });

    test('default on drop is prevented', () => {
        expect(simulateEvent(createTileCanMove(), 'drop')).toHaveBeenCalled();
        expect(simulateEvent(createTileNoMove(), 'drop')).toHaveBeenCalled();
    });
});

describe('Tile Snapshot', () => {
    test('can move matches current snapshot', () => {
        expect(createTileCanMove()).toMatchSnapshot();
    });

    test('no moves matches current snapshot', () => {
        expect(createTileNoMove()).toMatchSnapshot();
    });
});
