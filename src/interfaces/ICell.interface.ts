export interface ICellStyle {
    align?: 'left' | 'center' | 'right';
    size?: string;
    color?: 'normal' | 'lighter' | 'light' | 'darker';
    fontSize?: 'normal' | 'smaller' | 'small';
    linkColor?: 'normal' | 'accentuate';
}

export interface ICell {
    label?: string;
    data?: string | Number;
    link?: string | null;
    externalLink?: boolean;
    unit?: string;
    notMono?: boolean;
    decimals?: number;
    maxDecimals?: number;
    alwaysSingular?: boolean;
    cellStyle?: ICellStyle;
}
