import React, { useEffect, useState } from 'react';
import useFetch from 'react-fetch-hook';

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import { CoinTickerSymbol } from 'interfaces/ICoinInfo.interface';

import { getBaseUrl } from 'utils/getBaseUrl.util';
import { getCoinInfo, getAllCoins } from 'utils/getCoinInfo.util';

import { IBlock } from 'interfaces/IBlock.interface';

import { Banner } from 'components/Banner/Banner.component';
import { Section } from 'components/Section/Section.component';
import { TabBar } from 'components/TabBar/TabBar.component';
import { PageLoadAnimation } from 'components/PageLoadAnimation/PageLoadAnimation.component';

import classes from './DifficultyGraphView.module.scss';


type Period = 'day' | 'week' | 'month' | 'year';

interface IProps {
    routeParams: {
        coin: CoinTickerSymbol;
    };
    queryParams: {
        period?: Period;
    }
}

interface ISeriesEntry {
    x: number;
    y: number;
};

const PeriodTime: { [key: string]: number } = {
    hours: 28800,
    day: 86400,
    week: 604800,
    month: 2592000,
    year: 31104000
};

const TARGET_DATAPOINTS = 300;
const PeriodDatapoints: { [key: string]: number } = {
    hours: 1000,    /* Extra precise */
    day: TARGET_DATAPOINTS,
    week: TARGET_DATAPOINTS,
    month: TARGET_DATAPOINTS,
    year: TARGET_DATAPOINTS
};

const PeriodDescription: { [key: string]: string } = {
    hours: 'Last 8 hours',
    day: 'Last 24 hours',
    week: 'Last week',
    month: 'Last month',
    year: 'Last 12 months'
};

export const DifficultyGraphView: React.FC<IProps> = ({ routeParams, queryParams }) => {
    const baseUrl = getBaseUrl(routeParams.coin);
    const coinInfo = getCoinInfo(routeParams.coin);

    if (!queryParams.period || Object.keys(PeriodTime).indexOf(queryParams.period) < 0) {
        queryParams.period = 'month';
    }

    const getUrlForSeries = (period: number, targetDataPoints: number): string => {
        const blockTime = coinInfo.blockTime + 1;
        const blocks = Math.floor(period / blockTime);
        const interval = Math.ceil(blocks/targetDataPoints);
        const limit = Math.floor(blocks / interval);
        return `${baseUrl}/blocks/?start=${-blocks}&limit=${limit}&interval=${interval}`;
    };
    const convertRawData = (rawData: IBlock[]): ISeriesEntry[] => (
        rawData.map(entry => ({
            x: (entry.firstseen ? entry.firstseen : entry.timestamp) * 1000,
            y: entry.difficulty
        }))
    );

    const [ series1, setSeries1 ] = useState<ISeriesEntry[] | undefined>(undefined);
    const { data: series1Data, isLoading } = useFetch<IBlock[]>(getUrlForSeries(PeriodTime[queryParams.period], PeriodDatapoints[queryParams.period]));
    useEffect(() => {
        setSeries1(series1Data ? convertRawData(series1Data) : undefined);
    }, [series1Data]);

    /*
    const [ series2, setSeries2 ] = useState<ISeriesEntry[] | undefined>(undefined);
    const { data: series2Data } = useFetch<IBlock[]>(getUrlForSeries(PeriodTime[queryParams.period], 1000));
    useEffect(() => {
        setSeries2(series2Data ? convertRawData(series2Data) : undefined);
    }, [series2Data]);
    */

    const [ highchartsData, setHighchartsData ] = useState<any | undefined>(undefined);
    useEffect(() => {
        setHighchartsData(!series1 ? undefined : {
            chart: {
                type: 'line',
                backgroundColor: '#2e2c29',
                height: 600,
                width: 1100
            },
            title: {
                text: `Mining difficulty (${PeriodDescription[queryParams.period as Period].toLowerCase()})`,
                style: {
                    color: '#ffa71a',
                    fontSize: '24px'
                }
            },
            plotOptions: {
            },
            series: [{
            /*
                data: series2,
                color: 'rgba(255, 226, 179, 0.87)'
            }, {
            */
                data: series1,
                color: '#ffa71a'
            }],
            xAxis: {
                type: 'datetime',
                title: {
                    text: 'Time (UTC)',
                    style: {
                        color: '#ffa71a',
                        fontSize: '1.25em'
                    }
                },
                labels: {
                    style: {
                        color: 'rgba(255, 226, 179, 0.87)',
                    }
                },
                lineColor: '#696051',
                tickColor: '#696051'
            },
            yAxis: {
                title: {
                    text: 'Difficulty',
                    style: {
                        color: '#ffa71a',
                        fontSize: '1.25em'
                    }
                },
                labels: {
                    style: {
                        color: 'rgba(255, 226, 179, 0.87)',
                    }
                },
                gridLineColor: '#696051'
            },
            legend: {
                enabled: false
            }
        });
    }, [queryParams, series1 /*, series2 */]);

    return (
        <>
            <Banner coins={getAllCoins()} preferredCoin={coinInfo ? coinInfo.ticker : undefined} />
            <Section header="Historical network difficulty">
                <p className={classes.description}></p>
                <TabBar
                    options={Object.keys(PeriodDescription).map(name => ({
                        name: name,
                        displayName: PeriodDescription[name]
                    }))}
                    selected={queryParams.period}
                    parameterName="period"
                    baseUrl={`/${coinInfo.ticker}/difficultygraphs`}
                    disabled={isLoading}
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
