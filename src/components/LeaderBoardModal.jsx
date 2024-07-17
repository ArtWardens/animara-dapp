import React, { useEffect } from 'react';
import { useAppDispatch } from '../hooks/storeHooks';
import {
  getLeaderBoard,
  useLeaderBoardDetails,
  useLeaderBoardLoadSuccess,
  useLeaderBoardLoading,
  useUserDetails,
} from '../sagaStore/slices';

const LeaderBoardModal = ({ setIsLeaderBoardOpen, countdown, timeRemaining }) => {
  const handleCloseModal = () => {
    setIsLeaderBoardOpen(false);
  };
  const dispatch = useAppDispatch();
  const leaderBoardLoaded = useLeaderBoardLoadSuccess();
  const leaderBoardLoading = useLeaderBoardLoading();
  const leaderBoardData = useLeaderBoardDetails();

  useEffect(() => {
    if (!leaderBoardLoaded && !leaderBoardLoading) {
      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}_${String(currentDate.getMonth() + 1).padStart(2, '0')}_${String(currentDate.getDate()).padStart(2, '0')}`;
      dispatch(getLeaderBoard(formattedDate));
    }
  }, []);

  useEffect(() => {
    if (!leaderBoardLoading && leaderBoardLoaded && countdown === 0) {
      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}_${String(currentDate.getMonth() + 1).padStart(2, '0')}_${String(currentDate.getDate()).padStart(2, '0')}`;

      dispatch(getLeaderBoard(formattedDate));
    }
  }, [countdown, dispatch, leaderBoardLoaded, leaderBoardLoading]);

  const userDetails = useUserDetails();
  return (
    <div className="fixed inset-0 overflow-y-auto z-[10000]">
      <div className="absolute inset-0 bg-pink-300 z-[100001]">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat z-[100001]"
          style={{ backgroundImage: 'url(../assets/images/Light.png)' }}
        >
          <div className="absolute top-4 left-4">
            <img src="../assets/images/username.png" className="cursor-pointer h-16" alt="username" />{' '}
            <p className="text-white absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/3 w-20 truncate">
              <span>{`${userDetails?.first_name} ${userDetails?.last_name}`}</span>
            </p>
          </div>
          <div className="w-screen h-screen flex">
            <div className="relative h-full max-h-96 w-full max-w-screen-sm m-auto flex items-center justify-center">
              <img
                className="select-none h-full min-w-[800px] min-h-[500px]"
                draggable={false}
                src="../assets/images/LeaderboardBg.png"
                alt="leaderboard"
              />
              <div onClick={handleCloseModal} className="absolute top-4 -right-10">
                <img src="../assets/images/x.png" width={50} height={50} className="cursor-pointer" alt="x" />
              </div>

              {leaderBoardData?.length > 0 ?
                <div className="absolute top-1/4 w-[100%] ">
                  <ul className="grid gap-2 max-h-[230px] overflow-y-auto px-8">
                    {leaderBoardData?.map((el, index) => (
                      <li
                        key={el.userId}
                        className={`flex justify-between 
                          items-center
                          text-white py-1 px-2 ${index === 0 ? 'lb' : index === 1 ? 'lb2' : index === 2 ? 'lb3' : 'lbr'}`}
                      >
                        <div className="flex items-center space-x-3">
                          {index === 0 ? (
                            <img src="../assets/images/gold.png" className=" w-[35px] h-[35px]" alt="gold" />
                          ) : index === 1 ? (
                            <img src="../assets/images/silvar.png" className=" w-[35px] h-[35px]" alt="silvar" />
                          ) : index === 2 ? (
                            <img src="../assets/images/platinum.png" className=" w-[35px] h-[35px]" alt="platinium" />
                          ) : (
                            <div className=" w-[35px] h-[35px]"></div>
                          )}

                          <span className="lb-text text-xl">{el.name}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2 lb-text text-xl">{el.numberOfClicks}</span>
                          <img
                            src="../assets/images/hamar2.png"
                            width={50}
                            height={50}
                            className="cursor-pointer w-[25px] h-[25px]"
                            alt="x"
                          />
                        </div>
                        <div className="flex items-center">
                          <span className="lb-point text-xl">{el.coins}</span>
                          <img
                            src="../assets/images/gem3.png"
                            width={50}
                            height={50}
                            className="cursor-pointer w-[20px] h-[20px]"
                            alt="x"
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                :
                <div className="absolute">
                  <span className="text-xl">NO RECORDS YET</span>
                </div>
              }

              <div className="absolute -bottom-9 -right-24">
                <div className="max-w-48 w-full h-8 bg-purple-900 opacity-80 rounded-[602px] flex justify-between items-center pl-3">
                  <h3 className="text-yellow-300">
                    {timeRemaining.hours}:{timeRemaining.minutes}:{timeRemaining.seconds}{' '}
                    <span className="text-white">until reset</span>
                  </h3>
                  <div>
                    <img src="../assets/images/timer.png" width={50} height={50} className="cursor-pointer" alt="x" />
                  </div>
                </div>
                <h4 className="text-white font-light pt-1.5">Leaderboard refreshes in {countdown} seconds</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoardModal;
