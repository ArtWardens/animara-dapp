import React, { useEffect, useRef, useState, useCallback } from "react";
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
import { useMobileMenuOpen } from '../../sagaStore/slices';
import Header from "../../components/Header.jsx";
import WalletBindingPanel from "../../components/SolanaWallet/WalletBindingPanel.jsx";
import "./EditProfile.css";
import { MoonLoader } from "react-spinners";
import AvatarSelectionModal from '../../components/AvatarModal.jsx'; 


const EditProfilePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const mobileMenuOpen = useMobileMenuOpen();
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
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false); 

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
    setInviteCode(user?.referralData || "");
  }, [user, updateProfileLoading]);

  const handleResetPassword = () => {
    dispatch(resetPassword({ email }));
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
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file) {
      if (file.size > maxSize) {
        alert("File size exceeds 2MB. Please select a smaller file.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setImageData(reader.result);
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const getProfilePic = useCallback(() => {
    // use placeholder image if user not loaded yet
    if (!user) {
      return '/assets/images/activeDog.webp';
    }

    // get user profile picture
    let photoUrl = user.photoUrl;

    // returns placeholder if profile picture is not set yet
    if (photoUrl === ''){
      photoUrl = '/assets/images/activeDog.webp';
    }

    // process google user content
    if (photoUrl.indexOf('googleusercontent.com') !== -1) {
      photoUrl = `${photoUrl}?alt=media`;
    }

    return photoUrl;
  }, [user]);

  const handleAvatarSave = (avatar) => {
    setImageData(avatar);  
    setHasChanges(true);  
  };

  
  return (
    // background
    <div className="min-h-screen flex flex-col z-[-20]">
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
        <Header />

        {/* outer container */}
        <div className="flex flex-col xl:flex-row px-[0rem] xl:px-[4rem] w-screen h-full">

          {/* content */}
          <div className={`flex flex-col 2xl:flex-row w-full gap-20
            ${mobileMenuOpen ? `hidden` : ``}`}>
            {/* details panel */}
            <div className="w-full px-[2rem]">
              {/* Back button */}
              <div className="flex items-start justify-start w-full mb-2">
                <button
                  onClick={handleBackClick}
                  className="text-sm tracking-wide text-white transition-colors font-outfit hover:text-amber-500 "
                >
                  &lt;&nbsp;Back
                </button>
              </div>
              {/* header */}
              <div className="w-full xl:w-[100%] header flex justify-between items-center space-x-[2rem] lg:space-x-[8rem]">
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
                  {user?.isKOL && (
                    <div className="my-[1rem]">
                        <span className="bg-sky-700 rounded-lg items-center xl:ml-[1rem] p-2">
                          <span className="text-xs tracking-wider text-white font-outfit whitespace-nowrap">
                            Certified KOL
                          </span>
                        </span>
                    </div>
                  )}
                </div>
                {/* Profile picture */}
                <div
                  className="relative flex items-center justify-center w-24 h-24 border rounded-full group"
                  onClick={() => {
                    // inputFile.current?.click();
                    setIsAvatarModalOpen(true);
                  }}
                >
                  <div
                    className={`flex items-center justify-center rounded-full border overflow-hidden group
                       w-24 h-24 absolute
                       xs:w-40 xs:h-40 lg:w-40 lg:h-40 
                      ${user?.ownsNFT && user?.walletAddr !== '' ? 'nft-profile-border right-0' : 'profile-border -right-4'}
                    `}
                  >
                    {user?.photoUrl ? (
                      <img
                        src={imageData || getProfilePic()}
                        alt="pfp"
                        className="justify-self-center rounded-full w-12 xs:w-24 lg:w-24 group-hover:brightness-[0.55] transition-all duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/assets/images/activeDog.webp";
                        }}
                      />
                    ) : (
                      <img
                        src={imageData || getProfilePic()}  
                        alt="profile pic"
                        className="justify-self-center rounded-full w-12 xs:w-24 lg:w-24 group-hover:brightness-[0.55] transition-all duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/assets/images/activeDog.webp"; // Fallback image
                        }}
                      />
                    )}
                    <img
                      src="/assets/icons/edit.webp"
                      alt="edit"
                      className="absolute z-10 invisible text-white -translate-x-1/2 -translate-y-1/2 group-hover:visible top-1/2 left-1/2 fill-white"
                    />
                  </div>
                </div>
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
                className="flex flex-col mt-5 form font-degular"
                onSubmit={handleUpdateProfile}
              >
                {/* username */}
                <div className="flex flex-col w-full gap-5 mt-3 md:flex-row md:gap-10">
                  <div className="flex flex-col gap-2 w-full xl:w-[100%] pb-4">
                    <label
                      htmlFor="firstname"
                      className="text-sm tracking-wide font-outfit"
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
                <div className="flex w-full gap-10 mt-3">
                  <div className="flex flex-col gap-2 w-full xl:w-[100%] pb-4">
                    <label
                      htmlFor="email"
                      className="text-sm tracking-wide font-outfit"
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
                    className="text-sm tracking-wide font-outfit"
                  >
                    Phone
                  </label>
                  <PhoneInput
                    id="phone"
                    value={phone}
                    onChange={handlePhoneChange}
                    defaultCountry="US"
                    className="w-full bg-[rgba(0,52,89,0.80)] custom-phone-input border-[1px] border-[#245F89] rounded-lg flex p-4 items-center gap-2 text-sm font-semibold font-outfit tracking-wide"
                  />
                </div>
                {/* invite code */}
                <div className="flex flex-col gap-2 w-full xl:w-[100%] pb-4 relative">
                  <label
                    htmlFor="inviteCode"
                    className="text-sm tracking-wide font-outfit"
                  >
                    Invite Code
                  </label>
                  <div className="relative flex items-center w-full">
                    <input
                      type="text"
                      id="inviteCode"
                      value={inviteCode}
                      readOnly={user?.referralData ? true : false}
                      onChange={handleInviteCodeChange}
                      className="w-full bg-[rgba(0,52,89,0.80)] border-[1px] border-[#245F89] rounded-lg p-4 pr-[90px] text-sm font-semibold font-outfit tracking-wide"
                    />
                  </div>
                </div>
                {/* actions */}
                <div className="flex w-full gap-8 mt-8">
                  <div className="flex flex-row justify-center lg:justify-start w-full gap-4 scale-90 lg:scale-100">
                    {user?.canResetPassword === true && (
                      <button
                        className="w-[200px] h-[60px] justify-center items-center inline-flex"
                        disabled={resetPasswordLoading}
                        type="button"
                        onClick={handleResetPassword}
                      >
                        <div className="w-[200px] h-[60px] px-[30px] py-5 bg-sky-700 rounded-[26px] border border-blue-300 justify-between items-center flex hover:bg-sky-600 hover:border-sky-500 hover:pt-[18px] hover:pb-5 hover:scale-105 transition-all duration-300">
                          <div className="text-lg lg:text-xl font-normal leading-tight text-center text-white capitalize">
                            Reset Password
                          </div>
                        </div>
                      </button>
                    )}
                    <button
                      className={`w-[200px] h-[60px] rounded-[26px] justify-center items-center inline-flex ${hasChanges ? "bg-amber-400" : "bg-slate-300"}`}
                      disabled={updateProfileLoading || !hasChanges}
                      type="submit"
                    >
                      <div className={`w-[200px] h-[60px] px-[30px] py-5 rounded-[26px] border justify-center items-center flex ${hasChanges ? "border-orange-300 hover:bg-amber-300 hover:scale-105 transition-all duration-300" : "bg-slate-400 opacity-60"}`}>
                        <div className="text-lg lg:text-xl font-normal leading-tight text-center text-white capitalize">
                          {updateProfileLoading
                            ? <div className="flex items-center justify-center">
                              <MoonLoader size={40} color={'#FFB23F'}/>
                            </div>
                            : "Save Changes"}
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* wallet panel */}
            <WalletBindingPanel className="w-full p-12 my-auto lx:w-1/2" />

            <AvatarSelectionModal 
              isOpen={isAvatarModalOpen} 
              onClose={() => setIsAvatarModalOpen(false)} 
              onAvatarSave={handleAvatarSave} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
