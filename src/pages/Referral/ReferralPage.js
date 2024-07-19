import React, { useEffect, useState } from "react";
import { PropTypes } from "prop-types";
import { BsCopy } from "react-icons/bs";
import StyledQRCode from "../../components/StyledQRCode";
import gem from "../../assets/images/gem2.png";
import { toast } from "react-toastify";

const ReferralPage = ({ inviteCode, rewardRate }) => {
  const [countdown, setCountdown] = useState(5);
  const [isCloseEnabled, setIsCloseEnabled] = useState(false);
  const inviteLink = `${window.location.origin}/signup?invite-code=${inviteCode}`;

  const handleCopyToClipboard = () => {
    navigator.clipboard
      .writeText(inviteCode)
      .then(() => {
        toast.success("Invite code copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy invite code");
      });
  };

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
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-700 font-outfit text-black">
      <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Invite Friends</h2>
        <p className="mb-4">
          Get <span className="text-purple-300">{rewardRate?.inviteRefresh}</span> Energy Bar
        </p>
        <p>Your Invite Code</p>
        <div className="p-2 rounded text-center flex items-center">
          <code className="mr-3">{inviteCode}</code>
          <BsCopy onClick={handleCopyToClipboard} className="cursor-pointer" />
        </div>
        <div>
          <StyledQRCode value={inviteLink} image={gem} />
        </div>
        <button
          onClick={shareInviteLink}
          className="w-full mt-2 bg-blue-500 text-black py-2 rounded hover:bg-blue-600"
        >
          Share Invite Link
        </button>
      </div>
    </div>
  );
};

ReferralPage.propTypes = {
  inviteCode: PropTypes.string,
  rewardRate: PropTypes.object
};

export default ReferralPage;