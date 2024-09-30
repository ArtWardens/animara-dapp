const web3 = require("@solana/web3.js");

// Helper function to add a delay
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const finalizeCashbackTxnImpl = async (sendTransaction, serializedTxn, timeout) => {
  // Deserialize the transaction from the backend
  const txn = web3.Transaction.from(Buffer.from(serializedTxn, "base64"));
  
  // Set up the Solana connection
  const connection = new web3.Connection(process.env.REACT_APP_RPC, 'confirmed');
  
  // Create a promise that resolves with a timeout
  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, timeout);
  });

  // Create a promise that resolves when the transaction is confirmed
  const transactionPromise = (async () => {
    // Send the transaction (includes prompting the user to sign it)
    const signature = await sendTransaction(txn, connection);
    
    // Confirm the transaction
    // confirmTransaction is deperacted
    // https://solana.com/docs/rpc/deprecated/confirmtransaction
    // try to check txn statuses with delayed retries
    const maxRetries = 10;
    let retries = 0;
    let txnConfirmed = false;
    let result;
    while (!txnConfirmed && retries < maxRetries) {
      // tries to get txn status
      const txnStatuses = await connection.getSignatureStatus(signature, {searchTransactionHistory: true});
      
      // check if txn status matches our desired status
      if (txnStatuses[0] && txnStatuses[0].commitment === "finalized") {
        txnConfirmed = true;
        result = txnStatuses;
        break;
      }
      
      retries++;
      
      // delay between 1 and 6 seconds based on retries
      const escalatingDelay = Math.floor(1000 * retries) + 1000;
      
      // Wait for the random delay
      await wait(escalatingDelay);
    }
    if (!txnConfirmed){
      return null;
    }
    return result;
  })();

  // Race the transaction confirmation against the timeout
  return Promise.race([timeoutPromise, transactionPromise]);
};

  
export {
  finalizeCashbackTxnImpl,
};