import React, { useEffect, data } from 'react';

function LevelProgress({ gameData, data }) {
    // Assuming the level progress is a value from 0 to 20
    const maxLevelProgress = data.CoinsToLevelUp.count;
    const currentLevelProgress = gameData?.mascot2?.levelProgress || 0;

    // Calculate the percentage of level progress
    const levelProgressPercentage = Math.min((currentLevelProgress / maxLevelProgress) * 100, 100);

    return (
        <div className="absolute w-full md:w-4/5 lg:w-2/3 mx-auto my-4 pb-5 top-72">
            <div className="flex items-center">

                <div className="flex-1 text-center">
                    <div className="w-3 h-9 bg-gray-600 mx-auto rounded-full"></div>
                    <div className="pt-2 text-xl">Lvl 1</div>
                </div>

                <div className="w-1/12 flex items-center">
                    <div className="w-full h-3 bg-gray-200 rounded">
                        <div className="h-3 bg-yellow-300 rounded" style={{ width: '100%' }}></div>
                    </div>
                </div>

                <div className="flex-1 text-center">
                    <div className="w-3 h-9 bg-gray-600 mx-auto rounded-full"></div>
                    <div className="pt-2 text-xl">Lvl 2</div>
                </div>

                <div className="w-1/3 flex items-center">
                    <div className="w-full h-3 bg-gray-200 rounded relative">
                        <div className="h-3 bg-yellow-300 rounded absolute top-0 left-0" style={{ width: `${levelProgressPercentage}%` }}></div>
                    </div>
                </div>

                <div className="flex-1 text-center">
                    <div className="w-3 h-9 bg-white border-2 border-gray-300 mx-auto rounded-full"></div>
                    <div className="pt-2 text-xl">Lvl 3</div>
                </div>

                <div className="w-1/12 flex items-center">
                    <div className="w-full h-3 bg-gray-200 rounded">
                        <div className="h-3 text-xs leading-none py-1 text-center rounded" style={{ width: '0%' }}></div>
                    </div>
                </div>

                <div className="flex-1 text-center">
                    <div className="w-3 h-9 bg-white border-2 border-gray-300 mx-auto rounded-full"></div>
                    <div className="pt-2 text-xl">Lvl 4</div>
                </div>

            </div>
        </div>
    );
}

export default LevelProgress;
