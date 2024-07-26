
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch } from '../../hooks/storeHooks.js';
import { useUserDetails, useUserAuthenticated, useAuthLoading, resetPassword, useResetPasswordLoading, updateProfile, useUpdateProfileLoading } from '../../sagaStore/slices/userSlice.js';

const EditProfile = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useUserAuthenticated();
  const isAuthLoading = useAuthLoading();
  const resetPasswordLoading = useResetPasswordLoading();
  const updateProfileLoading = useUpdateProfileLoading();
  const user = useUserDetails();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [imageData, setImageData] = useState(null);
  const inputFile = useRef(null);

  useEffect(() => {
    if (!isAuthenticated && !isAuthLoading) {
      navigate("/login");
      toast.error("You need to be logged in to access this page");
    }
  }, [navigate, isAuthenticated, isAuthLoading]);

  useEffect(() => {
    setFirstname(user?.name?.split(" ").slice(0, -1).join(" ") || "");
    setLastname(user?.name?.split(" ").slice(-1).join(" ") || "");
    setEmail(user?.email || "");
    setPhone(user?.phoneNumber || "");
    setInviteCode(user?.referredBy || "");
  }, [user]);

  const handleResetPassword = ()=>{
    dispatch(resetPassword());
  }

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    dispatch(updateProfile({
      fullName: firstname + " " + lastname,
      inviteCode: inviteCode || null,
      profilePicture: imageData ? imageData.toString() : null
    }));
  };

  return (
    <div className="justify-center items-center place-content-center p-40 bg-[#1e1e1e]">
      {/* update profile card */}
      <div className="w-full h-full border border-gray-100 p-10 rounded-xl shadow-lg backdrop-blur-sm z-10 relative">
        {/* content */}
        <div className="header flex justify-between items-center">
          {/* Header */}
          <span className="flex gap-2">
            <span>
              <span className="flex gap-2">
                <h1 className="text-4xl tracking-wide">EDIT PROFILE</h1>
                {user?.isKOL && (
                  <span className="bg-gradient-to-r from-blue-500 to-fuchsia-600 p-2 rounded-lg">
                    <span className="text-white font-semibold font-degular">
                      Certified KOL
                    </span>
                  </span>
                )}
              </span>
              <p className="font-acumin text-xs">Settings&#9656;Edit Profile</p>
            </span>
          </span>

          {/* Profile picture */}
          <span
            className="rounded-full border border-foreground overflow-hidden relative group"
            onClick={() => {
              inputFile.current?.click();
            }}
          >
            {/* profile picture */}
            <img
              src={imageData?.toString() || user?.photoURL || "../../assets/images/lock.png" || ""}
              alt="pfp"
              className="group-hover:brightness-75 h-24 w-24"
            />

            {/*  edit overlay */}
            <img
              src="./../assets/icons/edit.png"
              alt="edit"
              className="invisible group-hover:visible absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-white fill-white"
            />
          </span>

          {/* profile picture input */}
          <input
            type="file"
            id="pfp"
            name="pfp"
            ref={inputFile}
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                  setImageData(reader.result);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </div>

        {/* use profile */}
        <form className="form font-degular mt-5" onSubmit={handleUpdateProfile}>
          {/* Full Name */}
          <div className="flex flex-col md:flex-row gap-5 md:gap-10 mt-3 w-full">
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="firstname" className="font-acumin text-sm font-semibold">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="firstname"
                required
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                className="p-3 w-full bg-inherit border-foreground border rounded-lg"
                placeholder="John Doe"
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="lastname" className="font-acumin text-sm font-semibold">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lastname"
                required
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                className="p-3 w-full bg-inherit border-foreground border rounded-lg"
                placeholder="John Doe"
              />
            </div>
          </div>
          {/* Email */}
          <div className="flex gap-10 mt-3 w-full">
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="email" className="font-acumin text-sm font-semibold">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                readOnly={user?.email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-3 w-full bg-inherit border-foreground border rounded-lg disabled:opacity-50"
                placeholder="xyz@gmail.com"
              />
            </div>
          </div>
          {/* Phone Number */}
          <div className="flex gap-10 mt-3 w-full">
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="phone" className="font-acumin text-sm font-semibold">
                Phone
              </label>
              <input
                type="number"
                id="phone"
                readOnly
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="p-3 w-full bg-inherit border-foreground border rounded-lg disabled:opacity-50"
                placeholder="+6011 1234 5678"
              />
            </div>
          </div>
          {/* Invite Code */}
          <div className="flex gap-10 mt-3 w-full">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="font-acumin text-sm font-semibold">
                Invited by
              </label>
              <input
                type="text"
                id="inviteCode"
                value={inviteCode}
                readOnly={user?.referredBy ? true : false}
                onChange={(e) => setInviteCode(e.target.value)}
                className="p-3 bg-inherit border-foreground border rounded-lg disabled:opacity-50"
              />
            </div>
          </div>
          {/* Actions */}
          <div className="flex gap-10 mt-10 w-full">
            <div className="flex flex-col md:flex-row justify-end gap-5 w-full">
              {/* Reset password Button */}
              <span className="bg-gradient-to-r p-[2px] from-blue-500 to-fuchsia-600 rounded-lg w-54 md:w-96">
                <button
                  disabled={resetPasswordLoading}
                  className="p-2 w-full bg-[#1e1e1e] rounded-lg text-white font-semibold"
                  type="button"
                  onClick={handleResetPassword}
                >
                  {resetPasswordLoading ? "Resetting Password.." : "Reset Password"}
                </button>
              </span>
              {/* Save changes button */}
              <button
                disabled={updateProfileLoading}
                type="submit"
                className="p-2 w-54 md:w-96 bg-inherit rounded-lg text-white font-semibold bg-gradient-to-r from-blue-500 to-fuchsia-600"
              >
                {updateProfileLoading ? "Saving changes.." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* styling */}
      <img src="../../assets/images/Ellipse3.png" className="absolute bottom-0 left-0 h-60 z-0" />
      <img src="../../assets/images/Ellipse1.png" className="absolute top-0 left-1/2 h-60 z-0" />
      <img src="../../assets/images/Ellipse1.png" className="absolute bottom-0 right-0 h-60 z-0" />
    </div>
  );
};

export default EditProfile;

