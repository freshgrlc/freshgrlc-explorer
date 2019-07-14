import React, { useContext } from 'react';

import { CoinInfoContext } from 'context/CoinInfo.context';

import { IAddressInfo } from 'interfaces/IAddressInfo.interface';
import { IRow } from 'interfaces/IRow.interface';
import { ICell, ICellStyle } from 'interfaces/ICell.interface';
import { TransactionOutputType } from 'interfaces/ITransaction.interface';

import { Row } from 'components/Row/Row.component';


import classes from './AddressMetaInfo.module.scss';

interface IProps {
    address: IAddressInfo;
    addressType?: TransactionOutputType
}

const AddressTypeDescriptions: { [key: string]: string } = {
    p2pkh_true: 'Pay to Public Key Hash (p2pkh)',
    p2pkh_false: 'Pay to Public Key Hash (p2pkh)',
    p2wpkh_true: 'Pay to Public Key Hash (p2pkh)',
    p2wpkh_false: 'Pay to Witness Public Key Hash, native SegWit only (p2wpkh)',
    p2sh_false: 'Pay to Script Hash (p2sh)',
    p2wsh_false: 'Pay to Witness Script Hash, native SegWit only (p2wsh)',
};


export const AddressMetaInfo: React.FC<IProps> = ({ address, addressType }) => {
    const coinInfo = useContext(CoinInfoContext);

    const hasAliases = address.aliases != null && address.aliases.length > 0;
    const table: IRow[] = ([
        {
            label: 'Address type',
            cells: [
                {
                    data: addressType ? AddressTypeDescriptions[addressType + '_' + hasAliases.toString()] : undefined,
                    notMono: true
                },
            ],
        },
        {
            label: hasAliases ? 'SegWit Base-58 Alias' : undefined,
            cells: [
                {
                    data: hasAliases ? address.aliases[0] : 'n/a'
                },
            ],
        },
        {
            label: hasAliases ? 'SegWit Bech-32 Alias' : undefined,
            cells: [
                {
                    data: hasAliases ? address.aliases[1] : 'n/a'
                },
            ],
        },
        {
            label: 'Balance',
            cells: [
                {
                    data: address.balance,
                    unit: coinInfo ? coinInfo.displaySymbol : '',
                    alwaysSingular: true,
                    decimals: 8
                },
            ],
        },
        {
            label: 'Pending',
            cells: address.pending !== 0.0 ? [
                {
                    data: address.pending,
                    unit: coinInfo ? coinInfo.displaySymbol : '',
                    alwaysSingular: true,
                    decimals: 8
                },
            ] : [
                {
                    data: '-'
                },
            ],
        }
    ] as IRow[]).filter(e => e.label !== undefined).map(
        (row: IRow): IRow => {
            row.cells.forEach((cell: ICell) => {
                if (cell.cellStyle === undefined) {
                    cell.cellStyle = {} as ICellStyle;
                }
                cell.cellStyle.align = 'left';
            });
            return row;
        }
    );

    return (
        <div className={classes.addressMetaInfo}>
            <h3 className={classes.header}>
                Address <span className={classes.address}>{address.address}</span>
            </h3>
            {table.map((entry, index) => (
                <Row key={index} wide={true} labelWidth="200px" {...entry} />
            ))}
        </div>
    );
};
