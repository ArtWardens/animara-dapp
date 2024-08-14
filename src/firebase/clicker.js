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
    // get user's updated details for each location from firebase
    try {
        // obtain the ID token of the currrent logged in user
        const idToken = await auth.currentUser.getIdToken(false);
        const data = await getUserLocations({
            idToken: idToken,
        });
        return data;

    } catch (error) {
        console.log("Error handling get user location details ", error);

    }
};

const upgradeUserLocationImpl = async (locationId) => {
    console.log(locationId);
    // update user's location in firestore
    try {
        // obtain the ID token of the currrent logged in user
        const idToken = await auth.currentUser.getIdToken(false);
        const data = await exploreLocation({
            idToken: idToken,
            locationId: locationId.payload
        });
        return data;

    } catch (error) {
        console.log("Error handling get user location details ", error);

    }
};

export {
    settleTapSessionImpl,
    rechargeEnergyImpl,
    rechargeEnergyByInviteImpl,
    getUserLocationImpl,
    upgradeUserLocationImpl
};