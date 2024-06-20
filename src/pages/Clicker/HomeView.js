import LeaderBoardModal from "../../components/LeaderBoardModal";
import EarnGuide from "../../components/dogie-clicker/EarnGuide";
import LevelProgress from "../../components/dogie-clicker/LevelProgress";
import EnergyRegeneration from "../../components/dogie-clicker/EnergyRegeneration";
import TasksCheck from "../../components/dogie-clicker/TasksCheck";
// import Mascots from "../../components/Mascots";
import MascotView from "../../components/dogie-clicker/MascotView";
// import ProgressSection from "../../components/ProgressSection";
// import Quest from "../../components/Quest";
import { useGlobalContext } from "../../context/ContextProvider";
import { getCollection, insertCollection } from "../../utils/firebase";
import { getTodayDate } from "../../utils/fuctions";
import { mascots } from "../../utils/local.db";
import React, { useEffect, useState } from "react";
import { calculateTimeRemaining } from '../../utils/fuctions';
import { handleGetUserData } from "../../firebase/user";

const HomeView = ({ gameData, setGameData }) => {

  const tempData = {
    EarnPerTap: {
      title: 'Earn per tap',
      count: 3,
    },
    CoinsToLevelUp: {
      title: 'Coins to lvl up',
      count: 25,
    },
    ProfitPerHour: {
      title: 'Profit per hour',
      count: 'N/A',
    }
  };

  const { currentUser } = useGlobalContext();
  const [currentMascot, setCurrentMascot] = useState(mascots[1]);
  const [leaderBoardData, setLeaderBoardData] = useState({})
  const [idle, setIdle] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [delay, setDelay] = useState(true);
  const [isLeaderBoardOpen, setIsLeaderBoardOpen] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [totalCount, setTotalCount] = useState({
    mascot1: 0,
    mascot2: 0,
    mascot3: 0,
  });
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  //Fetch the user data on inital load
  useEffect(() => {
    handleGetUserData().then((res) => {
      setTimeout(() => {
        setGameData({
          mascot2: {
            numberOfClicks: 0,
            point: 0,
            quest: 0,
            energy: 20,
            levelProgress: 0
          },
          totalPoints: 0,
          currentScore: res.score,
        });
      }, 1000)
    })
  },[
    // ! Should listen to user change once setup done, current not listening to any changes
  ])

  //Reset counter and save data in data base on satate of being idle
  useEffect(() => {
    const saveData = async () => {
      if (idle) {
        if (
          totalCount?.[currentMascot?.version] < gameData?.[currentMascot?.version]?.numberOfClicks
        ) {

          // await insertCollection(currentMascot?.version + "_" + getTodayDate(), {
          //   numberOfClicks: gameData?.[currentMascot?.version]?.numberOfClicks,
          //   point: gameData?.[currentMascot?.version]?.point,
          //   quest: gameData?.[currentMascot?.version]?.quest,
          //   userId: currentUser?.uid,
          //   username: currentUser?.displayName,
          // });

          setTotalCount((pre) => ({
            // ...pre,
            [currentMascot?.version]:
              gameData?.[currentMascot?.version]?.numberOfClicks,
          }));
        }

        setGameData((pre) => ({
          mascot2: {
            numberOfClicks: 0,
            point: pre?.mascot2?.point,
            quest: pre?.mascot2?.quest,
            energy: pre?.mascot2?.energy,
            levelProgress: pre?.mascot2?.levelProgress
          },
          totalPoints: pre.totalPoints
        }));
      }
    }
    saveData();
  }, [idle]);

  // useEffect(() => {
  //   const getLeaderBoard = async () => {
  //     try {
  //       const res = await fetch(`/api/getLeaderBoard`, {
  //         method: "GET",
  //         cache: 'no-store',
  //         headers: {
  //           "content-type": "application/json",
  //         }
  //       });
  //       const data = await res.json();
  //       setLeaderBoardData(data.data)

  //     } catch (error) {
  //       console.error('Error fetching leaderboard:', error);
  //     }
  //   };

  //   getLeaderBoard()


  //   const int = setInterval(() => {
  //     getLeaderBoard()
  //     setCountdown(30);
  //   }, 30000)
  //   const countdownInterval = setInterval(() => {
  //     setCountdown(prevCountdown => (prevCountdown > 1 ? prevCountdown - 1 : 30));
  //   }, 1000);

  //   // Clean up intervals on component unmount
  //   return () => {
  //     clearInterval(int)
  //     clearInterval(countdownInterval);
  //   };

  // }, []);

  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2024-06-30T00:00:00Z").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });

      if (distance < 0) {
        clearInterval(timerInterval);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    const timerInterval = setInterval(updateCountdown, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  useEffect(() => {
    const generateEnergy = () => {
      setGameData((prev) => {
        if (prev?.mascot2?.energy < 20) {
          return {
            ...prev,
            mascot2: {
              ...prev.mascot2,
              energy: prev.mascot2.energy + 1
            }
          };
        } else {
          return prev;
        }
      });
    };

    const threeSecondInterval = setInterval(generateEnergy, 3000);

    return () => clearInterval(threeSecondInterval);
  }, []);

  // Countdown logic based on energy regeneration
  useEffect(() => {
    const currentEnergy = gameData?.mascot2?.energy || 0;
    const maxEnergy = 20;

    // Calculate the total remaining time in seconds
    var totalRemainingTime = (maxEnergy - currentEnergy) * 3;

    // Function to update the countdown
    const updateEnergyCountdown = () => {
      setCountdown(totalRemainingTime > 0 ? totalRemainingTime : 0);
    };

    // Initial countdown update
    updateEnergyCountdown();

    // Update the countdown every second
    const countdownInterval = setInterval(() => {
      totalRemainingTime -= 1;
      updateEnergyCountdown();
    }, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(countdownInterval);
  }, [gameData?.mascot2?.energy]);


  return (

    <>

      <div className="max-w-full flex justify-center items-center gap-2 relative">

        <EarnGuide
          data={tempData}
        />

        <LevelProgress
          gameData={gameData}
          data={tempData}
        />

        <EnergyRegeneration
          gameData={gameData}
          setGameData={setGameData}
          timeLeft={timeLeft}
          countdown={countdown}
        />

        <TasksCheck

        />

        {/* <ProgressSection
          gameData={gameData}
          currentMascot={currentMascot}
        /> */}

        {/* <Mascots
          currentMascot={currentMascot}
          setCurrentMascot={setCurrentMascot}
          gameData={gameData}
          setTotalPoints={setTotalPoints}
          totalPoints={totalPoints}
          totalCount={totalCount}
          setTotalCount={setTotalCount}
          setDelay={setDelay}
          isLeaderBoardOpen={isLeaderBoardOpen}
          setIsLeaderBoardOpen={setIsLeaderBoardOpen}
        /> */}

        <MascotView
          timeRemaining={timeRemaining}
          gameData={gameData}
          setGameData={setGameData}
          currentMascot={currentMascot}
          setIdle={setIdle}
          totalCount={totalCount}
          setTotalCount={setTotalCount}
          delay={delay}
          setDelay={setDelay}
          setTotalPoints={setTotalPoints}
          totalPoints={totalPoints}
          data={tempData}
        />

        {/* <Quest
          currentMascot={currentMascot}
          gameData={gameData}
          setGameData={setGameData}
          setTotalPoints={setTotalPoints}
          totalPoints={totalPoints}
          totalCount={totalCount}
          setTotalCount={setTotalCount}
        /> */}

        {/* {
          isLeaderBoardOpen && 
          <LeaderBoardModal
            timeRemaining={timeRemaining}
            countdown={countdown}
            leaderBoardData={leaderBoardData}
            isLeaderBoardOpen={isLeaderBoardOpen}
            setIsLeaderBoardOpen={setIsLeaderBoardOpen}
          />
        } */}

      </div>
    </>
  );
};

export default HomeView;