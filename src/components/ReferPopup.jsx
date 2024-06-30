import React, { useEffect } from "react";
import { BsCopy } from "react-icons/bs";
import StyledQRCode from "./StyledQRCode";
import gem from "../assets/images/gem2.png";
import { toast } from "react-toastify";

const ReferPopup = ({ inviteCode, onClose }) => {
  const inviteLink = `${window.location.origin}/signup?invite-code=${inviteCode}`;

  const handleCopyToClipboard = () => {
    navigator.clipboard
      .writeText(inviteCode)
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
    <div className="fixed w-screen h-screen inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 font-outfit overflow-hidden">
      <div className="relative z-60 flex flex-col items-center bg-gray-700 p-6 rounded-lg shadow-lg w-full max-w-sm">
        <button
          className="absolute top-2 right-2 text-white text-3xl"
          onClick={() => onClose(false)}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Invite Friends</h2>
        <p className="mb-4">
          <span className="text-purple-200">+5000</span> coins for you and your
          friend
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
          className="w-full mt-2 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Share Invite Link
        </button>
      </div>
    </div>
  );
};

export default ReferPopup;
