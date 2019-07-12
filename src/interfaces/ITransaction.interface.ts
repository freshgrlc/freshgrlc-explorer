import { IBlock } from './IBlock.interface';
import { IReference, IBlockReference, ITransactionOutputReference, ISpentTransactionOutputReference } from './IReference.interface';

export type TransactionOutputType = 'p2pk' | 'p2pkh' | 'p2sh' | 'p2wpkh' | 'p2wsh' | 'data' | 'raw';

export interface ITransactionMutations {
    inputs: { [key: string]: number };
    outputs: { [key: string]: number };
}

export interface ITransactionInput {
    amount: number;
    type: TransactionOutputType;
    spends: ITransactionOutputReference;
    address: string;
}
export type TransactionInputs = { [key: string]: ITransactionInput };

export interface ISimplifiedTransactionInput {
    address: string;
    type: TransactionOutputType;
    amount: number;
    inputsAmount: number;
    txid: string | undefined;
}

export interface ITransactionOutput {
    spentby: ISpentTransactionOutputReference;
    amount: number;
    address: string | null;
    type: TransactionOutputType;
    script: string;
}
export type TransactionOutputs = { [key: string]: ITransactionOutput };

export interface ITransaction {
    confirmed: boolean;
    fee: number;
    txid: string;
    coinbase: boolean;
    totalvalue: number;
    firstseen: number | null;
    pending?: number;
    size: number;

    block: IBlockReference | IBlock | null;
    inputs: IReference | TransactionInputs;
    outputs: IReference | TransactionOutputs;
    mutations: IReference | ITransactionMutations;
}

export interface IUnconfirmedTransaction extends Omit<ITransaction, 'block'> {
    block: null;
}

export interface IBlockTransaction extends Omit<ITransaction, 'block'> {
    block: IBlockReference;
}

export interface IExpandedTransaction extends ITransaction {
    inputs: TransactionInputs;
    outputs: TransactionOutputs;
    mutations: ITransactionMutations;
    block: IBlock | null;
}

export interface IExpandedBlockTransaction extends IBlockTransaction {
    inputs: TransactionInputs;
    outputs: TransactionOutputs;
    mutations: ITransactionMutations;
    block: IBlockReference;
}
