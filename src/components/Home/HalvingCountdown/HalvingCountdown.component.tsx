import React, { useContext, useEffect, useState } from 'react';
import useFetch from 'react-fetch-hook';

import { IBlock } from 'interfaces/IBlock.interface';

import { CoinInfoContext } from 'context/CoinInfo.context';

import { getBaseUrl } from 'utils/getBaseUrl.util';

import classes from './HalvingCountdown.module.scss';
import { CoinEventsContext } from 'context/CoinEvents.context';

import animation from 'assets/loading_large.svg';

const getCurrentTime = (): number => {
    return Math.floor(Number(new Date()) / 1000);
};

const getBlockTime = (block: IBlock): number => {
    return block.firstseen !== undefined ? block.firstseen : block.timestamp;
};

interface ITimeInUnits {
    days: number;
    daysPostfix: string;    
    hours: number;
    hoursPostfix: string;
    mins: number;
    minsPostfix: string;
    secs: number;
    secsPostfix: string;
};

export const HalvingCountdown: React.FC = () => {
    const RETARGET_INTERVAL = 1800;
    const ONE_MONTH = 3600 * 24 * 30;
    const FINAL_COUNTDOWN_MINIMUM = 10;
    const POSTEVENT_NOTICE_WINDOW = 1000;
    const AVERAGE_BLOCKTIME_WINDOW = 50000;

    const coinInfo = useContext(CoinInfoContext);
    const coinEvents = useContext(CoinEventsContext);
    const baseUrl = getBaseUrl(coinInfo.ticker);
    const { data: latestBlocks } = useFetch<IBlock[]>(`${baseUrl}/blocks/?start=-1&limit=1`);

    const [ currentTime, setCurrentTime ] = useState<number>(getCurrentTime());
    const [ latestBlock, setLatestBlock ] = useState<IBlock>();
    const [ isHalvingSoon, setHalvingSoon ] = useState<Boolean>(false);
    const [ isHalvingImminent, setHalvingImminent ] = useState<Boolean>(false);
    const [ justHalved, setJustHalved ] = useState<Boolean>(false);
    const [ nextHalvingBlockHeight, setNextHalvingBlockHeight ] = useState<number>(coinInfo.blockRewardHalvingInterval);
    const [ averageBlockTime, setAverageBlockTime ] = useState<number>(coinInfo.blockTime);
    const [ blocksTillHalving, setBlocksTillHalving ] = useState<number>();
    const [ secondsTillHalving, setSecondsTillHalving ] = useState<number>();
    const [ timeTillHalving, setTimeTillHalving ] = useState<ITimeInUnits>();
    const [ latestCheckpointBlockHeight, setLatestCheckpointBlockHeight ] = useState<number>(-1);
    const [ latestCheckpointBlock, setLatestCheckpointBlock ] = useState<IBlock>();

    const { data: checkpointBlockInfo } = useFetch<IBlock[]>(`${baseUrl}/blocks/?start=${latestCheckpointBlockHeight}&limit=1`);
    const { data: historicalBlocks } = useFetch<IBlock[]>(`${baseUrl}/blocks/?start=${latestCheckpointBlockHeight-AVERAGE_BLOCKTIME_WINDOW}&limit=1`);

    useEffect(() => {
        const ival = setInterval(() => {
            setCurrentTime(getCurrentTime())
        }, 1000);
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
        if (checkpointBlockInfo !== undefined && historicalBlocks !== undefined) {
            setAverageBlockTime((getBlockTime(checkpointBlockInfo[0]) - getBlockTime(historicalBlocks[0])) / AVERAGE_BLOCKTIME_WINDOW);
        }
    }, [checkpointBlockInfo, historicalBlocks, AVERAGE_BLOCKTIME_WINDOW]);

    useEffect(() => {
        if (latestBlock !== undefined) {
            setJustHalved(nextHalvingBlockHeight > coinInfo.blockRewardHalvingInterval && latestBlock.height - nextHalvingBlockHeight + coinInfo.blockRewardHalvingInterval < POSTEVENT_NOTICE_WINDOW);
            setHalvingSoon((nextHalvingBlockHeight - latestBlock.height) * coinInfo.blockTime < ONE_MONTH);

            const blocksTillHalving = nextHalvingBlockHeight - latestBlock.height;
            setBlocksTillHalving(blocksTillHalving);
            setHalvingImminent(blocksTillHalving <= FINAL_COUNTDOWN_MINIMUM);
        }
    }, [latestBlock, nextHalvingBlockHeight, coinInfo, ONE_MONTH, FINAL_COUNTDOWN_MINIMUM, POSTEVENT_NOTICE_WINDOW]);

    useEffect(() => {
        if (isHalvingSoon) {
            setLatestCheckpointBlockHeight(latestBlock!.height - (latestBlock!.height % Math.floor(RETARGET_INTERVAL / coinInfo.blockTime)));
        }
    }, [isHalvingSoon, latestBlock, coinInfo, RETARGET_INTERVAL]);

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
        if (secondsTillHalving !== undefined) {
            const days = Math.floor(secondsTillHalving / (3600 * 24));
            const hours = Math.floor(secondsTillHalving % (3600 * 24) / 3600);
            const mins = Math.floor(secondsTillHalving % 3600 / 60);
            const secs = secondsTillHalving % 60;

            setTimeTillHalving({
                days: days,
                daysPostfix: days !== 1 ? 's' : '',
                hours: hours,
                hoursPostfix: hours !== 1 ? 's' : '',
                mins: mins,
                minsPostfix: mins !== 1 ? 's' : '',
                secs: secs,
                secsPostfix: secs !== 1 ? 's' : '',
            });
        }
    }, [secondsTillHalving]);

    useEffect(() => {
        coinEvents.blockEvents.subscribe((block: IBlock) => {
            setLatestBlock(block);
        });
    });

    return isHalvingImminent ? (
        <div className={classes.halving}>
            <h1><span className={classes.capitalize}>{coinInfo.name}'s</span> block reward halving is imminent!</h1>
            <div className={classes.nobreak}><img src={animation} alt="" /><div className={classes.countdown2}> Only <div className={classes.blkcntdwn}>{blocksTillHalving}</div> blocks to go</div></div>
            <div>until {coinInfo.name}'s block reward changes from <span className={classes.mono}>{latestBlock?.miningreward}</span> to <span className={classes.mono}>{latestBlock!.miningreward / 2} <span className={classes.ticker}>{coinInfo.displaySymbol}</span></span> at block <span className={classes.mono}>{nextHalvingBlockHeight}</span>.</div>
        </div>
    ) : isHalvingSoon ? (
        <div className={classes.halving}>
            <h1><span className={classes.capitalize}>{coinInfo.name}'s</span> block reward is halving soon</h1>
            <div className={classes.countdown}><span className={classes.mono}>{timeTillHalving?.days}</span> day{timeTillHalving?.daysPostfix}, <span className={classes.mono}>{timeTillHalving?.hours}</span> hour{timeTillHalving?.hoursPostfix}, <span className={classes.mono}>{timeTillHalving?.mins}</span> minute{timeTillHalving?.minsPostfix} and <span className={classes.mono}>{timeTillHalving?.secs}</span> second{timeTillHalving?.secsPostfix}</div>
            <div>until {coinInfo.name}'s block reward changes from <span className={classes.mono}>{latestBlock?.miningreward}</span> to <span className={classes.mono}>{latestBlock!.miningreward / 2} <span className={classes.ticker}>{coinInfo.displaySymbol}</span></span> at block <span className={classes.mono}>{nextHalvingBlockHeight}</span>.</div>
        </div>
    ) : justHalved ? (
        <div className={classes.halving}>
            <h1><span className={classes.capitalize}>{coinInfo.name}'s</span> block reward has halved!</h1>
            <div><span className={classes.capitalize}>{coinInfo.name}'s</span> block reward changed to <span className={classes.mono}>{latestBlock!.miningreward} <span className={classes.ticker}>{coinInfo.displaySymbol}</span></span> at block <span className={classes.mono}>{nextHalvingBlockHeight-coinInfo.blockRewardHalvingInterval}</span>.</div>
        </div>
    ) : null;
};
