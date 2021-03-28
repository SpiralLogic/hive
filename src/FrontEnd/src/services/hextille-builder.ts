import { Cell, Row } from '../domain';

export class HextilleBuilder {
  private readonly hexagons: Cell[];
  private readonly firstRow: number;
  private readonly height: number;
  private readonly firstColumn: number;
  private readonly width: number;

  constructor(hexagons: Cell[]) {
    this.hexagons = hexagons.sort((c1, c2) => c1.coords.r - c2.coords.r || c1.coords.q - c2.coords.q);
    [this.firstRow, this.height] = this.determineHeight(this.hexagons);
    [this.firstColumn, this.width] = this.determineWidth(this.hexagons);
  }

  private determineWidth = (cells: Cell[]): [number, number] => {
    const [min, max] = cells.reduce(([m1, m2], c) => [Math.min(m1, c.coords.q), Math.max(m2, c.coords.q)], [
      0,
      0,
    ]);
    return [min, max - min + 1];
  };

  private determineHeight = (cells: Cell[]): [number, number] => {
    const firstCell = cells[0]!;
    const lastCell = cells[cells.length - 1]!;
    const height = lastCell.coords.r - firstCell.coords.r + 1;
    return [firstCell.coords.r - 1, height + 2];
  };
  private createEmptyRow = (i: number): Row => {
    return {
      id: this.firstRow + i,
      hidden: i === 0 || i === this.height - 1,
      cells: Array.from(Array(this.width).keys(), (j: number) => ({
        coords: { q: this.firstColumn + j, r: this.firstRow + i },
        tiles: [],
        hidden: true,
      })),
    };
  };

  private createEmptyRows = () => Array.from(Array(this.height).keys(), this.createEmptyRow);

  createRows = (): Row[] =>
    this.hexagons.reduce((rows, cell) => {
      rows[cell.coords.r - this.firstRow]!.cells[cell.coords.q - this.firstColumn] = cell;
      return rows;
    }, this.createEmptyRows());
}
