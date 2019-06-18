import { padNumber } from './padNumber.util';
import { adjustDifficulty } from './adjustDifficulty.util';
import { formatTime } from './formatTime.util';
import { getNumberPoolsNeeded } from './getNumberPoolsNeeded.util';

it('should pad', () => {
    expect(padNumber(2)).toBe('02');
});

it("shouldn't pad", () => {
    expect(padNumber(99)).toBe('99');
});

it('should format time', () => {
    expect(formatTime(1559354809).split(' ')[0]).toBe('22:06:49');
});

it('should adjust difficulty', () => {
    expect(adjustDifficulty(50, 41, 25)).toBeCloseTo(68.33);
});

it('should calculate pools need for a given percentage', () => {
    const poolData = [
        {
            amountmined: 178,
            website: 'https://icemining.ca/',
            graphcolor: null,
            name: 'Icemining',
            latestblock: 465091,
        },
        {
            amountmined: 268,
            website: null,
            graphcolor: null,
            name: 'TFCyExoSE6AUonvhWVHEu2TJHLv3Q2p6NC (Unknown Pool)',
            latestblock: 465090,
        },
        {
            amountmined: 17,
            website: null,
            graphcolor: null,
            name: 'TG5mu7ifYWpxVygDNmsjCmQ4BPh3xneai2 (Unknown Pool)',
            latestblock: 465016,
        },
        {
            amountmined: 69,
            website: null,
            graphcolor: null,
            name: 'TKyqNBcDbwkxnkpe71wvoM5pnPrdU2HndR (Unknown Pool)',
            latestblock: 465089,
        },
        {
            amountmined: 8,
            website: null,
            graphcolor: null,
            name: 'TL8Ry7NuYUyQUbeDUqaZZc5P6b3roHNyJy (Unknown Pool)',
            latestblock: 464964,
        },
        {
            amountmined: 63,
            website: 'http://pool.tuxtoke.life/',
            graphcolor: null,
            name: 'Tuxtoke',
            latestblock: 465086,
        },
        {
            amountmined: 6,
            website: null,
            graphcolor: null,
            name: 'TYD8gbGBujA72EFAfpVahcSJaHzosNvReZ (Unknown Pool)',
            latestblock: 463977,
        },
        {
            amountmined: 329,
            website: 'http://yiimp.eu/',
            graphcolor: null,
            name: 'YiiMP.EU',
            latestblock: 465087,
        },
        {
            amountmined: 462,
            website: 'http://zergpool.com/',
            graphcolor: null,
            name: 'Zergpool',
            latestblock: 465085,
        },
    ];
    expect(getNumberPoolsNeeded(0.9, 1400, poolData)).toBe(5);
});
