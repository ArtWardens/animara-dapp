import React, { useState } from 'react';

const LeaderBoardModal = ({ setIsLeaderBoardOpen, countdown, leaderBoardData, timeRemaining }) => {

  const [currentMascotLeaderBoard, setCurrentMascotLeaderBoard] = useState("leaderboard1");

  const handleCloseModal = () => {
    setIsLeaderBoardOpen(false);
  };

  return (

    <div className="fixed inset-0 overflow-y-auto z-[10000]">
      <div className="absolute inset-0 bg-light bg-cover bg-no-repeat z-[100001]  ">
        <div className="max-w-[1000px] mx-auto">
          <div className="relative 3xl:mt-20 bg-leaderboardBg bg-contain bg-no-repeat h-screen w-full">
            <div onClick={handleCloseModal} className="absolute top-20 left-[80%]">
              <img
                src="../assets/images/x.png"
                width={50}
                height={50}
                className="cursor-pointer"
                alt="x"
              />
            </div>
            <div className="absolute top-1/4 w-[70%] ml-36">
              <ul className="grid gap-3">
                {leaderBoardData?.[currentMascotLeaderBoard]?.map((el, index) => <li key={el.username + index} className={`flex justify-between 
               items-center
                text-white py-2 px-2 ${index === 0 ? 'lb' : index === 1 ? 'lb2' : index === 2 ? 'lb3' : "lbr"}`} >
                  <div className="flex items-center">
                    <img
                      src="../assets/images/gold.png"
                      width={50}
                      height={50}
                      className="cursor-pointer w-[39px] h-[40px]"
                      alt="x"
                    />
                    <span className="lb-text">{el.username}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2 lb-text">{el.numberOfClicks}</span>
                    <img
                      src="../assets/images/hamar2.png"
                      width={50}
                      height={50}
                      className="cursor-pointer w-[25px] h-[25px]"
                      alt="x"
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="lb-point">{el.point}</span>
                    <img
                      src="../assets/images/gem.png"
                      width={50}
                      height={50}
                      className="cursor-pointer w-[20px] h-[20px]"
                      alt="x"
                    />
                  </div>
                </li>)}



              </ul>
            </div>

            <div className="absolute bottom-[90px] 2xl:bottom-[14%] 3xl:bottom-[32%] -left-8 flex items-center">
              {currentMascotLeaderBoard === "leaderboard1" ? (
                <img
                  src="../assets/images/dog1.png"
                  width={150}
                  height={150}
                  className="cursor-pointer"
                  alt="x"
                />
              ) : (
                <img
                  src="../assets/images/dog2.png"
                  width={150}
                  height={150}
                  className="cursor-pointer w-28 h-28"
                  onClick={() => setCurrentMascotLeaderBoard("leaderboard1")}
                  alt="x"
                />
              )}

              {currentMascotLeaderBoard === "leaderboard2" ? (
                <img
                  src="../assets/images/dog1.png"
                  width={150}
                  height={150}
                  className="cursor-pointer"
                  alt="x"
                />
              ) : (
                <img
                  src="../assets/images/dog2.png"
                  width={150}
                  height={150}
                  className="cursor-pointer w-28 h-28"
                  onClick={() => setCurrentMascotLeaderBoard("leaderboard2")}
                  alt="x"
                />
              )}

              {currentMascotLeaderBoard === "leaderboard3" ? (
                <img
                  src="../assets/images/dog1.png"
                  width={150}
                  height={150}
                  className="cursor-pointer"
                  alt="x"
                />
              ) : (
                <img
                  src="../assets/images/dog3.png"
                  width={150}
                  height={150}
                  className="cursor-pointer w-28 h-28"
                  onClick={() => setCurrentMascotLeaderBoard("leaderboard3")}
                  alt="x"
                />
              )}
            </div>

            <div className="absolute bottom-[120px] 2xl:bottom-[18%] 3xl:bottom-[35%] right-8 ">
              <div className="w-[260px] h-10 bg-purple-900 opacity-80 rounded-[602px] flex justify-between items-center pl-3">
                <h3 className="text-white">{timeRemaining.hours}:{timeRemaining.minutes}:{timeRemaining.seconds} until reset</h3>
                <div>
                  <img
                    src="../assets/images/timer.png"
                    width={50}
                    height={50}
                    className="cursor-pointer"
                    alt="x"
                  />
                </div>
              </div>
              <h4 className="text-white font-light">Leaderboard refreshes in {countdown} seconds</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoardModal;