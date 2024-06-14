import LeaderBoardModal from "../../components/LeaderBoardModal";
import Mascots from "../../components/Mascots";
import MascotView from "../../components/MascotView";
import ProgressSection from "../../components/ProgressSection";
import Quest from "../../components/Quest";
import { useGlobalContext } from "../../context/ContextProvider";
import { getCollection, insertCollection } from "../../utils/firebase";
import { getTodayDate } from "../../utils/fuctions";
import { mascots } from "../../utils/local.db";
import React, { useEffect, useState } from "react";
import { calculateTimeRemaining } from '../../utils/fuctions';
import '../../styles/globals.css';

const HomeView = ({ gameData, setGameData }) => {
  const { currentUser } = useGlobalContext();
  const [currentMascot, setCurrentMascot] = useState(mascots[0]);
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
    async function getPlayerData() {
      const [mascot1, mascot2, mascot3, totalPoints] = await Promise.all([
        getCollection(`mascot1_${getTodayDate()}`, currentUser?.uid),
        getCollection(`mascot2_${getTodayDate()}`, currentUser?.uid),
        getCollection(`mascot3_${getTodayDate()}`, currentUser?.uid),
        getCollection("totalPoints", currentUser?.uid),
      ]);

      setGameData({
        mascot1: {
          numberOfClicks: 0,
          point: mascot1?.point || 0,
          quest: mascot1?.quest || 0,
        },
        mascot2: {
          numberOfClicks: 0,
          point: mascot2?.point || 0,
          quest: mascot2?.quest || 0,
        },
        mascot3: {
          numberOfClicks: 0,
          point: mascot3?.point || 0,
          quest: mascot3?.quest || 0,
        },
        totalPoints: totalPoints?.points || 0

      });


      setTotalCount({
        mascot1: mascot1?.numberOfClicks || 0,
        mascot2: mascot2?.numberOfClicks || 0,
        mascot3: mascot3?.numberOfClicks || 0,
      });
    }
    if (currentUser) getPlayerData();
  }, [currentUser]);
  //Reset counter and save data in data base on satate of being idle
  useEffect(() => {
    const saveData = async () => {
      if (idle) {
        if (
          totalCount?.[currentMascot?.version] < gameData?.[currentMascot?.version]?.numberOfClicks
        ) {
          await insertCollection(currentMascot?.version + "_" + getTodayDate(), {
            numberOfClicks: gameData?.[currentMascot?.version]?.numberOfClicks,
            point: gameData?.[currentMascot?.version]?.point,
            quest: gameData?.[currentMascot?.version]?.quest,
            userId: currentUser?.uid,
            username: currentUser?.displayName,
          });

          setTotalCount((pre) => ({
            ...pre,

            [currentMascot?.version]:
              gameData?.[currentMascot?.version]?.numberOfClicks,
          }));
        }
        setGameData((pre) => ({
          mascot1: {
            numberOfClicks: 0,
            point: pre?.mascot1?.point,
            quest: pre.mascot1?.quest,
          },
          mascot2: {
            numberOfClicks: 0,
            point: pre?.mascot2?.point,
            quest: pre?.mascot2?.quest,
          },
          mascot3: {
            numberOfClicks: 0,
            point: pre?.mascot3?.point,
            quest: pre?.mascot3?.quest,
          },
          totalPoints: pre.totalPoints
        }));
      }
    }
    saveData()
  }, [idle])


  useEffect(() => {
    const getLeaderBoard = async () => {
      try {
        const res = await fetch(`/api/getLeaderBoard`, {
          method: "GET",
          cache: 'no-store',
          headers: {
            "content-type": "application/json",
          }
        });
        const data = await res.json();
        setLeaderBoardData(data.data)


      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };


    getLeaderBoard()

    const int = setInterval(() => {
      getLeaderBoard()
      setCountdown(30);



    }, 30000)
    const countdownInterval = setInterval(() => {
      setCountdown(prevCountdown => (prevCountdown > 1 ? prevCountdown - 1 : 30));
    }, 1000);

    // Clean up intervals on component unmount
    return () => {
      clearInterval(int)
      clearInterval(countdownInterval);
    };


  }, []);


  return (

    <>

      <div className="max-w-[1280px] flex justify-center items-center gap-2 relative">

        <Mascots
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
        />

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
        />

        <Quest
          currentMascot={currentMascot}
          gameData={gameData}
          setGameData={setGameData}
          setTotalPoints={setTotalPoints}
          totalPoints={totalPoints}
          totalCount={totalCount}
          setTotalCount={setTotalCount}
        />

        {
          isLeaderBoardOpen && <LeaderBoardModal
            timeRemaining={timeRemaining}
            countdown={countdown}
            leaderBoardData={leaderBoardData}
            isLeaderBoardOpen={isLeaderBoardOpen}
            setIsLeaderBoardOpen={setIsLeaderBoardOpen}
          />
        }
        <ProgressSection
          gameData={gameData}
          currentMascot={currentMascot}
        />


      </div>
    </>
  );
};

export default HomeView;