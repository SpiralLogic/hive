import { Cell } from './cell';

export type Row = { id: number; hidden: boolean; cells: Array<Cell & { hidden?: boolean }> };
