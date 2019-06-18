import { IPoolStat } from 'interfaces/IPoolStat.interface';

export const getNumberPoolsNeeded = (percentage: number, blocks: number, poolData: IPoolStat[]): number => {
    const target = Math.ceil(blocks * percentage);
    const poolDataSorted = poolData.slice().sort((a, b) => (a.amountmined > b.amountmined ? -1 : 1));
    let runningCount = 0;
    for (const [index, pool] of poolDataSorted.entries()) {
        runningCount += pool.amountmined;
        if (runningCount >= target) {
            return index + 1;
        }
    }
    return poolData.length;
};
