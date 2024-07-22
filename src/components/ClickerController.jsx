import React, { useEffect, useState, useCallback } from 'react';
import { useAppDispatch } from '../hooks/storeHooks';
import { getUser, useUserDetails } from '../sagaStore/slices';
import { useNavigate } from 'react-router-dom';
import { addToLocalStorage, getFromLocalStorage } from '../utils/localStorage';
import { handleUpdateCoins, handleUpdateClickByLevel } from '../firebase/clicker';
import { handleUpdateUserRechargableEnergy, handleUpdateUserRechargableInvite } from '../firebase/user';
import { fetchRewardRate } from '../firebase/rewardRates';

const ClickerController = ({ Children }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useUserDetails();
  
  const [gameData, setGameData] = useState({});
  const [isOpenRewardModal, setIsOpenRewardModal] = useState(false);
  const [modalOpen, handleOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [energyRechargable, setEnergyRechargable] = useState(0);
  const [inviteRechargable, setInviteRechargable] = useState(0);
  const [rewardRate, setRewardRate] = useState(null);
  const [totalClicks, setTotalClicks] = useState(gameData?.currentScore);

  useEffect(() => {
    setTimeout(() => {
      dispatch(getUser());
    }, 1000);
  }, [dispatch]);

  useEffect(() => {
    setTimeout(() => {
      if (!currentUser) {
        navigate('/login');
      }
    }, 1500);
  }, [currentUser, navigate]);

  return (
    <div>
        <Children
            currentUser={currentUser}
            gameData={gameData}
            setGameData={setGameData}
            totalClicks={totalClicks}
            setTotalClicks={setTotalClicks}
        />
    </div>
  );
};

export default ClickerController;
