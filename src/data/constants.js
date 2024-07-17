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

const dailyLogin = [
    {
        day: 1,
        coins: 500
    },
    {
        day: 2,
        coins: 1000
    },
    {
        day: 3,
        coins: 1500
    },
    {
        day: 4,
        coins: 2000
    },
    {
        day: 5,
        coins: 2500
    },
    {
        day: 6,
        coins: 3000
    },
    {
        day: 7,
        coins: 3500
    },
    {
        day: 8,
        coins: 4000
    },
    {
        day: 9,
        coins: 4500
    },
    {
        day: 10,
        coins: 5000
    }
]

export {
    gameConfig,
    dailyLogin
};