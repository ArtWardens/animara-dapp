import { handlePasswordReset } from "../../firebase/auth";
import { auth, storage } from "../../firebase/firebaseConfig";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useUserStore } from "../../store/store.ts";
// import {
//   User,
//   updateProfile,
//   updateEmail,
//   updatePhoneNumber,
//   PhoneAuthCredential,
// } from "firebase/auth";
import { updateUserProfile } from "../../firebase/profile.ts";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
const EditProfile = () => {
  const navigate = useNavigate();
  const { isLoggedIn, loading, user } = useAuth();
  console.log("BELOW IS MY USER");
  console.log(user);

  useEffect(() => {
    console.log(isLoggedIn, loading);
    if (!isLoggedIn && !loading) {
      navigate("/login");
      toast.error("You need to be logged in to access this page");
    }
  }, [isLoggedIn, navigate, loading]);

  const [isSaving, setIsSaving] = useState(false);
  const [firstname, setFirstname] = useState();
  const [lastname, setLastname] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [inviteCode, setInviteCode] = useState();
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

    // try {
    //   if (imageData) {
    //     // Upload the image data as a string to Firebase Storage
    //     await uploadString(pfpRef, imageData.toString(), "data_url");

    //     // Get the download URL for the uploaded image
    //     const downloadURL = await getDownloadURL(pfpRef);

    //     // if (phone !== userStore.user?.phoneNumber) {
    //     //   await updatePhoneNumber(currentUser, phone);
    //     // }

    //     // Update the user's profile with the new image URL
    //     await updateProfile(currentUser, {
    //       displayName: `${firstname} ${lastname}`,
    //       photoURL: downloadURL,
    //     });
    //   } else {
    //     // If imageData is null, update the profile without changing the photoURL
    //     await updateProfile(currentUser, {
    //       displayName: `${firstname} ${lastname}`,
    //     });
    //   }

    //   userStore.setUser(currentUser);
    //   toast.success("Profile updated successfully");
    // } catch (error) {
    //   toast.error(error.message);
    // }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] px-20 py-10 bg-[#1e1e1e]">
      <div className="w-full h-full border border-gray-100 p-10 rounded-xl shadow-lg backdrop-blur-sm z-10 relative">
        <div className="header flex justify-between items-center">
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
          <span
            className="rounded-full border border-foreground overflow-hidden relative group"
            onClick={() => {
              inputFile.current?.click();
            }}
          >
            <img
              src={imageData?.toString() || user?.photoURL || "/lock.png" || ""}
              alt="pfp"
              className="group-hover:brightness-75 h-24 w-24"
            />
            <img
              src="/icons/edit.png"
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
            <div className="flex flex-col gap-2 w-full">
              <label
                htmlFor="firstname"
                className="font-acumin text-sm font-semibold"
              >
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
              <label
                htmlFor="lastname"
                className="font-acumin text-sm font-semibold"
              >
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
          <div className="flex gap-10 mt-3 w-full">
            <div className="flex flex-col gap-2 w-full">
              <label
                htmlFor="email"
                className="font-acumin text-sm font-semibold"
              >
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
          <div className="flex gap-10 mt-3 w-full">
            <div className="flex flex-col gap-2 w-full">
              <label
                htmlFor="phone"
                className="font-acumin text-sm font-semibold"
              >
                Phone
              </label>
              <input
                type="number"
                id="phone"
                readOnly
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="p-3 w-full  bg-inherit border-foreground border rounded-lg disabled:opacity-50"
                placeholder="+6011 1234 5678"
              />
            </div>
          </div>
          <div className="flex gap-10 mt-3 w-full">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="font-acumin text-sm font-semibold"
              >
                Invite Code
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
          <div className="flex gap-10 mt-10 w-full">
            <div className="flex flex-col md:flex-row justify-end gap-5 w-full">
              <span className="bg-gradient-to-r p-[2px] from-blue-500 to-fuchsia-600 rounded-lg w-54 md:w-96">
                <button
                  className="p-2 w-full bg-[#1e1e1e] rounded-lg text-white font-semibold"
                  type="button"
                  onClick={() => {
                    handlePasswordReset(email);
                  }}
                >
                  Reset Password
                </button>
              </span>
              <button
                disabled={isSaving}
                type="submit"
                className="p-2 w-54 md:w-96 bg-inherit rounded-lg text-white font-semibold bg-gradient-to-r from-blue-500 to-fuchsia-600"
              >
                {isSaving ? "Saving changes.." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
      <img src="/Ellipse3.png" className="absolute bottom-0 left-0 h-60 z-0" />
      <img src="/Ellipse1.png" className="absolute top-0 left-1/2 h-60 z-0" />
      <img src="/Ellipse1.png" className="absolute bottom-0 right-0 h-60 z-0" />
    </div>
  );
};

export default EditProfile;
