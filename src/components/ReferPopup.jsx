import React, { useEffect, useState } from "react";
import { PropTypes } from "prop-types";
import { BsCopy } from "react-icons/bs";
import StyledQRCode from "./StyledQRCode";
import { toast } from "react-toastify";
import { useUserDetails } from '../sagaStore/slices';

const ReferPopup = ({ onClose }) => {
  const currentUser = useUserDetails();
  const [countdown, setCountdown] = useState(5);
  const [isCloseEnabled, setIsCloseEnabled] = useState(false);
  const [inviteLink, setInviteLink] = useState('');

  useEffect(()=>{
    setInviteLink(`${window.location.origin}/signup?invite-code=${currentUser.referralCode}`);
  }, [currentUser]);

  const handleCopyToClipboard = () => {
    navigator.clipboard
      .writeText(currentUser.inviteCode)
      .then(() => {
        // Success feedback
        toast.success("Invite code copied to clipboard!");
      })
      .catch((err) => {
        // Error handling
        toast.error("Failed to copy invite code");
      });
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 1) {
          clearInterval(timer);
          setIsCloseEnabled(true);
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const shareInviteLink = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Invite Friends",
          text: "Join this awesome app and get 5000 coins!",
          url: inviteLink,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(inviteLink);
      alert("Invite link copied to clipboard!");
    }
  };

  return (
    <div className="fixed w-screen h-screen inset-0 z-100 flex items-center justify-center bg-black bg-opacity-50 font-outfit overflow-hidden">
      <div className="relative z-100 flex flex-col items-center bg-gray-700 p-6 rounded-lg shadow-lg w-full max-w-sm">
        <button
          className="absolute top-2 right-2 text-white text-md pl-3 pr-3 pt-1 pb-1 rounded-full border-2 border-slate-500 m-2"
          onClick={() => {
            console.log("Close");
            isCloseEnabled && onClose(false)
          }}
          disabled={!isCloseEnabled}
        >
          {isCloseEnabled ? "x" : countdown}
        </button>
        <h2 className="text-2xl font-bold mb-4">Invite Friends</h2>
        <p className="mb-4">
          Get <span className="text-purple-300">{currentUser.inviteRechargable}</span> Stamina Recharge
        </p>
        <p>Your Invite Code</p>
        <div className="p-2 rounded text-center flex items-center">
          <code className="mr-3">{currentUser.referralCode}</code>
          <BsCopy onClick={handleCopyToClipboard} className="" />
        </div>
        <div>
          <StyledQRCode value={inviteLink} />
        </div>
        <button
          onClick={shareInviteLink}
          className="w-full mt-2 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Share Invite Link
        </button>
      </div>
    </div>
  );
};

ReferPopup.propTypes = {
  inviteCode: PropTypes.string,
  onClose: PropTypes.func,
}

export default ReferPopup;
