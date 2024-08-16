import { auth, settleTapSession, rechargeEnergyByInvite, rechargeEnergy } from "./firebaseConfig";

const settleTapSessionImpl = async ({ newCointAmt, newStamina }) => {
    try {
        const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ false);
        const result = await settleTapSession({
            idToken: idToken,
            newCoinAmt: newCointAmt,
            newStamina: newStamina
        });
        if (result.data.error){
            throw result.data.error;
        }
        return result.data;
    }catch (error) {
        console.log("Error settling tap session: ", error);
        throw error;
    }
};

const rechargeEnergyImpl = async () => {
    try {
        const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ false);
        const result = await rechargeEnergy({
            idToken: idToken,
        });
        if (result.data.error){
            throw result.data.error;
        }
        return result.data;
    }catch (error) {
        console.log("Error handling energy recharge: ", error);
        throw error;
    }
};

const rechargeEnergyByInviteImpl = async () => {
    try {
        const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ false);
        const result = await rechargeEnergyByInvite({
            idToken: idToken,
        });
        if (result.data.error){
            throw result.data.error;
        }
        return result.data;
    }catch (error) {
        console.log("Error handling energy recharge by invite: ", error);
        throw error;
    }
};

export {
    settleTapSessionImpl,
    rechargeEnergyImpl,
    rechargeEnergyByInviteImpl
};