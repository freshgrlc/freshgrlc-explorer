export interface IReference {
    href: string;
}

export interface ITransactionReference extends IReference {
    txid: string;
}

export interface ISpentTransactionOutputReference extends ITransactionReference {
    input: number;
}

export interface ITransactionOutputReference extends ITransactionReference {
    output: number;
}
