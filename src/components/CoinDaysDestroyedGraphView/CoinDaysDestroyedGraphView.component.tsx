import React, { useEffect, useState } from 'react';
import useFetch from 'react-fetch-hook';

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import { CoinTickerSymbol } from 'interfaces/ICoinInfo.interface';

import { getBaseUrl } from 'utils/getBaseUrl.util';
import { getCoinInfo, getAllCoins } from 'utils/getCoinInfo.util';

import { Banner } from 'components/Banner/Banner.component';
import { Section } from 'components/Section/Section.component';
import { TabBar } from 'components/TabBar/TabBar.component';
import { PageLoadAnimation } from 'components/PageLoadAnimation/PageLoadAnimation.component';

import classes from './CoinDaysDestroyedGraphView.module.scss';


type Period = 'hours' | 'day' | 'week' | 'month' | 'year' | 'all';

interface IPeriodData {
    hours: number;
    day: number;
    week: number;
    month: number;
    year: number;
    all: number;
}

interface IProps {
    routeParams: {
        coin: CoinTickerSymbol;
    };
    queryParams: {
        period?: Period;
    };
}

interface IRawDataSeriesEntry {
    coindaysdestroyed: number;
    start: number;
    end: number;
}

interface ISeriesEntry {
    x: number;
    y: number;
}

interface IHighChartsMutableData {
    title: string;
    data: ISeriesEntry[];
    useLogarithmicAxis: boolean;
}

const PeriodTime: IPeriodData = {
    hours: 28800,
    day: 86400,
    week: 604800,
    month: 2592000,
    year: 31104000,
    all: 630720000
};

const PeriodInterval: IPeriodData = {
    hours: 900,
    day: 3600,
    week: 3600*12,
    month: 3600*24,
    year: 3600*24*7,
    all: 3600*24*30
};

const PrecisePeriodInterval: IPeriodData = {
    hours: 300,
    day: 900,
    week: 3600,
    month: 3600*6,
    year: 3600*24,
    all: 3600*24*7
};

const PeriodDescription = {
    hours: 'Last 8 hours',
    day: 'Last 24 hours',
    week: 'Last week',
    month: 'Last month',
    year: 'Last 12 months',
    all: 'All time'
};

export const CoinDaysDestroyedGraphView: React.FC<IProps> = ({ routeParams, queryParams }) => {
    const baseUrl = getBaseUrl(routeParams.coin);
    const coinInfo = getCoinInfo(routeParams.coin);
    const period = queryParams.period ? queryParams.period : 'month';
    const now = Math.floor(Number(new Date()) / 1000);

    const getUrlForSeries = (period: Period, interval: number): string => {
        const since = Math.floor((now - PeriodTime[period]) / interval) * interval;
        return `${baseUrl}/networkstats/transactions/coindaysdestroyed/?since=${since}&interval=${interval}`;
    };

    const [ useLogarithmicAxis, setUseLogarithmicAxis ] = useState<boolean>(false);
    const [ enableDetail, setDetailsEnabled ] = useState<boolean>(false);
    const [ chartData, setChartData ] = useState<IHighChartsMutableData|undefined>();

    const getInterval = (period: Period) =>
        enableDetail ? PrecisePeriodInterval[period] : PeriodInterval[period];

    const [ endpoint, setEndPoint ] = useState<string>(getUrlForSeries(period, getInterval(period)));
    useEffect(() => {
        setEndPoint(getUrlForSeries(period, getInterval(period)));
    }, [period, enableDetail]);

    const { data: rawData, isLoading } = useFetch<IRawDataSeriesEntry[]>(endpoint);
    useEffect(() => {
        const inputData = rawData && !isLoading ? rawData : [];
        const interval = getInterval(period);
        setChartData({
            title: `Coin-days destroyed (${PeriodDescription[period].toLowerCase()})`,
            data: inputData.map((entry: IRawDataSeriesEntry) => ({
                x: Math.floor(entry.start / interval) * interval * 1000,
                y: Math.floor(entry.coindaysdestroyed)
            })),
            useLogarithmicAxis: useLogarithmicAxis
        });
    }, [isLoading, rawData, useLogarithmicAxis]);

    const [ highchartsData, setHighchartsData ] = useState<any | undefined>(undefined);
    useEffect(() => {
        setHighchartsData(chartData ? {
            chart: {
                type: 'line',
                backgroundColor: '#2e2c29',
                height: 600,
                width: 1100
            },
            title: {
                text: chartData.title,
                style: {
                    color: '#ffa71a',
                    fontSize: '24px'
                }
            },
            plotOptions: {
                line: {
                    marker: {
                        enabled: false
                    }
                }
            },
            series: [{
                data: chartData.data,
                color: '#ffa71a',
                name: 'Destroyed'
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
                    text: 'Coin-days destroyed',
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
                type: chartData.useLogarithmicAxis ? 'logarithmic' : 'normal',
                gridLineColor: '#696051'
            },
            legend: {
                enabled: false
            }
        } : undefined);
    }, [chartData]);

    return (
        <>
            <Banner coins={getAllCoins()} preferredCoin={coinInfo ? coinInfo.ticker : undefined} />
            <Section header="Economic activity measured by destroyed coin-days">
                <p className={classes.subtitle}>
                    Scroll down for an explanation.
                </p>
                <TabBar
                    options={Object.keys(PeriodDescription).map(name => ({
                        name: name,
                        displayName: PeriodDescription[name as Period]
                    }))}
                    selected={period}
                    parameterName="period"
                    baseUrl={`/${coinInfo.ticker}/coindaysdestroyedgraphs`}
                    disabled={isLoading}
                />
                {highchartsData ? (
                    <div className={classes.outerWrapper}>
                        <div className={classes.wrapper}>
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={highchartsData}
                            />
                            <div className={classes.chartoptions}>
                                <label><input type='checkbox' checked={enableDetail} onChange={e => setDetailsEnabled(e.target.checked)} /> Detailed chart</label>
                            </div>
                            <div className={classes.chartoptions}>
                                <label><input type='checkbox' checked={useLogarithmicAxis} onChange={e => setUseLogarithmicAxis(e.target.checked)} /> Use logarithmic axis</label>
                            </div>
                        </div>
                    </div>
                ) : (
                    <PageLoadAnimation />
                )}
            </Section>
            <Section header="Destroyed 'coin-days' explained">
                <p className={classes.description}>
                    Destroyed coin-days is a metric to measure economic activity or more specifically user interaction
                    with a blockchain. <br />
                    The idea here is that it is very easy to inflate transacted volume numbers by just sending a bunch
                    of transactions to yourself in rapid fasion. The same goes for transactions originating from mining
                    pools that don't really add much to the overall system.
                </p>
                <p className={classes.description}>
                    So, instead of just measuring all coins transacted in a certain timeframe, the destroyed coin-days
                    metric takes into account how old the coins that are being spend in a transaction are. This works
                    simply by multiplying the coins transacted with the amount of time they had been sitting in a users'
                    wallet.
                </p>
                <p className={classes.description}>
                    The result of this is that coins that were paid out by a mining pool (which were basically brand new
                    coins) are almost completely ignored, while coins that move to an exchange after holding them for a
                    year cause a major spike. Similar story for coins that have been sitting in an exchange's cold
                    storage for a long time, but are suddenly sent to a new user's wallet when people are suddenly
                    buying a lot.
                </p>
                <p className={classes.description}>
                    At the same time, big movements will still show up, even if the coins aren't necessarily <i>that</i>
                    old. And regular people sending small'ish amounts every so often will also be accounted for. <br />
                    All in all, while not a perfect metric, 'coin-days detroyed' does generally give a better view of
                    what is going on on a blockchain than simply adding up transacted volume.
                </p>
            </Section>
        </>
    );
};
