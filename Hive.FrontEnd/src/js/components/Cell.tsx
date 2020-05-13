import * as React from 'react';
import { useDrop } from 'react-dnd';
import { Hexagon, HexCoordinates } from '../domain';
import { Tile, TILE_TYPE } from './Tile';

type CellProps = Hexagon

const areEqual = (a: HexCoordinates, b: HexCoordinates) => a && b && a.q === b.q && a.r === b.r;
const isValidMove = (move: HexCoordinates, validMoves: HexCoordinates[]) => validMoves.some(dest => areEqual(move, dest));
const coordinateToString = ({ q, r }: HexCoordinates) => `${q}-${r}`;

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
    });

    const backGroundColor = () => {
        if (canDrop && isOver) return ' valid-cell active';
        if (isOver) return ' invalid-cell';
        if (canDrop) return ' valid-cell';
        return '';
    };
    const id = coordinateToString(coordinates);
    return (
        <div className={'hex cell' + backGroundColor()} ref={drop}>
            {tiles.length > 0 && <Tile key={'tile' + id} {...tiles[0]} />}
        </div>
    );
};

Cell.displayName = 'Cell';