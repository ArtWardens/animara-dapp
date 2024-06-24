import React, { useEffect } from 'react';
import { gameConfig } from '../../data/constants';

function LevelProgress({ userProgress, gameData, totalClicks }) {
    
    const currentLevel = userProgress.currentLevel;
    // Calculation for the progress
    const maxLevelProgress = currentLevel === 1 ? gameConfig.CoinsToLevelUp.start : userProgress.CoinsToLvlUp - userProgress.LevelProgress.prevCTL;
    
    const currentLevelProgress = currentLevel === 1 ? totalClicks : totalClicks - userProgress.LevelProgress.prevCTL;
    
    // Calculate the percentage of level progress
    const levelProgressPercentage = Math.min((currentLevelProgress / maxLevelProgress) * 100, 100);
    
    return (
        <div className="absolute w-full md:w-4/5 lg:w-2/3 mx-auto my-4 pb-5 top-72">
            <div className="flex items-center">

                <div className="flex-1 text-center">
                    <div className="w-3 h-9 bg-gray-600 mx-auto"></div>
                    <div className="pt-2 text-xl">Lvl {currentLevel !== 1 ? currentLevel - 1 : currentLevel}</div>
                </div>

                <div className="w-1/12 flex items-center">
                    <div className="w-full h-3 bg-gray-200 rounded">
                        <div className="h-3 bg-yellow-300 rounded" style={{ width: currentLevel !== 1 ? "100%" : `${levelProgressPercentage}%` }}></div>
                    </div>
                </div>

                <div className="flex-1 text-center">
                    <div className="w-3 h-9 bg-gray-600 mx-auto rounded-full"></div>
                    <div className="pt-2 text-xl">Lvl {currentLevel !== 1 ? currentLevel : currentLevel + 1}</div>
                </div>

                <div className="w-1/3 flex items-center">
                    <div className="w-full h-3 bg-gray-200 rounded relative">
                        <div className="h-3 bg-yellow-300 rounded absolute top-0 left-0" style={{ width: currentLevel !== 1 ? `${levelProgressPercentage}%` : "0%" }}></div>
                    </div>
                </div>

                <div className="flex-1 text-center">
                    <div className="w-3 h-9 bg-white border-2 border-gray-300 mx-auto rounded-full"></div>
                    <div className="pt-2 text-xl">Lvl {currentLevel !== 1 ? currentLevel + 1 : currentLevel + 2}</div>
                </div>

                <div className="w-1/12 flex items-center">
                    <div className="w-full h-3 bg-gray-200 rounded">
                        <div className="h-3 text-xs leading-none py-1 text-center rounded" style={{ width: '0%' }}></div>
                    </div>
                </div>

                <div className="flex-1 text-center">
                    <div className="w-3 h-9 bg-white border-2 border-gray-300 mx-auto rounded-full"></div>
                    <div className="pt-2 text-xl">Lvl {currentLevel !== 1 ? currentLevel + 2 : currentLevel + 3}</div>
                </div>

            </div>
        </div>
    );
}

export default LevelProgress;
