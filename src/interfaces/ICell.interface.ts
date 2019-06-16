export interface ICellStyle {
    align?: 'right';
    size?: string;
    color?: 'normal' | 'lighter' | 'light' | 'darker';
    fontSize?: 'normal' | 'smaller' | 'small';
}

export interface ICell {
  label?: string;
  data?: string | Number;
  link?: string | null;
  externalLink?: boolean;
  unit?: string;
  notMono?: boolean;
  decimals?: Number;
  alwaysSingular?: boolean;
  cellStyle?: ICellStyle;
}
