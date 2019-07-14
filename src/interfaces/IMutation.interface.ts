import { ITransactionReference } from 'interfaces/IReference.interface';
import { ITransaction } from 'interfaces/ITransaction.interface';

export interface IMutation {
    confirmed: boolean;
    change: number;
    time: number;
    transaction: ITransaction | ITransactionReference
}
