
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { handlePasswordReset } from "../../firebase/auth.js";
import { updateUserProfile } from "../../firebase/profile.ts";
import { FaCopy } from "react-icons/fa6";
import useAuth from "../../hooks/useAuth.js";
import Header from "../../components/Header.jsx";

const EditProfilePage = ({
  currentUser,
  totalClicks
}) => {

  const navigate = useNavigate();
  
  const { isLoggedIn, loading, user } = useAuth();

  const handleBackClick = () => {
    navigate('/clicker');
  };

  useEffect(() => {
    if (!isLoggedIn && !loading) {
      navigate("/login");
      toast.error("You need to be logged in to access this page");
    }
  }, [isLoggedIn, navigate, loading]);

  const [isSaving, setIsSaving] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [imageData, setImageData] = useState(null);

  const inputFile = useRef(null);

  useEffect(() => {
    setFirstname(user?.name?.split(" ").slice(0, -1).join(" ") || "");
    setLastname(user?.name?.split(" ").slice(-1).join(" ") || "");
    setEmail(user?.email || "");
    setPhone(user?.phoneNumber || "");
    setInviteCode(user?.referredBy || "");
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await updateUserProfile(
        firstname + " " + lastname,
        inviteCode || null,
        imageData ? imageData.toString() : null
      );
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    alert('Invite code copied to clipboard!');
  };

  return (
    <>
      <Header
        currentUser={currentUser}
        totalClicks={totalClicks}
      />

      <div
        className="justify-center items-center place-content-center p-44"
        style={{
          backgroundImage: 'url("../../assets/images/clicker-character/clickerWall.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >

        <div className="w-full h-full">
          <div className="header flex justify-between items-center">
            <span className="flex gap-2">
              <span>
                <span
                  onClick={handleBackClick}
                  className="text-white text-sm font-outfit tracking-wide hover:text-amber-500 transition-colors cursor-pointer"
                >
                  &lt;&nbsp;Back
                </span>
                <span className="flex">
                  <div
                    class="w-[339px] text-left text-amber-500 text-5xl font-normal font-['Luckiest Guy'] uppercase leading-[54px]"
                    style={{
                      WebkitTextStrokeWidth: '2px',
                      WebkitTextStrokeColor: 'var(--Color-11, #FFF)',
                    }}
                  >
                    EDIT PROFILE
                  </div>
                  {user?.isKOL && (
                    <span class="bg-sky-700 rounded-lg flex items-center m-3 px-2">
                      <span class="text-white text-xs tracking-wider font-outfit">Certified KOL</span>
                    </span>
                  )}
                </span>
                <div class="text-white text-sm font-outfit tracking-wide pb-8">Settings &nbsp; &gt; &nbsp; Edit Profile</div>
              </span>
            </span>
            <span
              className="flex w-24 h-24 items-center justify-center rounded-full border overflow-hidden relative group"
              onClick={() => {
                inputFile.current?.click();
              }}
              style={{
                flexShrink: 0,
                borderRadius: '500px',
                border: '2.5px solid var(--80E8FF, #80E8FF)',
                background: `url(${imageData?.toString() || user?.photoURL || "../../assets/images/lock.png" || ""}) lightgray 50% / cover no-repeat`
              }}
            >
              <img
                src={imageData?.toString() || user?.photoURL || "../../assets/images/lock.png" || ""}
                alt="pfp"
                className="group-hover:brightness-75 h-full w-full object-cover"
              />
              <img
                src="./../assets/icons/edit.png"
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
          <form className="form font-degular mt-5" onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-5 md:gap-10 mt-3 w-full">
              <div className="flex flex-col gap-2 w-full pb-4">
                <label htmlFor="firstname" className="text-sm font-outfit tracking-wide">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="firstname"
                  required
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  className="w-full bg-[rgba(0,52,89,0.80)] border-[1px] border-[#245F89] rounded-lg flex p-4 items-center gap-2 text-sm font-semibold font-outfit tracking-wide"
                />
              </div>
              <div className="flex flex-col gap-2 w-full pb-4">
                <label htmlFor="lastname" className="text-sm font-outfit tracking-wide">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lastname"
                  required
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  className="w-full bg-[rgba(0,52,89,0.80)] border-[1px] border-[#245F89] rounded-lg flex p-4 items-center gap-2 text-sm font-semibold font-outfit tracking-wide"
                />
              </div>
            </div>
            <div className="flex gap-10 mt-3 w-full">
              <div className="flex flex-col gap-2 w-full pb-4">
                <label htmlFor="email" className="text-sm font-outfit tracking-wide">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  readOnly={user?.email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[rgba(0,52,89,0.80)] border-[1px] border-[#245F89] rounded-lg flex p-4 items-center gap-2 text-sm font-semibold font-outfit tracking-wide"
                />
              </div>
            </div>
            <div className="flex gap-10 mt-3 w-full">
              <div className="flex flex-col gap-2 w-full pb-4">
                <label htmlFor="phone" className="text-sm font-outfit tracking-wide">
                  Phone
                </label>
                <input
                  type="number"
                  id="phone"
                  readOnly
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[rgba(0,52,89,0.80)] border-[1px] border-[#245F89] rounded-lg flex p-4 items-center gap-2 text-sm font-semibold font-outfit tracking-wide"
                />
              </div>
              <div className="flex flex-col gap-2 w-full pb-4 relative">
                <label htmlFor="inviteCode" className="text-sm font-outfit tracking-wide">
                  Invite Code
                </label>
                <div className="flex items-center w-full relative">
                  <input
                    type="text"
                    id="inviteCode"
                    value={inviteCode}
                    readOnly={user?.referredBy ? true : false}
                    onChange={(e) => setInviteCode(e.target.value)}
                    className="w-full bg-[rgba(0,52,89,0.80)] border-[1px] border-[#245F89] rounded-lg p-4 pr-[90px] text-sm font-semibold font-outfit tracking-wide"
                  />
                  <button
                    type="button"
                    onClick={copyInviteCode}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-[#FA0] border-[1px] border-[#FFAA00] rounded-[6px] flex items-center justify-center p-[5px] w-[70px] h-[38px] shadow-inner text-xs font-bold font-outfit px-2"
                    style={{
                      boxShadow: '0px 4px 4px 0px rgba(255, 210, 143, 0.61) inset',
                    }}
                  >
                    <FaCopy />
                    &nbsp;COPY
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-10 mt-10 w-full">
              <div className="flex flex-col md:flex-row justify-start gap-5 w-full">
                <button
                  class="w-[200px] h-[60px] justify-start items-center gap-[46px] inline-flex"
                  type="button"
                  onClick={() => {
                    handlePasswordReset(email);
                  }}
                >
                  <div class="w-[200px] h-[60px] px-[30px] py-5 bg-sky-700 rounded-[26px] border border-blue-300 justify-between items-center flex hover:bg-sky-500 hover:border-sky-500 hover:pt-[18px] hover:pb-5">
                    <div class="text-center text-white text-xl font-normal capitalize leading-tight hover:font-bold">
                      Reset Password
                    </div>
                  </div>
                </button>
                <button
                  class="w-[200px] h-[60px] justify-between items-center inline-flex"
                  disabled={isSaving}
                  type="submit"
                >
                  <div class="w-[200px] h-[60px] px-[30px] py-5 bg-amber-400 rounded-[26px] border border-orange-300 justify-between items-center flex hover:bg-amber-300">
                    <div class="text-center text-white text-xl font-bold capitalize leading-tight">
                      {isSaving ? "Saving changes.." : "Save Changes"}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProfilePage;

