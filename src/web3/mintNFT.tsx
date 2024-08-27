import { CandyGuard, CandyMachine } from "@metaplex-foundation/mpl-candy-machine";
import { AddressLookupTableInput, KeypairSigner, PublicKey, Transaction, Umi, generateSigner, signAllTransactions } from "@metaplex-foundation/umi";
import { DigitalAsset, DigitalAssetWithToken, JsonMetadata, fetchDigitalAsset, fetchJsonMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { setComputeUnitPrice } from "@metaplex-foundation/mpl-toolbox";
import { chooseGuardToUse, routeBuilder, mintArgsBuilder, buildTx, getRequiredCU } from "./mintHelper.ts";
import { toast } from "react-toastify";
import { GuardReturn } from "./checkerHelper.ts";
import { verifyTx } from "./verifyTx.ts";

const fetchNft = async (
  umi: Umi,
  nftAdress: PublicKey,
) => {
  let digitalAsset: DigitalAsset | undefined;
  let jsonMetadata: JsonMetadata | undefined;
  try {
    digitalAsset = await fetchDigitalAsset(umi, nftAdress);
    jsonMetadata = await fetchJsonMetadata(umi, digitalAsset.metadata.uri);
  } catch (e) {
    console.error(e);
    throw e;
  }

  return { digitalAsset, jsonMetadata };
};

export async function mintImpl(
  umi: Umi,
  guard: GuardReturn,
  candyMachine: CandyMachine,
  candyGuard: CandyGuard,
  ownedTokens: DigitalAssetWithToken[],
  guardList: GuardReturn[],
) {
  const guardToUse = chooseGuardToUse(guard, candyGuard);
  if (!guardToUse.guards) {
    console.error("no guard defined!");
    throw new Error('no guard defined');
  }

  try {
    //find the guard by guardToUse.label and set minting to true
    const guardIndex = guardList.findIndex((g) => g.label === guardToUse.label);
    if (guardIndex === -1) {
      console.error("guard not found");
      throw new Error('guard not found');
    }
    const newGuardList = [...guardList];
    newGuardList[guardIndex].minting = true;

    let routeBuild = await routeBuilder(umi, guardToUse, candyMachine);
    if (routeBuild && routeBuild.items.length > 0) {
      routeBuild = routeBuild.prepend(setComputeUnitPrice(umi, { microLamports: parseInt(process.env.REACT_APP__MICROLAMPORTS ?? "1001") }));
      const latestBlockhash = await umi.rpc.getLatestBlockhash({ commitment: "finalized" });
      routeBuild = routeBuild.setBlockhash(latestBlockhash)
      const builtTx = await routeBuild.buildAndSign(umi);
      const sig = await umi.rpc
        .sendTransaction(builtTx, { skipPreflight: true, maxRetries: 1, preflightCommitment: "finalized", commitment: "finalized" })
        .then((signature) => {
          return { status: "fulfilled", value: signature };
        })
        .catch((error) => {
          toast("Allow List TX failed!");
          return { status: "rejected", reason: error, value: new Uint8Array() };

        });
      if (sig.status === "fulfilled")
        await verifyTx(umi, [sig.value], latestBlockhash, "finalized");
    }

    let tables: AddressLookupTableInput[] = [];

    const latestBlockhash = (await umi.rpc.getLatestBlockhash({ commitment: "finalized" }));

    const mintArgs = mintArgsBuilder(candyMachine, guardToUse, ownedTokens);
    const simSigner = generateSigner(umi);
    const txForSimulation = buildTx(
      umi,
      candyMachine,
      candyGuard,
      simSigner,
      guardToUse,
      mintArgs,
      tables,
      latestBlockhash,
      1_400_000
    );
    const requiredCu = await getRequiredCU(umi, txForSimulation);

    const nftSigner: KeypairSigner = generateSigner(umi);
    const transaction: Transaction = buildTx(
      umi,
      candyMachine,
      candyGuard,
      nftSigner,
      guardToUse,
      mintArgs,
      tables,
      latestBlockhash,
      requiredCu,
    );

    const signedTransactions = await signAllTransactions([{
      transaction,
      signers: [umi.payer, nftSigner],
    }]);

    let signatures: Uint8Array[] = [];
    let amountSent = 0;

    const sendPromises = signedTransactions.map(async (tx, index) => {
      return umi.rpc
        .sendTransaction(tx, { skipPreflight: true, maxRetries: 1, preflightCommitment: "finalized", commitment: "finalized" })
        .then((signature) => {
          console.log(
            `Transaction ${index + 1} resolved with signature: ${base58.deserialize(signature)[0]
            }`
          );
          amountSent = amountSent + 1;
          signatures.push(signature);
          return { status: "fulfilled", value: signature };
        })
        .catch((error) => {
          console.error(`Transaction ${index + 1} failed:`, error);
          return { status: "rejected", reason: error };
        });
    });

    await Promise.allSettled(sendPromises);
    if (!(await sendPromises[0]).status === true) {
      // throw error that no tx was created
      throw new Error("no tx was created");
    }

    const successfulMints = await verifyTx(umi, signatures, latestBlockhash, "finalized");
    return successfulMints;
  } catch (e) {
    console.error(`minting failed because of ${e}`);
    throw e;
  }
}

export async function fetchMintedNFTImpl(umi: Umi, successfulMints: PublicKey[]){
    // Filter out successful mints and map to fetch promises
    const fetchNftPromises = successfulMints.map((mintResult) =>
      fetchNft(umi, mintResult).then((nftData) => ({
        mint: mintResult,
        nftData,
      }))
    );

    const fetchedNftsResults = await Promise.all(fetchNftPromises);

    // Prepare data for setting mintsCreated
    let newMintsCreated: { mint: PublicKey; offChainMetadata: JsonMetadata }[] =
      [];
    fetchedNftsResults.map((acc) => {
      if (acc.nftData.digitalAsset && acc.nftData.jsonMetadata) {
        newMintsCreated.push({
          mint: acc.mint,
          offChainMetadata: acc.nftData.jsonMetadata,
        });
      }
      return acc;
    }, []);

    // Update mintsCreated only if there are new mints
    if (newMintsCreated.length > 0) {
      return newMintsCreated;
    }else{
      return [];
    }
}
