import { IReference } from './IReference.interface';

export interface IAddressInfo {
    address: string;
    balance: number;
    mutations: IReference;
    pending: number;
    aliases: string[];
}
