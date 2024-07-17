import { useState } from "react";
import { getAuth, onAuthStateChanged } from "../../firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import ReferPopup from "../../components/ReferPopup";

function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const auth = getAuth();

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log("TESTING", user.uid);
      // get user from firestore db
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setInviteCode(docSnap.data().referralCode);
      } else {
        console.log("No such document!");
      }
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center">
      <button
        onClick={() => setShowPopup(!showPopup)}
        className="bg-white px-6 py-2 text-black font-outfit"
      >
        Refer a friend
      </button>
      {showPopup && (
        <ReferPopup inviteCode={inviteCode} onClose={setShowPopup} />
      )}
    </div>
  );
}

export default Home;
