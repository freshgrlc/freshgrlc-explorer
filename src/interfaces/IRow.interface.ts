import { ICell } from "./ICell.interface";

export interface IRow {
  label: string;
  labelWidth?: string;
  cells: ICell[];
  wide?: boolean;
}
