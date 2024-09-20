import { auth, claimCashback, cancelCashbackClaim } from "./firebaseConfig";

const claimCashbackImpl = async () => {
  const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ false);
  const result = await claimCashback({
      idToken: idToken,
  });
  if (result.data.error){
    if (result.data.error === "no-cashback-to-claim"){
      return result.data;
    } else if (result.data.error === "no-wallet"){
      return result.data;
    } 
    throw result.data.error;
  }
  return result.data;
};

const cancelCashbackClaimImpl = async (claimId) => {
    const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ false);
    const result = await cancelCashbackClaim({
        idToken: idToken,
        claimId: claimId,
    });
    if (result.data.error){
      if (result.data.error === "invalid-cashback-claim"){
        return result.data;
      } else if (result.data.error === "no-cashback-to-claim"){
        return result.data;
      }
      throw result.data.error;
    }
    return result.data;
  };

export {
  claimCashbackImpl,
  cancelCashbackClaimImpl,
};