import * as React from 'react';
import { HexCoordinates, PlayerId, TextContent, TileId } from '../domain';
import { HiveContext } from '../gameContext';

export interface TileProps {
    id: TileId,
    content: TextContent
    playerId: PlayerId,
    availableMoves: HexCoordinates[],
}

export const TILE_TYPE = Symbol();

const areEqual = (a: HexCoordinates, b: HexCoordinates) => a && b && a.q === b.q && a.r === b.r;
const isValidMove = (move: HexCoordinates, validMoves: HexCoordinates[]) => validMoves.some(dest => areEqual(move, dest));

export const Tile: React.FunctionComponent<TileProps> = ({
    id,
    playerId,
    content,
    availableMoves,
}) => {
    const getPlayerColor = React.useContext(HiveContext).getPlayerColor;
    
    function dragstart_handler (ev: React.DragEvent<HTMLDivElement>) {
        ev.dataTransfer.setData('hex-tile', id.toString());
        document.querySelectorAll('.cell').forEach((cell) => {
            if (cell instanceof HTMLDivElement && cell.dataset.coords) {
                const [q, r] = cell.dataset.coords.split(',').map(v => parseInt(v));
                if (!isValidMove({ q, r }, availableMoves)) return;
                cell.classList.add('valid-cell');
            }
        });
    }

    function dragend_handler(ev: React.DragEvent<HTMLDivElement>) {
        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.remove('valid-cell', 'active', 'invalid-cell');
        });
        
        return false;
    }

    const attributes = {
        title: content,
        style: { '--color': getPlayerColor(playerId) },
        className: 'hex tile',
        draggable: !!availableMoves.length,
        onDragStart: dragstart_handler,
        onDragEnd: dragend_handler,
    };

    return (
        <div {...attributes}>
            <span>{content}</span>
        </div>
    );
};

Tile.displayName = 'Tile';