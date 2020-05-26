import {fireEvent, render} from '@testing-library/preact';
import Tile from '../components/Tile';
import {TileDragEvent, useEmitter} from '../emitter/tile-drag-emitter';
import React from 'preact/compat';

const tileCanMove = () => {
    const props = {id: 1, playerId: 1, content: 'ant', availableMoves: [{q: 1, r: 1}]};
    return render(<Tile {...props}/>).container.firstElementChild as HTMLElement;
};

const tileNoMove = () => {
    const props = {id: 2, playerId: 0, content: 'fly', availableMoves: []};
    return render(<Tile {...props}/>).container.firstElementChild as HTMLElement;
};

describe('Tile Render', () => {
    test('tile color is the player\'s color', () => {
        expect(tileCanMove().style.getPropertyValue('--color')).toBe('#f64c72');
        expect(tileNoMove().style.getPropertyValue('--color')).toBe('#85dcbc');
    });

    test('tile has content', () => {
        expect(tileNoMove().textContent).toBe('fly');
        expect(tileCanMove().textContent).toBe('ant');
    });
});

describe('Tile drag and drop', () => {
    function simulateEvent(target: HTMLElement, type: string) {
        const preventDefault = jest.fn();
        const e = new MouseEvent(type, {bubbles: true});
        Object.assign(e, {preventDefault});
        fireEvent(target, e);

        return preventDefault;
    }

    test('Tile is draggable when there are available moves', () => {
        expect(tileCanMove().attributes.getNamedItem('draggable')).toHaveProperty('value', 'true');
    });

    test('is *not* draggable when there are no moves available', () => {
        expect(tileNoMove().attributes.getNamedItem('draggable')).toHaveProperty('value', 'false');
    });

    test('on drag emits start event', () => {
        jest.spyOn(useEmitter(), 'emit');
        fireEvent.dragStart(tileCanMove());

        const expectedEvent: TileDragEvent = {
            type: 'start',
            tileId: 1,
            tileMoves: [{q: 1, r: 1}]
        };

        expect(useEmitter().emit).toHaveBeenCalledWith(expectedEvent);
    });

    test('on dragEnd emits end event', () => {
        jest.spyOn(useEmitter(), 'emit');
        fireEvent.dragEnd(tileCanMove());
        const expectedEvent: TileDragEvent = {
            type: 'end',
            tileId: 1,
            tileMoves: [{q: 1, r: 1}]
        };

        expect(useEmitter().emit).toHaveBeenCalledWith(expectedEvent);
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

