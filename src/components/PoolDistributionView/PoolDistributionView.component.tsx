import React, { useEffect, useState } from 'react';
import useFetch from 'react-fetch-hook';

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import { CoinTickerSymbol } from 'interfaces/ICoinInfo.interface';

import { getBaseUrl } from 'utils/getBaseUrl.util';
import { getCoinInfo, getAllCoins } from 'utils/getCoinInfo.util';

import { IPoolStat } from 'interfaces/IPoolStat.interface';

import { Banner } from 'components/Banner/Banner.component';
import { Section } from 'components/Section/Section.component';
import { TabBar } from 'components/TabBar/TabBar.component';
import { PageLoadAnimation } from 'components/PageLoadAnimation/PageLoadAnimation.component';

import classes from './PoolDistributionView.module.scss';


type Period = 'day' | 'week' | 'month' | 'year' | 'alltime';

interface IProps {
    routeParams: {
        coin: CoinTickerSymbol;
    };
    queryParams: {
        period?: Period;
    }
}

const PeriodTime: { [key: string]: number } = {
    day: 86400,
    week: 604800,
    month: 2592000,
    year: 31104000,
    alltime: -1
};

const PeriodDescription: { [key: string]: string } = {
    day: 'Last 24 hours',
    week: 'Last week',
    month: 'Last month',
    year: 'Last 12 months',
    alltime: 'Since genesis block'
};

export const PoolDistributionView: React.FC<IProps> = ({ routeParams, queryParams }) => {
    const baseUrl = getBaseUrl(routeParams.coin);
    const coinInfo = getCoinInfo(routeParams.coin);

    if (!queryParams.period || Object.keys(PeriodTime).indexOf(queryParams.period) < 0) {
        queryParams.period = 'week';
    }

    const [ sinceTimestamp, setSinceTimestamp ] = useState<number | undefined>(undefined);
    useEffect(() => {
        setSinceTimestamp(queryParams.period ? PeriodTime[queryParams.period] > 0 ? Math.floor(Date.now() / 1000) - PeriodTime[queryParams.period] : 0 : undefined);
    }, [queryParams]);

    const { data, isLoading } = useFetch<IPoolStat[]>(`${baseUrl}/poolstats/?since=${sinceTimestamp}`, {
            depends: [sinceTimestamp !== undefined]
        }
    );

    const [ highchartsData, setHighchartsData ] = useState<any | undefined>(undefined);
    useEffect(() => {
        setHighchartsData(!data ? undefined : {
            chart: {
                type: 'pie',
                backgroundColor: '#2e2c29',
                height: 600,
                width: 1100
            },
            title: {
                text: `Hashrate distribution (${PeriodDescription[queryParams.period as Period]})`,
                style: {
                    color: '#ffa71a',
                    fontSize: '24px'
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        style: {
                            backgroundColor: '#2e2c29',
                            color: 'rgba(255, 226, 179, 0.87)',
                            textOutline: '0px',
                            fontWeight: 'normal',
                            fontSize: '15px'
                        }
                    },
                    colors: ['#4D4D4D', '#5DA5DA', '#FAA43A', '#60BD68', '#F17CB0', '#B2912F', '#B276B2', '#DECF3F', '#F15854']
                }
            },
            tooltip: {
                pointFormat: '<b>{point.y} blocks mined</b> ({point.percentage:.1f}%)',
            },
            series: [{
                data: data.map(entry => ({
                    name: entry.name,
                    y: entry.amountmined
                })).sort((e1, e2) => e1.y > e2.y ? -1 : 1)
            }]
        });
    }, [data, queryParams]);

    return (
        <>
            <Banner coins={getAllCoins()} preferredCoin={coinInfo ? coinInfo.ticker : undefined} />
            <Section header="Hashrate distribution across mining pools">
                <p className={classes.description}>
                    Shows the average hashrate distribution across mining pools based on the blocks found by them during a certain time period.
                    Note that for smaller pools this might be less precise as the data might be skewed due to the pool's luck.
                </p>
                <TabBar
                    options={Object.keys(PeriodDescription).map(name => ({
                        name: name,
                        displayName: PeriodDescription[name]
                    }))}
                    selected={queryParams.period}
                    parameterName="period"
                    baseUrl={`/${coinInfo.ticker}/pooldistribution`}
                />
                {!isLoading && highchartsData ? (
                    <div className={classes.outerWrapper}>
                        <div className={classes.wrapper}>
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={highchartsData}
                            />
                        </div>
                    </div>
                ) : (
                    <PageLoadAnimation />
                )}
            </Section>
        </>
    );
};
