import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import { useAppDispatch } from '../hooks/storeHooks';
import {
  getNewLeaderBoard,
  useNewLeaderBoardDetails,
  useNewLeaderBoardLoading,
  useNewLeaderBoardLoadSuccess,
} from '../sagaStore/slices';
import DynamicNumberDisplay from './DynamicNumberDisplay';

const LeaderBoardModal = ({ handleCloseLeaderboard }) => {
  const dispatch = useAppDispatch();

  const leaderboard = useNewLeaderBoardDetails();
  const leaderboardLoading = useNewLeaderBoardLoading();
  const leaderBoardLoaded = useNewLeaderBoardLoadSuccess();
  
  const [showLeaderBoardModal, setShowLeaderBoardModal] = useState(true);

  const closeModal = () => {
    if (showLeaderBoardModal) {
      setShowLeaderBoardModal(false);
    }

    const timerPanel = setTimeout(() => {
      handleCloseLeaderboard();
    }, 300);

    return () => {
      clearTimeout(timerPanel);
    };
  };

  useEffect(() => {
    dispatch(getNewLeaderBoard());
  }, [dispatch]);

  return (
    <div
      className={`fixed left-0 top-0 flex h-full amin-h-screen w-full items-center justify-center bg-dark/90 px-4 py-4`}  
      onClick={closeModal}
      style={{
        zIndex: 90,
      }}
    >
      <div
        className={`
          relative w-[100%] max-w-[1000px] max-h-[95%] px-[2rem] py-[6rem] rounded-[20px] text-center 
          bg-cover bg-no-repeat 
          md:px-[4rem] md:py-[14rem] md:bg-contain md:min-h-[750px] 
          lg:px-[7rem] lg:py-[14rem] lg:bg-contain lg:min-h-[750px]
          ${showLeaderBoardModal ? 'animate-slideInFromBottom' : 'animate-slideOutToBottom'}`}
        style={{
          backgroundImage: `url(/assets/images/leaderboard_panel.webp)`,
          backgroundPosition: 'center',
        }}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        {leaderboardLoading || !leaderBoardLoaded ? (
        // loader
        <div className="pt-4 flex align-middle justify-center">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-Fuchsia-200 animate-spin dark:text-Fuchsia-200 fill-yellow-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
        ) : (
          <div 
            className="max-h-[350px] md:max-h-[280px] lg:max-h-[350px] grid grid-cols-1 gap-1 pr-4 overflow-x-hidden overflow-y-auto custom-scrollbar">
            {leaderboard && leaderboard.length > 0 ? (
              leaderboard.map((item, index) => {
                let backgroundImage;
                let top3ImgSrc;
                switch (index) {
                  case 0:
                    backgroundImage = "linear-gradient(to right, #FFDE6A00, #FFDE6A 10%, #FFDE6A93, #8E8E8E00)"; // 1st place - Gold
                    top3ImgSrc = "/assets/images/leaderboard_1st.webp";
                    break;
                  case 1:
                    backgroundImage = "linear-gradient(to right, #FF813900, #FF8139 10%, #FF813993, #FF813900)"; // 2nd place - Orange
                    top3ImgSrc = "/assets/images/leaderboard_2nd.webp";
                    break;
                  case 2:
                    backgroundImage = "linear-gradient(to right, #80E8FF00, #80E8FF 10%, #80E8FF93, #80E8FF00)"; // 3rd place - Cyan
                    top3ImgSrc = "/assets/images/leaderboard_3rd.webp";
                    break;
                  default:
                    backgroundImage = "linear-gradient(to right, #FFFFFF00, #FFFFFF4D, #FFFFFF66, #FFFFFF00)"; // Default - White
                    top3ImgSrc = null;
                    break;
                }
                return (
                  <>
                    <div key={index} 
                      className="flex space-x-2 justify-stretch font-LuckiestGuy text-left
                        h-[58px] px-[2rem]
                        md:h-[50px] md:px-[3rem]  
                        lg:h-[50px] lg:px-[8rem]"
                      style={{
                        backgroundImage: backgroundImage,
                      }}>
                      {top3ImgSrc ? (
                        <img src={top3ImgSrc} alt="medal" className="object-cover w-[36px] mr-1"></img>
                      ) : (
                        <div className="w-[36px] mr-1"></div>
                      )}
                      <div className="
                        inline-block w-full my-auto
                        md:grid md:grid-cols-[60%_40%] md:gap-2 
                        lg:grid lg:grid-cols-[60%_40%] lg:gap-2 
                        ">
                        <p className="truncate text-[1rem] xs:text-xl lg:text-2xl drop-shadow-[3px_2px_4px_rgba(32,91,121,1)] my-auto">{item.name}</p>
                        <DynamicNumberDisplay 
                          number={item.profitPerHour} 
                          imgSrc={"/assets/icons/explora-point.webp"}
                          imgClassName={"w-[15px] h-[15px] xs:w-[20px] xs:h-[20px] lg:w-[30px] lg:h-[30px] mr-1 drop-shadow-xl"}
                          spanClassName={"inline-block text-transparent text-[1rem] xs:text-xl lg:text-2xl drop-shadow-xl bg-clip-text bg-gradient-to-b from-[#E9FFEE] to-[#00E0FF] font-bold"}
                        />
                      </div>
                    </div>
                  </>
                )})
            ) : (
              // Fallback if leaderboard is empty
              <p>No leaderboard data available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

LeaderBoardModal.propTypes = {
  handleCloseLeaderboard: PropTypes.func,
  countdown: PropTypes.number,
  timeRemaining: PropTypes.number,
};

export default LeaderBoardModal;
