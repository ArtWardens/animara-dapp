function EarnGuide({ data }) {

    return (
        <div className="absolute top-5 py-2 px-2 flex justify-center mx-auto">
            <div class="grid grid-cols-3 gap-2 md:gap-4 lg:gap-6">
                <div class="relative bg-gray-800 py-1 px-1 rounded-2xl w-32 md:w-56 lg:w-56 my-5 shadow-xl">
                    <div class=" text-white flex items-center absolute rounded-full py-2 lg:py-3 px-2 lg:px-3 shadow-xl bg-pink-500 left-2 lg:left-3 -top-5 lg:-top-6">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div class="mt-5 text-center">
                        <p class="text-xl md:text-2xl lg:text-2xl xl:text-3xl font-semibold my-2">{data.EarnPerTap.title}</p>
                        <div class="space-y-2 pb-2 text-gray-400 text-2xl md:text-3xl lg:text-3xl xl:text-3xl text-center">
                            <p>+{data.EarnPerTap.count}</p>
                        </div>
                    </div>
                </div>
                <div class="relative bg-gray-800 py-1 px-1 rounded-2xl w-32 md:w-56 lg:w-56 my-5 shadow-xl">
                    <div class=" text-white flex items-center absolute rounded-full py-2 lg:py-3 px-2 lg:px-3 shadow-xl bg-pink-500 left-2 lg:left-3 -top-5 lg:-top-6">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div class="mt-5 text-center">
                        <p class="text-xl md:text-2xl lg:text-2xl xl:text-3xl font-semibold my-2">{data.CoinsToLevelUp.title}</p>
                        <div class="space-y-2 pb-2 text-gray-400 text-2xl md:text-3xl lg:text-3xl xl:text-3xl text-center">
                            <p>{data.CoinsToLevelUp.count}</p>
                        </div>
                    </div>
                </div>
                <div class="relative bg-gray-800 py-1 px-1 rounded-2xl w-32 md:w-56 lg:w-56 my-5 shadow-xl">
                    <div class=" text-white flex items-center absolute rounded-full py-2 lg:py-3 px-2 lg:px-3 shadow-xl bg-pink-500 left-2 lg:left-3 -top-5 lg:-top-6">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div class="mt-5 text-center">
                        <p class="text-xl md:text-2xl lg:text-2xl xl:text-3xl font-semibold my-2">{data.ProfitPerHour.title}</p>
                        <div class="space-y-2 pb-2 text-gray-400 text-2xl md:text-3xl lg:text-3xl xl:text-3xl text-center">
                            <p>{data.ProfitPerHour.count}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default EarnGuide;