import React, { useEffect } from 'react';
import { PropTypes } from "prop-types";
import { useAppDispatch } from '../hooks/storeHooks';
import { useNavigate } from "react-router-dom/dist";
import { getUser } from '../sagaStore/slices';
import { useUserAuthenticated, useAuthLoading } from "../sagaStore/slices";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

const ClickerController = ({ Children }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useUserAuthenticated();
  const isAuthLoading = useAuthLoading();
    
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      navigate('/login');
    }
}, [isAuthLoading, isAuthenticated, navigate]);


  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  return (
    <div>
        <Children />
    </div>
  );
};

ClickerController.propTypes = {
  Children: PropTypes.func
}

export default ClickerController;
