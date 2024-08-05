import React, { useEffect, useState } from 'react';
import { PropTypes } from "prop-types";
import { useAppDispatch } from '../hooks/storeHooks';
import { getUser, useUserDetails } from '../sagaStore/slices';
import { useNavigate } from 'react-router-dom';

const ClickerController = ({ Children }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useUserDetails();
  
  const [gameData, setGameData] = useState({});
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

  console.log(gameData);

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

ClickerController.propTypes = {
  Children: PropTypes.func
}

export default ClickerController;
