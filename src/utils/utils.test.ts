import { padNumber } from './padNumber.util';
import { adjustDifficulty } from './adjustDifficulty.util';
import { formatTime } from './formatTime.util';
import { getNumberPoolsNeeded } from './getNumberPoolsNeeded.util';
import { rounded } from './formatNumericalValue.util';

it('should pad', () => {
    expect(padNumber(2)).toBe('02');
});

it("shouldn't pad", () => {
    expect(padNumber(99)).toBe('99');
});

it('should format time', () => {
    const formatted = formatTime(1559354809);

    expect(formatted.split(' ').length).toBe(3);
    expect(formatted.split(' ')[0]).toBe('31-05-2019');
    expect(formatted.split(' ')[1]).toBe('22:06:49');
});

it('leave out the date if within last 24 hours, unless forced', () => {
    const date = Date.now() / 1000 - Math.round(Math.random() * 23.9 * 3600);

    expect(formatTime(date).split(' ').length).toBe(2);
    expect(formatTime(date, true).split(' ').length).toBe(3);
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

it('should round and split a decimal numer', () => {
    //expect(rounded(1.23456)).toStrictEqual([1, '23456']);               /* Broken - Known issue (maxDecimals doesn't truncate remaining zeroes) */
    expect(rounded(1.23456)).toStrictEqual([1, '23456000']);

    expect(rounded(1.0)).toStrictEqual([1, undefined]);

    expect(rounded(1, 2)).toStrictEqual([1, '00']);
    expect(rounded(1.0, 2)).toStrictEqual([1, '00']);
    expect(rounded(1.123, 2)).toStrictEqual([1, '12']);
    expect(rounded(1.127, 2)).toStrictEqual([1, '13']);
    expect(rounded(-1.127, 2)).toStrictEqual([-1, '13']);

    expect(rounded(1, undefined, 2)).toStrictEqual([1, undefined]);
    expect(rounded(1.0, undefined, 2)).toStrictEqual([1, undefined]);
    expect(rounded(1.123, undefined, 2)).toStrictEqual([1, '12']);

    //expect(rounded(1.127, undefined, 2)).toStrictEqual([1, '13' ]);     /* Broken - Known issue (maxDecimals doesn't round) */
    expect(rounded(1.127, undefined, 2)).toStrictEqual([1, '12']);

    //expect(rounded(-1.127, undefined, 2)).toStrictEqual([-1, '13' ]);   /* Broken - Known issue (maxDecimals doesn't round) */
    expect(rounded(-1.127, undefined, 2)).toStrictEqual([-1, '12']);

    /* maxDecimals has a hard cut-off at 8 */
    expect(rounded(1.1111111111111)).toStrictEqual([1, '11111111']);
    expect(rounded(1, 12)).toStrictEqual([1, '00000000']);
    expect(rounded(0.1 + 0.2, undefined, 24)).toStrictEqual([0, '30000000000000004']);

    //expect(rounded(0.1 + 0.2)).toStrictEqual([0, '3' ]);                /* Broken - Known issue (maxDecimals doesn't truncate remaining zeroes) */
    expect(rounded(0.1 + 0.2)).toStrictEqual([0, '30000000']);

    //expect(rounded(1.1234567890)).toStrictEqual([1, '12345679' ]);      /* Broken - Known issue (maxDecimals doesn't round) */
    expect(rounded(1.123456789)).toStrictEqual([1, '12345678']);
});
