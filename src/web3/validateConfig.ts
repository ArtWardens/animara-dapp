import {
  FreezeTokenPayment,
  GuardSet,
  TokenPayment,
} from "@metaplex-foundation/mpl-candy-machine";
import { fetchToken } from "@metaplex-foundation/mpl-toolbox";
import { PublicKey, Some, Umi } from "@metaplex-foundation/umi";
import { toast } from "react-toastify";

export const checkAtaValid = (
  umi: Umi,
  guards: { label: string; guards: GuardSet }[]
) => {
    console.log("checkAtaValid")
  let atas: PublicKey[] = [];
  guards.forEach((guard) => {
    if (guard.guards.tokenPayment.__option === "Some") {
      let tokenPayment = guard.guards.tokenPayment as Some<TokenPayment>;
      atas.push(tokenPayment.value.destinationAta);
    }
    if (guard.guards.freezeTokenPayment.__option === "Some") {
      let freezeTokenPayment = guard.guards
        .freezeTokenPayment as Some<FreezeTokenPayment>;
      atas.push(freezeTokenPayment.value.destinationAta);
    }
  });
  atas.forEach((ata) => {
    fetchToken(umi, ata).catch((e) => {
      console.log(e);
      toast("Your Candy Guard config is incorrect!");
    });
  });
  return;
};