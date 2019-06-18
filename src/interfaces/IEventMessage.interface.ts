import { IBlock } from './IBlock.interface';
import { IUnconfirmedTransaction } from './ITransaction.interface';

export interface IEventMessage {
    event: string;
    channel: string;
    data: IUnconfirmedTransaction | IBlock | null;
}
