import React, { useEffect } from 'react';
import { PropTypes } from "prop-types";
import { useAppDispatch } from '../hooks/storeHooks';
import { getUser, useAuthLoading, useUserAuthenticated } from '../sagaStore/slices';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ClickerController = ({ Children }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useUserAuthenticated();
  const isAuthLoading = useAuthLoading();

  useEffect(() => {
    if (!isAuthenticated && !isAuthLoading) {
      navigate("/login");
      toast.error("Please login with your account to access this page");
    }
  }, [isAuthenticated, navigate, isAuthLoading]);

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
