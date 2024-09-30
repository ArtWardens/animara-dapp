import { PublicKey, Umi } from "@metaplex-foundation/umi";

const detectBotTax = (logs: string[]) => {
  if (logs.find((l) => l.includes("Candy Guard Botting"))) {
    return true;
  }
  return false;
};

type VerifySignatureResult =
  | { success: true; mint: PublicKey; reason?: never }
  | { success: false; mint?: never; reason: string };

// Helper function to add a delay
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const verifyTx = async (umi: Umi, signatures: Uint8Array[], commitment: "processed" | "confirmed" | "finalized") => {
  console.log(`start verifying tx: `, signatures);
  const verifySignature = async (
    signature: Uint8Array
  ): Promise<VerifySignatureResult> => {
    let transaction;
    for (let i = 0; i < 30; i++) {
      console.log(`verfying signature ${i+1}/30 times`);
      transaction = await umi.rpc.getTransaction(signature);
      if (transaction) {
        console.log(`signature verfied`);
        break;
      }
      console.log(`waiting 3s to verify signature again`);
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

  // confirmTransaction is deperacted
  // https://solana.com/docs/rpc/deprecated/confirmtransaction
  // try to check txn statuses with delayed retries  
  const maxRetries = 10;
  let retries = 0;
  let txnConfirmed = false;
  while (!txnConfirmed && retries < maxRetries) {
    console.log(`verifying tx retry #${retries}`);
    // tries to get txn status
    const txnStatuses = await umi.rpc.getSignatureStatuses(signatures, {searchTransactionHistory: true});
    
    // check if txn status matches our desired status
    if (txnStatuses[0] && txnStatuses[0].commitment === commitment) {
      txnConfirmed = true;
      console.log(`verified tx on retry #${retries}`);
      break;
    }
    
    retries++;
    
    // delay between 1 and 6 seconds based on retries
    const escalatingDelay = Math.floor(1000 * retries) + 1000;
    
    // Wait for the random delay
    console.log(`waiting ${escalatingDelay} ms before retrying`);
    await wait(escalatingDelay);
  }
  
  if (!txnConfirmed) {
    console.log(`TX Not ${commitment} after ${retries} retries`);
    return { success: false, reason: `TX Not ${commitment} after ${retries} retries` };
  }

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
