import React, { useEffect, useState, useRef } from 'react';
import { PropTypes } from 'prop-types';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useWalletMultiButton } from '@solana/wallet-adapter-base-ui';
import { useAppDispatch } from '../hooks/storeHooks';
import { useNavigate } from 'react-router-dom/dist';
import { getUser, fetchDates, useMintDate, checkUserLastPeriodicBatchTime } from '../sagaStore/slices';
import { useUserDetails, useBindWalletLoading, useUserAuthenticated, useAuthLoading, useUserLastPeriodicBatchTime, useUserLastPeriodicBatchTimeLoading } from '../sagaStore/slices';
import { toast } from 'react-toastify';
import {Timestamp} from 'firebase/firestore'

const ClickerController = ({ Children }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useUserAuthenticated();
  const isAuthLoading = useAuthLoading();
  const currentUser = useUserDetails();
  const mintDate = useMintDate();
  const bindingWallet = useBindWalletLoading();
  const {
    publicKey,
    connecting: connectingWallet,
    connected: walletConnected,
  } = useWalletMultiButton({
    onSelectWallet() {},
  });
  const { visible: isModalVisible, setVisible: setModalVisible } = useWalletModal();
  const userLastPeriodicBatchTimeLoading = useUserLastPeriodicBatchTimeLoading();
  const lastPeriodicBatchTime = useUserLastPeriodicBatchTime();
  const [currentPeriodicBatchTime, setCurrentPeriodicBatchTime] = useState(null);
  const timeoutIdRef = useRef(null);
  const retryCountRef = useRef(0);

  // prevent unauthenticated access
  // auto featch user details if authenticated
  useEffect(() => {
    if (!isAuthLoading) {
      if (isAuthenticated) {
        dispatch(getUser());
        if (!mintDate) {
          dispatch(fetchDates());
        }
      } else {
        navigate('/login');
      }
    }
  }, [dispatch, isAuthLoading, isAuthenticated, navigate, mintDate]);

  // check to make sure user is using correct wallet
  useEffect(() => {
    if (!currentUser) {
      return;
    }
    if (connectingWallet) {
      return;
    }

    if (!connectingWallet && isModalVisible) {
      return;
    }

    // skip enhforcing wallet binding if is mobile
    if (
      /android|iPad|iPhone|iPod/i.test(navigator.userAgent) ||
      (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
    ) {
      return;
    }

    // extract wallet address
    // Note: has to use public key as a string or else its an object
    const walletAddr = `${publicKey || ''}`;

    // if wallet match then done
    if (currentUser?.walletAddr && walletAddr === currentUser?.walletAddr) {
      setModalVisible(false);
      toast('Wallet sync complete');
    } else if (!bindingWallet && currentUser?.walletAddr !== '') {
      toast(`Please connect to wallet (address: ${currentUser?.walletAddr}) to continue`);
      setModalVisible(true);
    } else if (connectingWallet) {
      console.log(`unbinding wallet`);
    } else {
      console.log(`account not bound to any wallet yet`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.walletAddr, publicKey, connectingWallet, walletConnected, isModalVisible]);

  useEffect(() => {}, [publicKey]);

  // Init countdown
  const initCountdownForNextInterval = () => {
    console.log("init countdown");
    // reset retry count
    retryCountRef.current = 0
    let lastBatchTimeRef;
    if ((lastPeriodicBatchTime instanceof Timestamp === false)) {
      lastBatchTimeRef = lastPeriodicBatchTime;
    } else {
      lastBatchTimeRef = lastPeriodicBatchTime.toDate().toISOString();
    }
    // console.log("init lastBatchTimeRef: ", lastBatchTimeRef);
    setCurrentPeriodicBatchTime(lastBatchTimeRef);

    // Schedule the next check for the next 5-minute interval
    const timeUntilNextInterval = calculateNextInterval();
    console.log("timeUntilNextInterval: ", timeUntilNextInterval);

    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      console.log("Cleared timeout with in init: ", timeoutIdRef.current);
    }

    timeoutIdRef.current = setTimeout(() => {
      console.log("Dispatching scheduled check interval");
      dispatch(checkUserLastPeriodicBatchTime());     

    }, timeUntilNextInterval);
  }

  const calculateNextInterval = () => {
    const now = new Date();
    const nextInterval = new Date();

    // Get schedule parameters from env
    const scheduleHours = process.env.REACT_APP_SCHEDULE_INTERVAL_HOURS || "*";
    const scheduleMinutes = process.env.REACT_APP_SCHEDULE_INTERVAL_MINUTES || "*";

    console.log("scheduleHours", scheduleHours);
    console.log("scheduleHours === *", scheduleHours === "*");

    if (scheduleHours === "*") {
      const minutesInterval = scheduleMinutes === "*" ? 1 : parseInt(scheduleMinutes, 10);
      let minutes = Math.ceil(now.getUTCMinutes() / minutesInterval) * minutesInterval;
      // following firebase cron job logic
      if (minutes >= 60) {
        minutes = 0;
        nextInterval.setUTCHours(nextInterval.getUTCHours() + 1); // Move to the next hour
      }
      nextInterval.setUTCMinutes(minutes, 0, 0);
      
      // If the next interval is the current time or earlier, move to the next interval block
      if (nextInterval.getTime() <= now.getTime()) {
        console.log("same interval, move to next");
        nextInterval.setUTCMinutes(nextInterval.getUTCMinutes() + minutesInterval, 0, 0);
      }
      console.log("minutesInterval", minutesInterval);
      console.log("test next minute: ", minutes);
      
      // Calculate time until the next interval
      const timeUntilNextInterval = nextInterval.getTime() - now.getTime();
      return timeUntilNextInterval;
    } else {
      const hoursInterval = parseInt(scheduleHours, 10);
      let hours = Math.ceil(now.getUTCHours() / hoursInterval) * hoursInterval;

      // following firebase cron job logic
      if (hours >= 24) {
        hours = 0;
        nextInterval.setUTCDate(nextInterval.getUTCDate() + 1); // Move to the next day
      }
      nextInterval.setUTCHours(hours, 0, 0, 0);

      // If the next interval is the current time or earlier, move to the next interval block
      if (nextInterval.getTime() <= now.getTime()) {
        console.log("same interval, move to next");
        nextInterval.setUTCHours(nextInterval.getUTCHours() + hoursInterval, 0, 0, 0);
      }
      console.log("test next hour: ", hours);
      
      // Calculate time until the next interval
      const timeUntilNextInterval = nextInterval.getTime() - now.getTime();
      return timeUntilNextInterval;
    }
  };

  const scheduleCheckForNextInterval = () => {
    let lastBatchTimeRef;
    if ((lastPeriodicBatchTime instanceof Timestamp === false)) {
      lastBatchTimeRef = lastPeriodicBatchTime;
    } else {
      lastBatchTimeRef = lastPeriodicBatchTime.toDate().toISOString();
    }

    if (!currentPeriodicBatchTime) {
      initCountdownForNextInterval();
      return;
    }

    if (currentPeriodicBatchTime === lastBatchTimeRef) {
      // If the batch hasn't finished, apply retry logic with increasing delay
      retryCountRef.current++;

      if (retryCountRef.current === 1) {
        if (timeoutIdRef.current) {
          clearTimeout(timeoutIdRef.current);
        }
        timeoutIdRef.current = setTimeout(() => {
          dispatch(checkUserLastPeriodicBatchTime()); 
        }, 10 * 1000); // 10 seconds
      } else if (retryCountRef.current === 2) {
        if (timeoutIdRef.current) {
          clearTimeout(timeoutIdRef.current);
        }
        timeoutIdRef.current = setTimeout(() => {
          dispatch(checkUserLastPeriodicBatchTime());
        }, 30 * 1000); // 30 seconds
      } else {
        initCountdownForNextInterval();
      }
    } else {
      // If batch success and is finished, reset the retry counter
      dispatch(getUser());
      initCountdownForNextInterval();
    }
  };

  useEffect(() => {
    // console.log("Loading: ", userLastPeriodicBatchTimeLoading);
    // console.log("lastPeriodicBatchTime null? : ", lastPeriodicBatchTime);
    if (!lastPeriodicBatchTime || userLastPeriodicBatchTimeLoading) return;
    scheduleCheckForNextInterval();
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        // console.log("Cleared timeout with ID: ", timeoutIdRef.current);
      }
    };
  }, [dispatch, userLastPeriodicBatchTimeLoading, lastPeriodicBatchTime]);

  return (
    <div className="overflow-hidden">
      <Children />
    </div>
  );
};

ClickerController.propTypes = {
  Children: PropTypes.func,
};

export default ClickerController;
