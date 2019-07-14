import { ICell } from './ICell.interface';

export interface IRow {
    label: string;
    labelWidth?: string;
    labelSubText?: string;
    labelSubTextLink?: string;
    cells: ICell[];
    wide?: boolean;
    extrawide?: boolean;
}
