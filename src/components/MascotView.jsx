import React, { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "../context/ContextProvider";
import { insertCollection } from "../utils/firebase";
import { getTodayDate } from "../utils/fuctions";

import useSound from "use-sound";
import ClickCounter from "./ClickCounter";
import WarningModal from "./WarningModal";

const MascotView = ({
  setGameData,
  currentMascot,
  setTotalCount,
  totalCount,
  setIdle,
  delay,
  setDelay,
  gameData,
  timeRemaining
}) => {



  const [isOPen, setIsOPen] = useState(false);

  const [showSecondImage, setShowSecondImage] = useState(false);

  const onClose=()=>{setIsOPen(false)}

  const [mascotSound] = useSound(currentMascot?.sound);
  const { currentUser } = useGlobalContext();
  const timerRef = useRef(null);

  const numberOfClicks = gameData?.[currentMascot?.version]?.numberOfClicks;

  useEffect(() => {
    setTimeout(() => setDelay(false), 2000);
  }, [currentMascot?.version]);

  const handleStart = () => {
    setIdle(false); // Reset idle state when the user interacts
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setIdle(true); // Set idle state to true after 5 seconds of inactivity
    }, 5000);
  };

  useEffect(() => {
    const resetTimer = () => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIdle(true); // Set idle state to true when the user is idle for 5 seconds
      }, 5000);
    };
    document.addEventListener("mousedown", resetTimer); // Listen for mouse button press
    return () => {
      document.removeEventListener("mousedown", resetTimer);
    };
  }, []);

  const handleMouseDown = () => {
      
    if(timeRemaining.hours ===0 && timeRemaining.minutes ===0 && timeRemaining.seconds ===0){
      setGameData((pv)=>({
        mascot1: {
          numberOfClicks: 0,
          point:  0,
          quest:  0,
        },
        mascot2: {
          numberOfClicks: 0,
          point:  0,
          quest:0,
        },
        mascot3: {
          numberOfClicks: 0,
          point: 0,
          quest: 0,
        },
        totalPoints: pv.totalPoints
      }));
      setIsOPen(true)
      return
    }

    handleStart()
    setShowSecondImage(true);
    setGameData((pre) => {
      const saveData = async () => {
        if (pre[currentMascot.version]?.numberOfClicks + 1 === 10 && pre[currentMascot.version]?.quest < 1) {
          await insertCollection(currentMascot?.version+"_"+getTodayDate(), {
            numberOfClicks: pre[currentMascot.version]?.numberOfClicks + 1,
            point: pre[currentMascot.version]?.point+100,
            quest: pre[currentMascot.version]?.quest+1,
            userId: currentUser?.uid,
            username: currentUser?.displayName,
          });
          await insertCollection("totalPoints", {
            points: pre.totalPoints+100,
            userId: currentUser?.uid,
          })
         
   
        }
        if (pre[currentMascot.version]?.numberOfClicks + 1 === 20 && pre[currentMascot.version]?.quest < 2) {
          await insertCollection(currentMascot?.version+"_"+getTodayDate(), {
            numberOfClicks: pre[currentMascot.version]?.numberOfClicks + 1,
            point: pre[currentMascot.version]?.point+100,
            quest: pre[currentMascot.version]?.quest+1,
            userId: currentUser?.uid,
            username: currentUser?.displayName,
          });

          await insertCollection("totalPoints", {
            points: pre.totalPoints+100,
            userId: currentUser?.uid,
          })
       
        }
        if (pre[currentMascot.version]?.numberOfClicks + 1 === 30 && pre[currentMascot.version]?.quest < 3) {
          await insertCollection(currentMascot?.version+"_"+getTodayDate(), {
            numberOfClicks: pre[currentMascot.version]?.numberOfClicks + 1,
            point: pre[currentMascot.version]?.point+100,
            quest: pre[currentMascot.version]?.quest+1,
            userId: currentUser?.uid,
            username: currentUser?.displayName,
          });

          await insertCollection("totalPoints", {
            points: pre.totalPoints+100,
            userId: currentUser?.uid,
          })
         
        }
        if (pre[currentMascot.version]?.numberOfClicks + 1 === 40 && pre[currentMascot.version]?.quest < 4) {
          await insertCollection(currentMascot?.version+"_"+getTodayDate(), {
            numberOfClicks: pre[currentMascot.version]?.numberOfClicks + 1,
            point: pre[currentMascot.version]?.point+100,
            quest: pre[currentMascot.version]?.quest+1,
            userId: currentUser?.uid,
            username: currentUser?.displayName,
          });
          await insertCollection("totalPoints", {
            points: pre.totalPoints+100,
            userId: currentUser?.uid,
          })
          
        }
        if (pre[currentMascot.version]?.numberOfClicks + 1 === 50 && pre[currentMascot.version]?.quest < 5) {
          await insertCollection(currentMascot?.version+"_"+getTodayDate(), {
            numberOfClicks: pre[currentMascot.version]?.numberOfClicks + 1,
            point: pre[currentMascot.version]?.point+100,
            quest: pre[currentMascot.version]?.quest+1,
            userId: currentUser?.uid,
            username: currentUser?.displayName,
          });
    
          await insertCollection("totalPoints", {
            points: pre.totalPoints+100,
            userId: currentUser?.uid,
          })
         
        }
      };
      saveData()
      if (
        pre[currentMascot.version]?.numberOfClicks + 1 === 10 &&
        totalCount?.[currentMascot?.version] <= 10
      ) {
        setTotalCount((pre) => ({
          ...pre,
          [currentMascot?.version]: 10,
        }));
      }
      if (
        pre[currentMascot.version]?.numberOfClicks + 1 === 20 &&
        totalCount?.[currentMascot?.version] <= 20
      ) {
        setTotalCount((pre) => ({
          ...pre,
          [currentMascot?.version]: 20,
        }));
      }

      if (
        pre[currentMascot.version]?.numberOfClicks + 1 === 30 &&
        totalCount?.[currentMascot?.version] <= 30
      ) {
        setTotalCount((pre) => ({
          ...pre,
          [currentMascot?.version]: 30,
        }));
      }
      if (
        pre[currentMascot.version]?.numberOfClicks + 1 === 40 &&
        totalCount?.[currentMascot?.version] <= 40
      ) {
        setTotalCount((pre) => ({
          ...pre,
          [currentMascot?.version]: 40,
        }));
      }
      
      if (
        pre[currentMascot.version]?.numberOfClicks + 1 === 50 &&
        totalCount?.[currentMascot?.version] <= 50
      ) {
        setTotalCount((pre) => ({
          ...pre,
          [currentMascot?.version]: 50,
        }));
      }


        return {
          ...pre,
          [currentMascot.version]: {
            ...pre[currentMascot.version],
            numberOfClicks: pre[currentMascot.version]?.numberOfClicks + 1,
            ...(pre[currentMascot.version]?.numberOfClicks + 1 === 10 &&
            pre[currentMascot.version]?.quest <= 1
              ? {
                  quest: 1,
                }
              : {}),
            ...(pre[currentMascot.version]?.numberOfClicks + 1 === 20 &&
            pre[currentMascot.version]?.quest <= 2
              ? {
                  quest: 2,
                }
              : {}),
            ...(pre[currentMascot.version]?.numberOfClicks + 1 === 30 &&
            pre[currentMascot.version]?.quest <= 3
              ? {
                  quest: 3,
                }
              : {}),
            ...(pre[currentMascot.version]?.numberOfClicks + 1 === 40 &&
            pre[currentMascot.version]?.quest <= 4
              ? {
                  quest: 4,
                }
              : {}),
            ...(pre[currentMascot.version]?.numberOfClicks + 1 === 50 &&
            pre[currentMascot.version]?.quest <= 5
              ? {
                  quest: 5,
                }
              : {}),

            ...(pre[currentMascot.version]?.numberOfClicks + 1 === 10 &&
            pre[currentMascot.version]?.quest <= 0
              ? {
                  point: 100,
                }
              : {}),
            ...(pre[currentMascot.version]?.numberOfClicks + 1 === 20 &&
            pre[currentMascot.version]?.quest <= 1
              ? {
                  point: 200,
                }
              : {}),
            ...(pre[currentMascot.version]?.numberOfClicks + 1 === 30 &&
            pre[currentMascot.version]?.quest <= 2
              ? {
                  point: 300,
                }
              : {}),
            ...(pre[currentMascot.version]?.numberOfClicks + 1 === 40 &&
            pre[currentMascot.version]?.quest <= 3
              ? {
                  point: 400,
                }
              : {}),
            ...(pre[currentMascot.version]?.numberOfClicks + 1 === 50 &&
            pre[currentMascot.version]?.quest <= 4
              ? {
                  point: 500,
                }
              : {}),
          },
          totalPoints:
          pre[currentMascot.version]?.numberOfClicks + 1 === 10 && pre[currentMascot.version]?.quest <= 0 ? pre.totalPoints+100
          :
          pre[currentMascot.version]?.numberOfClicks + 1 === 20 &&  pre[currentMascot.version]?.quest <= 1 ? pre.totalPoints+100
          :
          pre[currentMascot.version]?.numberOfClicks + 1 === 30 && pre[currentMascot.version]?.quest <= 2 ? pre.totalPoints+100
          :
          pre[currentMascot.version]?.numberOfClicks + 1 === 40 && pre[currentMascot.version]?.quest <= 3 ? pre.totalPoints+100
          :
          pre[currentMascot.version]?.numberOfClicks + 1 === 50 && pre[currentMascot.version]?.quest <= 4 ? pre.totalPoints+100
          :pre.totalPoints
        };
    });

    mascotSound();
  };

  const handleMouseUp = () => {
    setShowSecondImage(false);
  };

  let currentImage;

  if (numberOfClicks < 0) {
    currentImage = currentMascot?.initialImg;
  } else if (numberOfClicks >= 1 && numberOfClicks < 10) {
    currentImage = currentMascot?.image2;
  } else if (numberOfClicks >= 10 && numberOfClicks < 20) {
    currentImage = currentMascot?.image4;
  } else if (numberOfClicks >= 20 && numberOfClicks < 30) {
    currentImage = currentMascot?.image6;
  } else if (numberOfClicks >= 30 && numberOfClicks < 40) {
    currentImage = currentMascot?.image8;
  } else {
    currentImage = currentMascot?.image8;
  }

  let secondaryImg;
  if (numberOfClicks <= 0) {
    secondaryImg = currentMascot?.initialImg;
  } else if (numberOfClicks >= 1 && numberOfClicks < 10) {
    secondaryImg = currentMascot?.image1;
  } else if (numberOfClicks >= 10 && numberOfClicks < 20) {
    secondaryImg = currentMascot?.image3;
  } else if (numberOfClicks >= 20 && numberOfClicks < 30) {
    secondaryImg = currentMascot?.image5;
  } else if (numberOfClicks >= 30 && numberOfClicks < 40) {
    secondaryImg = currentMascot?.image7;
  } else if (numberOfClicks >= 40) {
    secondaryImg = currentMascot?.image7;
  }

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="cursor-pointer flex justify-center items-center h-screen w-[40%] select-none bottom-0"
    >

<ClickCounter gameData={gameData} currentMascot={currentMascot} />
      {delay ? (
        <div role="status">
          <svg
            aria-hidden="true"
            className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
      
            <img
           
              src={showSecondImage ? currentImage : secondaryImg}
              alt="Game mascot"
              className="select-none object-cover absolute bottom-0"
              width={930}
              height={1145}
            />
          
      )}

      <WarningModal isOpen={isOPen} onClose={onClose}/>
    </div>
  );
};

export default MascotView;

