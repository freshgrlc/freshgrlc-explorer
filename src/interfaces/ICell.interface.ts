export interface ICellStyle {
    align?: 'right';
    size?: string;
    color?: 'normal' | 'lighter' | 'light' | 'darker';
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
