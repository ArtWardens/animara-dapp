import { auth, settleTapSession, rechargeEnergyByInvite, rechargeEnergy } from "./firebaseConfig";

const settleTapSessionImpl = async ({ newCointAmt, newStamina }) => {
    try {
        const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ false);
        const { data } = await settleTapSession({
            idToken: idToken,
            newCoinAmt: newCointAmt,
            newStamina: newStamina
        });
        return data;
    }catch (error) {
        console.log("Error settling tap session: ", error)
    }
};

const rechargeEnergyImpl = async () => {
    try {
        const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ false);
        const { data } = await rechargeEnergy({
            idToken: idToken,
        });
        return data;
    }catch (error) {
        console.log("Error handling energy recharge: ", error)
    }
};

const rechargeEnergyByInviteImpl = async () => {
    try {
        const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ false);
        const { data } = await rechargeEnergyByInvite({
            idToken: idToken,
        });
        return data;
    }catch (error) {
        console.log("Error handling energy recharge by invite: ", error)
    }
};

export {
    settleTapSessionImpl,
    rechargeEnergyImpl,
    rechargeEnergyByInviteImpl
};