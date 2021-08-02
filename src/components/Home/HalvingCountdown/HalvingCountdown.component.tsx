import React, { useContext, useEffect, useState } from 'react';
import useFetch from 'react-fetch-hook';

import { IBlock } from 'interfaces/IBlock.interface';

import { CoinInfoContext } from 'context/CoinInfo.context';

import { getBaseUrl } from 'utils/getBaseUrl.util';

import classes from './HalvingCountdown.module.scss';
import { CoinEventsContext } from 'context/CoinEvents.context';

const getCurrentTime = (): number => {
    return Math.floor(Number(new Date()) / 1000);
};

const getBlockTime = (block: IBlock): number => {
    return block.firstseen !== undefined ? block.firstseen : block.timestamp;
};

export const HalvingCountdown: React.FC = () => {
    const SIX_HOURS = 3600 * 6;
    const ONE_MONTH = 3600 * 24 * 30;
    const FINAL_COUNTDOWN_MINIMUM = 10;
    const AVERAGE_BLOCKTIME_WINDOW = 50000;

    const coinInfo = useContext(CoinInfoContext);
    const coinEvents = useContext(CoinEventsContext);
    const baseUrl = getBaseUrl(coinInfo.ticker);
    const { data: latestBlocks } = useFetch<IBlock[]>(`${baseUrl}/blocks/?start=-1&limit=1`);
    const { data: historicalBlocks } = useFetch<IBlock[]>(`${baseUrl}/blocks/?start=-${AVERAGE_BLOCKTIME_WINDOW+1}&limit=1`);

    const [ currentTime, setCurrentTime ] = useState<number>(getCurrentTime());
    const [ latestBlock, setLatestBlock ] = useState<IBlock>();
    const [ isHalvingSoon, setHalvingSoon ] = useState<Boolean>(false);
    const [ isHalvingImminent, setHalvingImminent ] = useState<Boolean>(false);
    const [ nextHalvingBlockHeight, setNextHalvingBlockHeight ] = useState<number>(coinInfo.blockRewardHalvingInterval);
    const [ averageBlockTime, setAverageBlockTime ] = useState<number>(coinInfo.blockTime);
    const [ blocksTillHalving, setBlocksTillHalving ] = useState<number>();
    const [ secondsTillHalving, setSecondsTillHalving ] = useState<number>();
    const [ latestCheckpointBlockHeight, setLatestCheckpointBlockHeight ] = useState<number>(-1);
    const [ latestCheckpointBlock, setLatestCheckpointBlock ] = useState<IBlock>();

    const { data: checkpointBlockInfo } = useFetch<IBlock[]>(`${baseUrl}/blocks/?start=${latestCheckpointBlockHeight}&limit=1`);

    useEffect(() => {
        const ival = setInterval(() =>
            setCurrentTime(getCurrentTime())
        , 1000);
        return () => clearInterval(ival)
    }, []);
    
    useEffect(() => {
        setLatestBlock(latestBlocks !== undefined ? latestBlocks[0] : undefined);
    }, [latestBlocks]);
    
    useEffect(() => {
        if (latestBlock !== undefined) {
            const halvings = Math.ceil(latestBlock.height / coinInfo.blockRewardHalvingInterval);
            setNextHalvingBlockHeight(coinInfo.blockRewardHalvingInterval * halvings);
        }
    }, [latestBlock, coinInfo]);

    useEffect(() => {
        if (latestBlock !== undefined && historicalBlocks !== undefined) {
            setAverageBlockTime((getBlockTime(latestBlock) - getBlockTime(historicalBlocks[0])) / AVERAGE_BLOCKTIME_WINDOW);
        }
    }, [latestBlock, historicalBlocks, AVERAGE_BLOCKTIME_WINDOW]);

    useEffect(() => {
        if (latestBlock !== undefined) {
            setHalvingSoon((nextHalvingBlockHeight - latestBlock.height) * coinInfo.blockTime < ONE_MONTH);

            const blocksTillHalving = nextHalvingBlockHeight - latestBlock.height;
            setBlocksTillHalving(blocksTillHalving);
            setHalvingImminent(blocksTillHalving <= FINAL_COUNTDOWN_MINIMUM);
        }
    }, [latestBlock, nextHalvingBlockHeight, coinInfo, ONE_MONTH, FINAL_COUNTDOWN_MINIMUM]);

    useEffect(() => {
        if (isHalvingSoon) {
            setLatestCheckpointBlockHeight(latestBlock!.height - (latestBlock!.height % Math.floor(SIX_HOURS / coinInfo.blockTime)));
        }
    }, [isHalvingSoon, latestBlock, coinInfo, SIX_HOURS]);

    useEffect(() => {
        if (checkpointBlockInfo !== undefined) {
            setLatestCheckpointBlock(checkpointBlockInfo[0]);
        }
    }, [checkpointBlockInfo]);

    useEffect(() => {
        if (latestCheckpointBlock !== undefined) {
            const height = latestCheckpointBlock.height;
            const timestamp = getBlockTime(latestCheckpointBlock);
            const targetTime = Math.round(timestamp + (nextHalvingBlockHeight - height) * averageBlockTime);
            setSecondsTillHalving(targetTime - currentTime);
        }
    }, [latestCheckpointBlock, averageBlockTime, nextHalvingBlockHeight, currentTime]);

    useEffect(() => {
        coinEvents.blockEvents.subscribe((block: IBlock) => {
            setLatestBlock(block);
        });
    })

    return isHalvingImminent ? (
        <div>
            <p>{blocksTillHalving} till {nextHalvingBlockHeight}</p>
        </div>
    ) : isHalvingSoon ? (
        <div>
            <p>{secondsTillHalving} till {nextHalvingBlockHeight} (at {averageBlockTime} per block)</p>
        </div>
    ) : null;
};
