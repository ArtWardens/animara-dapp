import { auth, getUserLocations, exploreLocation, settleTapSession, rechargeEnergyByInvite, rechargeEnergy } from "./firebaseConfig";

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

const getUserLocationImpl = async () => {
    try {
        // obtain the ID token of the current logged-in user
        const idToken = await auth.currentUser.getIdToken(false);
        const result = await getUserLocations({ idToken: idToken });

        console.log(result.data);

        if (result.data.error) {
            throw result.data.error;
        }

        return result.data;

    } catch (error) {
        console.log("Error handling get user location details ", error);
        throw error;
    }
};


const upgradeUserLocationImpl = async (locationId) => {
    try {
        const idToken = await auth.currentUser.getIdToken(false);
        const result = await exploreLocation({
            idToken: idToken,
            locationId: locationId.payload
        });

        if (result.data.error) {
            throw result.data.error;
        }

        return result;

    } catch (error) {
        console.log("Error handling get user location details:", error);
        throw error;
    }
};


export {
    settleTapSessionImpl,
    rechargeEnergyImpl,
    rechargeEnergyByInviteImpl,
    getUserLocationImpl,
    upgradeUserLocationImpl
};