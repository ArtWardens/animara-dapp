const web3 = require("@solana/web3.js");

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
    
    // Get the latest blockhash and confirm the transaction
    const latestBlockHash = await connection.getLatestBlockhash();
    const confirmStrategy = {
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: signature
    };
    
    // Confirm the transaction
    const result = await connection.confirmTransaction(confirmStrategy);
    return result;
  })();

  // Race the transaction confirmation against the timeout
  return Promise.race([timeoutPromise, transactionPromise]);
};

  
export {
  finalizeCashbackTxnImpl,
};