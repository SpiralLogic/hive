import { Cell, Row } from '../domain';

export class HextilleBuilder {
  private readonly hexagons: Cell[];
  private readonly firstRow: number;
  private readonly height: number;
  private readonly firstColumn: number;
  private readonly width: number;

  constructor(hexagons: Cell[]) {
    hexagons.sort((c1, c2) => c1.coords.r - c2.coords.r || c1.coords.q - c2.coords.q);
    [this.firstRow, this.height] = this.determineHeight(hexagons);
    [this.firstColumn, this.width] = this.determineWidth(hexagons);
    this.hexagons = hexagons;
  }

  private determineWidth = (cells: Cell[]): [number, number] => {
    const min = Math.min(...cells.map((c) => c.coords.q));
    const max = Math.min(...cells.map((c) => c.coords.r));
    return [min, max - min + 1];
  };

  private determineHeight = (cells: Cell[]): [number, number] => {
    const firstCell = cells[0]!;
    const lastCell = cells[cells.length - 1]!;
    const height = lastCell.coords.r - firstCell.coords.r + 1;
    return [firstCell.coords.r - 1, height + 2];
  };
  private createEmptyRow = (index: number): Row => {
    return {
      id: this.firstRow + index,
      hidden: index === 0 || index === this.height - 1,
      cells: [...Array.from({ length: this.width }).keys()].map((index_: number) => ({
        coords: { q: this.firstColumn + index_, r: this.firstRow + index },
        tiles: [],
        hidden: true,
      })),
    };
  };

  private createEmptyRows = () =>
    [...Array.from({ length: this.height }).keys()].map((element) => this.createEmptyRow(element));

  createRows = (): Row[] => {
    const rows = this.createEmptyRows();
    for (const cell of this.hexagons) {
      rows[cell.coords.r - this.firstRow]!.cells[cell.coords.q - this.firstColumn] = cell;
    }
    return rows;
  };
}