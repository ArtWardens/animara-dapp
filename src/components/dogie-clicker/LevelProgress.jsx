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
        <div className="absolute w-full md:w-4/5 lg:w-2/3 mx-auto my-4 p-6 bottom-48 hidden"
          style={{ 
            zIndex: 99,
          }}
        >
            <div className="flex items-center">

                {/* <div className="flex-1 text-center">
                    <div className="w-3 h-9 bg-gray-600 mx-auto rounded-full"></div>
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
                </div> */}

                <div className="w-full flex items-center">
                    <div className="w-full h-9 bg-gray-200 rounded-full relative">
                        <div 
                            className="h-9 bg-gradient-to-r from-amber-500 from-20% to-purple-800 to-80% opacity-80 rounded-full"
                            style={{ width: currentLevel !== 0 ? `${levelProgressPercentage}%` : "0%" }}
                        >
                            <div className="absolute inset-0 flex items-center">
                                <div className="flex-1 flex justify-center items-center text-white text-2xl rounded-full">
                                    <span className='text-3xl text-yellow-400'>{userProgress?.CoinsToLvlUp}</span> &nbsp; Profit per 12h to lvl UP
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div className="flex-1 text-center">
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
                </div> */}

            </div>
        </div>
    );
}

export default LevelProgress;
