export interface ICellStyle {
    align?: 'left' | 'center' | 'right';
    size?: string;
    color?: 'normal' | 'lighter' | 'light' | 'darker';
    fontSize?: 'normal' | 'smaller' | 'small';
    textColor?: string;
    linkColor?: 'normal' | 'accentuate';
    sunken?: boolean;
    sunkenData?: boolean;
    dataNotImportant?: boolean;
}

export interface ICell {
    label?: string;
    largelabel?: boolean;
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
