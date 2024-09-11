import React, { useEffect, useState, useRef } from 'react';
import { PropTypes } from 'prop-types';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useWalletMultiButton } from '@solana/wallet-adapter-base-ui';
import { useAppDispatch } from '../hooks/storeHooks';
import { useNavigate } from 'react-router-dom/dist';
import { getUser, fetchDates, useMintDate, checkUserLastPeriodicBatchTime } from '../sagaStore/slices';
import { useUserDetails, useBindWalletLoading, useUserAuthenticated, useAuthLoading, useUserLastPeriodicBatchTime } from '../sagaStore/slices';
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
  // const userLastPeriodicBatchTimeLoading = useUserLastPeriodicBatchTimeLoading();
  const lastPeriodicBatchTime = useUserLastPeriodicBatchTime();
  const [currentPeriodicBatchTime, setCurrentPeriodicBatchTime] = useState(currentUser?.periodicBatchTime?.toDate().toISOString());
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
  }, [dispatch, isAuthLoading, isAuthenticated, navigate]);

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
    setCurrentPeriodicBatchTime(lastBatchTimeRef);

    // Schedule the next check for the next 5-minute interval
    const timeUntilNextInterval = calculateTimeUntilNext5MinuteMark();
    console.log("timeUntilNextInterval: ", timeUntilNextInterval);
    timeoutIdRef.current = setTimeout(() => {
      console.log("Scheduled check after 5 minutes");
      
      console.log("Dispatching check for user's last periodic batch time");
      dispatch(checkUserLastPeriodicBatchTime());     

    }, timeUntilNextInterval);
  }

  // const calculateTimeUntilNoon = () => {
    //   const now = new Date();
    //   const noon = new Date();

    //   // Set noon time for today or tomorrow if it's already past noon
    //   noon.setHours(12, 0, 0, 0); // Set hours, minutes, seconds, milliseconds to 12:00:00
    //   if (now.getTime() > noon.getTime()) {
    //     // If it's past noon, schedule for the next day
    //     noon.setDate(noon.getDate() + 1);
    //   }

    //   const timeUntilNoon = noon.getTime() - now.getTime();
    //   return timeUntilNoon;
    // };

  // for 5 mins testing interval
  const calculateTimeUntilNext5MinuteMark = () => {
    const now = new Date();
    const nextInterval = new Date();

    let minutes = Math.ceil(now.getMinutes() / 5) * 5;
    // Handle the transition from 55 to the next hour (0 minute mark)
    if (minutes === 60) {
      minutes = 0;
      nextInterval.setHours(nextInterval.getHours() + 1); // Move to the next hour
    }

    nextInterval.setMinutes(minutes, 0, 0);
    
    if (nextInterval.getTime() <= now.getTime()) {
      nextInterval.setMinutes(minutes + 5, 0, 0); // Move to the next interval
    }

    const timeUntilNextInterval = nextInterval.getTime() - now.getTime();
    return timeUntilNextInterval;
  };

  const scheduleCheckForNextInterval = () => {
    let lastBatchTimeRef;
    if ((lastPeriodicBatchTime instanceof Timestamp === false)) {
      lastBatchTimeRef = lastPeriodicBatchTime;
    } else {
      lastBatchTimeRef = lastPeriodicBatchTime.toDate().toISOString();
    }

    console.log("currentPeriodicBatchTime: ", currentPeriodicBatchTime);
    console.log("lastPeriodicBatchTime: ", lastBatchTimeRef); 

    if (currentPeriodicBatchTime === lastBatchTimeRef) {
      // If the batch hasn't finished, apply retry logic with increasing delay
      retryCountRef.current++;
      console.log("retryCountRef.current: ", retryCountRef.current);

      if (retryCountRef.current === 1) {
        console.log("Batch hasn't finished updating, recall in 10 seconds");
        timeoutIdRef.current = setTimeout(() => {
          console.log("Scheduled check after 10 seconds");
          dispatch(checkUserLastPeriodicBatchTime()); 
        }, 10 * 1000); // 10 seconds
      } else if (retryCountRef.current === 2) {
        console.log("Batch still hasn't finished, recall in 30 seconds");
        timeoutIdRef.current = setTimeout(() => {
          console.log("Scheduled check after 30 seconds");
          dispatch(checkUserLastPeriodicBatchTime()); // why is this not called?
        }, 30 * 1000); // 30 seconds
      } else {
        console.error("Batch is up to data / Batch failed to update, possible backend update has failed.");
        // Handle error or notify the user
        initCountdownForNextInterval();
      }
    } else {
      // If batch is finished, reset the retry counter
      console.log("Periodic Batch finished updating, scheduling next check.");
      initCountdownForNextInterval();
    }
  };

  useEffect(() => {
    // lastPeriodicBatchTime has cache issue?
    console.log("lastPeriodicBatchTime updated after dispatch: ", lastPeriodicBatchTime);
    if (!lastPeriodicBatchTime) return;
    scheduleCheckForNextInterval();
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        console.log("Cleared timeout with ID: ", timeoutIdRef.current);
      }
    };
  }, [dispatch, lastPeriodicBatchTime]);

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
