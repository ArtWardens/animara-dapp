import React, { useEffect, useRef, useState } from "react";
import PhoneInput from "react-phone-number-input";
import { useNavigate } from "react-router-dom";
import "react-phone-number-input/style.css";
import { useAppDispatch } from "../../hooks/storeHooks.js";
import {
  useUserDetails,
  resetPassword,
  useResetPasswordLoading,
  updateProfile,
  useUpdateProfileLoading,
} from "../../sagaStore/slices/userSlice.js";
import Header from "../../components/Header.jsx";
import WalletBindingPanel from "../../components/SolanaWallet/WalletBindingPanel.jsx";
import "./EditProfile.css";

const EditProfilePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const resetPasswordLoading = useResetPasswordLoading();
  const updateProfileLoading = useUpdateProfileLoading();
  const user = useUserDetails();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [imageData, setImageData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const inputFile = useRef(null);

  const handleBackClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (updateProfileLoading) { 
      return
    }
    setUsername(user?.name || "");
    setEmail(user?.email || "");
    setPhone(user?.phoneNumber || "");
    setInviteCode(user?.referredBy || "");
  }, [user, updateProfileLoading]);

  const handleResetPassword = () => {
    dispatch(resetPassword(email));
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    dispatch(
      updateProfile({
        fullName: username || null,
        inviteCode: inviteCode || null,
        phoneNumber: phone || null,
        profilePicture: imageData ? imageData.toString() : null,
      })
    );
    setHasChanges(false);
  };

  const handleUsernameChange = (e) =>{
    setUsername(e.target.value);
    setHasChanges(e.target.value !== user?.name);
  }

  const handleEmailChange = (e) =>{
    setEmail(e.target.value);
    setHasChanges(e.target.value !== user?.email);
  }

  const handleInviteCodeChange = (e) =>{
    setInviteCode(e.target.value);
    setHasChanges(e.target.value !== user?.referredBy);
  }

  const handlePhoneChange = (value) => {
    setPhone(value);
    setHasChanges(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageData(reader.result);
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    // background
    <div className="relative w-full min-h-screen">
      {/* Blur wrapper for main content */}
      <div className={`flex flex-col items-center pb-8 min-h-screen w-full transition-all duration-500`}
        style={{
          backgroundImage:
            'url("/assets/images/clicker-character/clickerWall.webp")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        {/* outer container */}
        <div className="flex flex-col xl:flex-row pt-[6rem] lg:pt-[11rem] px-[0rem] xl:px-[4rem] w-screen h-full">
          <Header />

          {/* content */}
          <div className="flex flex-col 2xl:flex-row w-full mt-[5rem] lg:mt-0 gap-20">
            {/* details panel */}
            <div className="w-full px-[2rem]">
              {/* header */}
              <div className="w-full xl:w-[100%] header flex justify-between items-center space-x-[2rem] lg:space-x-[8rem]">
                <span className="flex gap-2">
                  <div className="flex flex-col">
                    <span
                      onClick={handleBackClick}
                      className="text-white text-sm font-outfit tracking-wide hover:text-amber-500 transition-colors cursor-pointer"
                    >
                      &lt;&nbsp;Back
                    </span>
                    <div className="flex flex-col xl:flex-row">
                      <div
                        className="w-full text-left text-amber-500 text-5xl font-normal font-['Luckiest Guy'] uppercase leading-[54px]"
                        style={{
                          WebkitTextStrokeWidth: "2px",
                          WebkitTextStrokeColor: "var(--Color-11, #FFF)",
                        }}
                      >
                        PROFILE
                      </div>
                      <div className="my-[1rem]">
                        {user?.isKOL && (
                          <span className="bg-sky-700 rounded-lg items-center xl:ml-[1rem] p-2">
                            <span className="text-white text-xs tracking-wider font-outfit whitespace-nowrap">
                              Certified KOL
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </span>
                <span
                  className="flex w-24 h-24 items-center justify-center rounded-full border overflow-hidden relative group"
                  onClick={() => {
                    inputFile.current?.click();
                  }}
                  style={{
                    flexShrink: 0,
                    borderRadius: "500px",
                    border: "2.5px solid var(--80E8FF, #80E8FF)",
                    background: `url(${imageData || user?.photoUrl}) lightgray 50% / cover no-repeat`,
                  }}
                >
                  {user?.photoUrl ? (
                    <img
                      src={imageData || user?.photoUrl}
                      alt="pfp"
                      className="group-hover:brightness-75 h-full w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/assets/images/clicker-character/2-initial.webp";
                      }}
                    />
                  ) : (
                    <img
                      src="..//assets/images/lock.webp"
                      alt="pfp"
                      className="group-hover:brightness-75 h-full w-full object-cover"
                    />
                  )}
                  <img
                    src=".//assets/icons/edit.webp"
                    alt="edit"
                    className="invisible group-hover:visible absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-white fill-white"
                  />
                </span>
                <input
                  type="file"
                  id="pfp"
                  name="pfp"
                  ref={inputFile}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              {/* user details */}
              <form
                className="flex flex-col form font-degular mt-5"
                onSubmit={handleUpdateProfile}
              >
                {/* username */}
                <div className="flex flex-col md:flex-row gap-5 md:gap-10 mt-3 w-full">
                  <div className="flex flex-col gap-2 w-full xl:w-[100%] pb-4">
                    <label
                      htmlFor="firstname"
                      className="text-sm font-outfit tracking-wide"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      id="firstname"
                      required
                      value={username}
                      onChange={handleUsernameChange}
                      className="w-full bg-[rgba(0,52,89,0.80)] border-[1px] border-[#245F89] rounded-lg flex p-4 items-center gap-2 text-sm font-semibold font-outfit tracking-wide"
                    />
                  </div>
                </div>
                {/* email */}
                <div className="flex gap-10 mt-3 w-full">
                  <div className="flex flex-col gap-2 w-full xl:w-[100%] pb-4">
                    <label
                      htmlFor="email"
                      className="text-sm font-outfit tracking-wide"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      readOnly={user?.email}
                      onChange={handleEmailChange}
                      className="w-full bg-[rgba(0,52,89,0.80)] border-[1px] border-[#245F89] rounded-lg flex p-4 items-center gap-2 text-sm font-semibold font-outfit tracking-wide"
                    />
                  </div>
                </div>
                {/* phone */}
                <div className="flex flex-col gap-2 w-full xl:w-[100%] pb-4">
                  <label
                    htmlFor="phone"
                    className="text-sm font-outfit tracking-wide"
                  >
                    Phone
                  </label>
                  <PhoneInput
                    id="phone"
                    value={phone}
                    onChange={handlePhoneChange}
                    defaultCountry="US"
                    className="w-full custom-phone-input border-[1px] border-[#245F89] rounded-lg flex p-4 items-center gap-2 text-sm font-semibold font-outfit tracking-wide"
                  />
                </div>
                {/* invite code */}
                <div className="flex flex-col gap-2 w-full xl:w-[100%] pb-4 relative">
                  <label
                    htmlFor="inviteCode"
                    className="text-sm font-outfit tracking-wide"
                  >
                    Invite Code
                  </label>
                  <div className="flex items-center w-full relative">
                    <input
                      type="text"
                      id="inviteCode"
                      value={inviteCode}
                      readOnly={user?.referredBy ? true : false}
                      onChange={handleInviteCodeChange}
                      className="w-full bg-[rgba(0,52,89,0.80)] border-[1px] border-[#245F89] rounded-lg p-4 pr-[90px] text-sm font-semibold font-outfit tracking-wide"
                    />
                  </div>
                </div>
                {/* actions */}
                <div className="flex gap-10 mt-10 w-full">
                  <div className="flex flex-col md:flex-row justify-start gap-5 w-full">
                    {user?.canResetPassword === true && (
                      <button
                        className="w-[200px] h-[60px] justify-start items-center gap-[46px] inline-flex"
                        disabled={resetPasswordLoading}
                        type="button"
                        onClick={handleResetPassword}
                      >
                        <div className="w-[200px] h-[60px] px-[30px] py-5 bg-sky-700 rounded-[26px] border border-blue-300 justify-between items-center flex hover:bg-sky-500 hover:border-sky-500 hover:pt-[18px] hover:pb-5">
                          <div className="text-center text-white text-xl font-normal capitalize leading-tight hover:font-bold">
                            Reset Password
                          </div>
                        </div>
                      </button>
                    )}
                    <button
                      className={`w-[200px] h-[60px] rounded-[26px] justify-between items-center inline-flex ${hasChanges ? "bg-amber-400" : "bg-slate-300"}`}
                      disabled={updateProfileLoading || !hasChanges}
                      type="submit"
                    >
                      <div className={`w-[200px] h-[60px] px-[30px] py-5 rounded-[26px] border border-orange-300 justify-between items-center flex ${hasChanges ? "hover:bg-amber-300" : "bg-slate-300"}`}>
                        <div className="text-center text-white text-xl font-bold capitalize leading-tight">
                          {updateProfileLoading
                            ? "Saving changes.."
                            : "Save Changes"}
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* wallet panel */}
            <WalletBindingPanel className="w-full lx:w-1/2 my-auto p-12" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
