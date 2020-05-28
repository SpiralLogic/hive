import { fireEvent } from '@testing-library/preact';
import { h } from 'preact';
import Tile from '../components/Tile';
import { TileDragEvent, useTileDragEmitter } from '../emitters';
import { renderElement, simulateEvent } from './helpers';

const tileCanMove = () => {
    const props = { id: 1, playerId: 1, content: 'ant', moves: [{ q: 1, r: 1 }] };
    return renderElement(<Tile {...props}/>);
};

const tileNoMove = () => {
    const props = { id: 2, playerId: 0, content: 'fly', moves: [] };
    return renderElement(<Tile {...props}/>);
};

describe('Tile Render', () => {
    test('tile color is the player\'s color', () => {
        expect(tileCanMove()).toHaveStyle('--color: #f64c72');
        expect(tileNoMove()).toHaveStyle('--color: #85dcbc');
    });

    test('tile has content', () => {
        expect(tileNoMove()).toHaveTextContent('fly');
        expect(tileCanMove()).toHaveTextContent('ant');
    });
});

describe('Tile drag and drop', () => {
    test('Tile is draggable when there are available moves', () => {
        expect(tileCanMove()).toHaveAttribute('draggable', 'true');
    });

    test('is *not* draggable when there are no moves available', () => {
        expect(tileNoMove()).toHaveAttribute('draggable', 'false');
    });

    test('on drag emits start event', () => {
        jest.spyOn(useTileDragEmitter(), 'emit');
        fireEvent.dragStart(tileCanMove());

        const expectedEvent: TileDragEvent = {
            type: 'start',
            tileId: 1,
            moves: [{ q: 1, r: 1 }]
        };

        expect(useTileDragEmitter().emit).toHaveBeenCalledWith(expectedEvent);
    });

    test('on dragEnd emits end event', () => {
        jest.spyOn(useTileDragEmitter(), 'emit');
        fireEvent.dragEnd(tileCanMove());
        const expectedEvent: TileDragEvent = {
            type: 'end',
            tileId: 1,
            moves: [{ q: 1, r: 1 }]
        };

        expect(useTileDragEmitter().emit).toHaveBeenCalledWith(expectedEvent);
    });

    test('default on drop is prevented', () => {
        expect(simulateEvent(tileCanMove(), 'drop')).toHaveBeenCalled();
        expect(simulateEvent(tileNoMove(), 'drop')).toHaveBeenCalled();
    });
});

describe('Tile Snapshot', () => {
    test('can move matches current snapshot', () => {
        expect(tileCanMove()).toMatchSnapshot();
    });

    test('no moves matches current snapshot', () => {
        expect(tileNoMove()).toMatchSnapshot();
    });
});

