import { auth, getUserLocations, exploreLocation, settleTapSession, rechargeEnergyByInvite, rechargeEnergy, bindWallet, unbindWallet } from "./firebaseConfig";

const settleTapSessionImpl = async ({ newCointAmt, newStamina }) => {
    const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ false);
    const result = await settleTapSession({
        idToken: idToken,
        newCoinAmt: newCointAmt,
        newStamina: newStamina
    });
    if (result.data.error){
        if (result.data.error === "too-fast"){
            return result.data;
        }
        throw result.data.error;
    }
    return result.data;
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
        console.log("Failed to recharge stamina with error: ", error);
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
        console.log("Failed to recharge stamina by invite with error: ", error);
        throw error;
    }
};


const getUserLocationImpl = async () => {
    try {
        // obtain the ID token of the current logged-in user
        const idToken = await auth.currentUser.getIdToken(false);
        const result = await getUserLocations({ idToken: idToken });

        if (result.data.error) {
            throw result.data.error;
        }
        return result.data;
    }catch (error) {
        console.log("Failed to get user location with error: ", error);
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
        if (result.data.error){
            throw result.data.error;
        }
        return result.data;
    }catch (error) {
        console.log("Failed to upgrade user location with error: ", error);
        throw error;
    }
};

const bindWalletImpl = async (walletAddr) => {
    try {
        const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ false);
        const result = await bindWallet({
            idToken: idToken,
            walletAddr: `${walletAddr}`
        });
        if (result.data.error){
            throw result.data.error;
        }
        return result.data;
    }catch (error) {
        console.log("Failed to connect wallet with error: ", error);
        throw error;
    }
};

const unbindWalletImpl = async () => {
    try {
        const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ false);
        const result = await unbindWallet({
            idToken: idToken,
        });
        if (result.data.error){
            throw result.data.error;
        }
        return result.data;
    }catch (error) {
        console.log("Failed to disconnect wallet with error: ", error);
        throw error;
    }
};

export {
    settleTapSessionImpl,
    rechargeEnergyImpl,
    rechargeEnergyByInviteImpl,
    getUserLocationImpl,
    upgradeUserLocationImpl,
    bindWalletImpl,
    unbindWalletImpl
};
