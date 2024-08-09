import React, { useEffect, useState } from 'react';
import { PropTypes } from "prop-types";
import { useAppDispatch } from '../hooks/storeHooks';
import { getUser, useUserDetails, useAuthLoading, useUserAuthenticated } from '../sagaStore/slices';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ClickerController = ({ Children }) => {
  const dispatch = useAppDispatch();
  const currentUser = useUserDetails();
  const navigate = useNavigate();
  const isAuthenticated = useUserAuthenticated();
  const isAuthLoading = useAuthLoading();
  
  const [gameData, setGameData] = useState({});
  const [totalClicks, setTotalClicks] = useState(gameData?.currentScore);

  useEffect(() => {
    if (!isAuthenticated && !isAuthLoading) {
      navigate("/login");
      toast.error("Please login with your account to access this page");
    }
  }, [isAuthenticated, navigate, isAuthLoading]);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

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
