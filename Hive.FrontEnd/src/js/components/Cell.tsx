import * as React from 'react';
import { useDrop } from 'react-dnd';
import { IGameCoordinate, ITile } from '../domain';
import { Tile, TILE_TYPE } from './Tile';

interface CellProps {
    tiles: ITile[],
    coordinates: IGameCoordinate
}

const areEqual = (a: IGameCoordinate, b: IGameCoordinate) => {
    return a && b && a.q === b.q && a.r === b.r;
};

const isValidMove = (move: IGameCoordinate, validMoves: IGameCoordinate[]) => {
    return validMoves.some(dest => areEqual(move, dest));
};

export const Cell: React.FunctionComponent<CellProps> = ({
    tiles,
    coordinates,
}) => {
    const [{ isOver, canDrop }, drop] = useDrop({
        accept: TILE_TYPE,
        drop: () => coordinates,
        canDrop: (item, monitor) => isValidMove(coordinates, monitor.getItem().availableMoves),
        collect: monitor => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    })
    ;

    const color = () => {
        if (canDrop) return ' valid-cell';
        if (isOver) return ' invalid-cell';
        return '';
    };

    return (
        <div className={'hex cell' + color()} ref={drop}>
            {tiles.length > 0 && <Tile {...tiles[0]} />}
        </div>
    );
};