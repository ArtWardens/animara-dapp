const web3 = require("@solana/web3.js");

const finalizeCashbackTxn = async (sendTransaction, serializedTxn) =>{
  // deserialize txn that comes from backend
  const txn = web3.Transaction.from(Buffer.from(serializedTxn, "base64"));

  // send transaction (includes prompting user to sign it)
  const connection = new web3.Connection(process.env.REACT_APP_RPC, 'confirmed');
  const signature = await sendTransaction(txn, connection);

  // verify that transaciton has been confirmed
  const latestBlockHash = await connection.getLatestBlockhash();
  const confirmStrategy = {
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: signature
  }
  const result = await connection.confirmTransaction(confirmStrategy);
  return result;
}
  
export {
  finalizeCashbackTxn,
};