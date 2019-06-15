export interface ICellStyle {
    align?: 'right';
    size?: string;
}

export interface ICell {
  label?: string;
  data?: string | Number;
  link?: string | null;
  unit?: string;
  notMono?: boolean;
  decimals?: Number;
  alwaysSingular?: boolean;
  cellStyle?: ICellStyle;
}
