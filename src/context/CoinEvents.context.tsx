import { createContext, useContext, useEffect } from 'react';
import { Subject, Subscription } from 'rxjs';

import { IBlock } from '../interfaces/IBlock.interface';
import { IUnconfirmedTransaction } from '../interfaces/ITransaction.interface';
import { IEventMessage } from '../interfaces/IEventMessage.interface';
import { ICoinInfo } from 'interfaces/ICoinInfo.interface';
import { getBaseUrl } from 'utils/getBaseUrl.util';
import { CoinInfoContext } from './CoinInfo.context';

export interface ICoinEvents {
    blockEvents: WrappedSubject<IBlock>;
    mempoolEvents: WrappedSubject<IUnconfirmedTransaction[]>;
}

const CoinEventsContext = createContext<ICoinEvents>(null!);
export { CoinEventsContext };

const isString = (s: any): boolean => {
    return s + '' === s;
};

class WrappedSubject<T>
{
    eventClass: string;
    subject: Subject<T>;
    parent: CoinEventManager;

    constructor(eventClass: string, parent: CoinEventManager) {
        this.parent = parent;
        this.eventClass = eventClass;
        this.subject = new Subject<T>();
    }

    subscribe(next: (value: T) => void): Subscription {
        this.parent.makeActive(this.eventClass);
        return this.subject.subscribe(next);
    }

    next(event: T): void {
        this.subject.next(event);
    }
}

export class CoinEventManager implements ICoinEvents
{
    blockEvents: WrappedSubject<IBlock>;
    mempoolEvents: WrappedSubject<IUnconfirmedTransaction[]>;
    cleanUp: () => void;
    asEffect: () => () => void;

    _baseUrl: string;
    _activeEvents: string[];
    _source?: EventSource;

    constructor(baseUrl: string|ICoinInfo) {
        this.blockEvents = new WrappedSubject<IBlock>('blocks', this);
        this.mempoolEvents = new WrappedSubject<IUnconfirmedTransaction[]>('mempool', this);

        this.cleanUp = () => {
            if (this._source !== undefined) {
                this._source.close();
            }
        }

        this.asEffect = () => this.cleanUp;

        this._baseUrl = isString(baseUrl) ? baseUrl as string : getBaseUrl((baseUrl as ICoinInfo).ticker);
        this._activeEvents = ['keepalive'];
    }

    makeActive(eventClass: string): void {
        if (!this._activeEvents.includes(eventClass))
        {
            this._activeEvents.push(eventClass);
            this.reopen();    
        }
    }

    handleMessage(message: IEventMessage): void {
        const { event, data } = message;

        if (event === 'mempoolupdate') {
            this.mempoolEvents.next((data as unknown) as IUnconfirmedTransaction[]);
        } else if (event === 'newblock') {
            this.blockEvents.next((data as unknown) as IBlock);
        }
    }

    close(): void {
        if (this._source !== undefined) {
            this._source.close();
        }
    }

    reopen(): void {
        this.close();

        this._source = new EventSource(`${this._baseUrl}/events/subscribe?channels=${this._activeEvents.join(',')}`);
        this._source.addEventListener('message', (message) =>
            this.handleMessage(JSON.parse(message.data) as IEventMessage)
        );    
    }
}

interface IProps {
    children: JSX.Element
}

export const CoinEventsProvider: React.FC<IProps> = ({ children }) => {
    const coinInfo = useContext(CoinInfoContext);
    const manager = new CoinEventManager(coinInfo);

    useEffect(manager.asEffect, []);

    return (
        <CoinEventsContext.Provider value={manager}>
            {children}
        </CoinEventsContext.Provider>
    );
};
