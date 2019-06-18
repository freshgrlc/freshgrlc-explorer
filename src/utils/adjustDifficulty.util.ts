export const adjustDifficulty = (difficulty: number, blockTime: number, blockReward: number): number => {
    return ((difficulty * blockTime) / 60 / blockReward) * 50;
};
