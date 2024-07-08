// CLU start with 25 (Increase 25% every 1 level)
// EPT start with 1 (Increase 1 every 3 level)
// Energy start with 20 (Increase 5 every 2 level)

const gameConfig = {
    CoinsToLevelUp: {
        start: 25,
        increaseAmount: 0.5, // 25% Percentage
        levelInterval: 3, // Level
    },
    EarnPerTap: {
        start: 1,
        increaseAmount: 1, // Number
        levelInterval: 3 // Level
    },
    Energy: {
        start: 100,
        increaseAmount: 50, // Number
        levelInterval: 1 // Level
    }
};

export {
    gameConfig
};