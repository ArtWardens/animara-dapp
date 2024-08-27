import { BlockhashWithExpiryBlockHeight, PublicKey, Umi } from "@metaplex-foundation/umi";

const detectBotTax = (logs: string[]) => {
  if (logs.find((l) => l.includes("Candy Guard Botting"))) {
    return true;
  }
  return false;
};

type VerifySignatureResult =
  | { success: true; mint: PublicKey; reason?: never }
  | { success: false; mint?: never; reason: string };

export const verifyTx = async (umi: Umi, signatures: Uint8Array[], blockhash: BlockhashWithExpiryBlockHeight, commitment: "processed" | "confirmed" | "finalized") => {
  const verifySignature = async (
    signature: Uint8Array
  ): Promise<VerifySignatureResult> => {
    let transaction;
    for (let i = 0; i < 30; i++) {
      transaction = await umi.rpc.getTransaction(signature);
      if (transaction) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    if (!transaction) {
      return { success: false, reason: "No TX found" };
    }

    if (detectBotTax(transaction.meta.logs)) {
      return { success: false, reason: "Bot Tax detected!" };
    }

    return { success: true, mint: transaction.message.accounts[1] };
  };

  await umi.rpc.confirmTransaction(signatures[0], { strategy: { type: "blockhash", ...blockhash}, commitment });

  const stati = await Promise.all(signatures.map(verifySignature));
  let successful: PublicKey[] = [];
  let failed: string[] = []
  stati.forEach((status) => {
    if ((status.success === true)) {
      successful.push(status.mint);
    } else {
      failed.push(status.reason)
    }
  });

  if (failed && failed.length > 0){
    failed.forEach((fail) => {
      console.error(fail)
    })
  }

  return successful;
};
