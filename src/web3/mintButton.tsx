import React from "react";
import { CandyGuard, CandyMachine } from "@metaplex-foundation/mpl-candy-machine";
import { AddressLookupTableInput, KeypairSigner, PublicKey, Transaction, Umi, createBigInt, generateSigner, signAllTransactions } from "@metaplex-foundation/umi";
import { DigitalAsset, DigitalAssetWithToken, JsonMetadata, fetchDigitalAsset, fetchJsonMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { setComputeUnitPrice } from "@metaplex-foundation/mpl-toolbox";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { chooseGuardToUse, routeBuilder, mintArgsBuilder, GuardButtonList, buildTx, getRequiredCU } from "./mintHelper.ts";
import { toast } from "react-toastify";
import { useSolanaTime } from "./SolanaTimeContext.tsx";
import { GuardReturn } from "./checkerHelper.ts";
import { verifyTx } from "./verifyTx.ts";
import { mintText } from "../settings.tsx";


const updateLoadingText = (
  loadingText: string | undefined,
  guardList: GuardReturn[],
  label: string,
  setGuardList: Dispatch<SetStateAction<GuardReturn[]>>
) => {
  const guardIndex = guardList.findIndex((g) => g.label === label);
  if (guardIndex === -1) {
    console.error("guard not found");
    return;
  }
  const newGuardList = [...guardList];
  newGuardList[guardIndex].loadingText = loadingText;
  setGuardList(newGuardList);
};

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
    toast("Nft could not be fetched!");
  }

  return { digitalAsset, jsonMetadata };
};

export async function mintClick(
  umi: Umi,
  guard: GuardReturn,
  candyMachine: CandyMachine,
  candyGuard: CandyGuard,
  ownedTokens: DigitalAssetWithToken[],
  mintsCreated:
    | {
      mint: PublicKey;
      offChainMetadata: JsonMetadata | undefined;
    }[]
    | undefined,
  setMintsCreated: Dispatch<
    SetStateAction<
      | { mint: PublicKey; offChainMetadata: JsonMetadata | undefined }[]
      | undefined
    >
  >,
  guardList: GuardReturn[],
  setGuardList: Dispatch<SetStateAction<GuardReturn[]>>,
  onOpen: () => void,
  setCheckEligibility: Dispatch<SetStateAction<boolean>>
) {
  const guardToUse = chooseGuardToUse(guard, candyGuard);
  if (!guardToUse.guards) {
    console.error("no guard defined!");
    return;
  }

  try {
    //find the guard by guardToUse.label and set minting to true
    const guardIndex = guardList.findIndex((g) => g.label === guardToUse.label);
    if (guardIndex === -1) {
      console.error("guard not found");
      return;
    }
    const newGuardList = [...guardList];
    newGuardList[guardIndex].minting = true;
    setGuardList(newGuardList);

    let routeBuild = await routeBuilder(umi, guardToUse, candyMachine);
    if (routeBuild && routeBuild.items.length > 0) {
      toast("Allowlist detected. Please sign to be approved to mint.");
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

    const mintTxs: Transaction[] = [];
    let nftsigners = [] as KeypairSigner[];

    const latestBlockhash = (await umi.rpc.getLatestBlockhash({ commitment: "finalized" }));

    const mintArgs = mintArgsBuilder(candyMachine, guardToUse, ownedTokens);
    const nftMintSim = generateSigner(umi);
    const txForSimulation = buildTx(
      umi,
      candyMachine,
      candyGuard,
      nftMintSim,
      guardToUse,
      mintArgs,
      tables,
      latestBlockhash,
      1_400_000
    );
    const requiredCu = await getRequiredCU(umi, txForSimulation);

    const nftMint = generateSigner(umi);
    nftsigners.push(nftMint);
    const transaction = buildTx(
      umi,
      candyMachine,
      candyGuard,
      nftMint,
      guardToUse,
      mintArgs,
      tables,
      latestBlockhash,
      requiredCu,
    );
    mintTxs.push(transaction);

    if (!mintTxs.length) {
      console.error("no mint tx built!");
      return;
    }

    updateLoadingText(``, guardList, guardToUse.label, setGuardList);
    const signedTransactions = await signAllTransactions(
      mintTxs.map((transaction, index) => ({
        transaction,
        signers: [umi.payer, nftsigners[index]],
      }))
    );

    let signatures: Uint8Array[] = [];
    let amountSent = 0;

    const sendPromises = signedTransactions.map((tx, index) => {
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
    updateLoadingText(
      ``,
      guardList,
      guardToUse.label,
      setGuardList
    );

    toast(`${signedTransactions.length} Transaction(s) sent!`);

    const successfulMints = await verifyTx(umi, signatures, latestBlockhash, "finalized");

    updateLoadingText(
      "Fetching your NFT",
      guardList,
      guardToUse.label,
      setGuardList
    );

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
      setMintsCreated(newMintsCreated);
      onOpen();
    }
  } catch (e) {
    console.error(`minting failed because of ${e}`);
    toast("Your mint failed!");
  } finally {
    //find the guard by guardToUse.label and set minting to true
    const guardIndex = guardList.findIndex((g) => g.label === guardToUse.label);
    if (guardIndex === -1) {
      console.error("guard not found");
      // eslint-disable-next-line no-unsafe-finally
      return;
    }
    const newGuardList = [...guardList];
    newGuardList[guardIndex].minting = false;
    setGuardList(newGuardList);
    setCheckEligibility(true);
    updateLoadingText(undefined, guardList, guardToUse.label, setGuardList);
  }
}

// new component called timer that calculates the remaining Time based on the bigint solana time and the bigint toTime difference.
const Timer = ({
  solanaTime,
  toTime,
  setCheckEligibility,
}: {
  solanaTime: bigint;
  toTime: bigint;
  setCheckEligibility: Dispatch<SetStateAction<boolean>>;
}) => {
  const [remainingTime, setRemainingTime] = useState<bigint>(
    toTime - solanaTime
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        return prev - 1n;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  //convert the remaining time in seconds to the amount of days, hours, minutes and seconds left
  const days = remainingTime / 86400n;
  const hours = (remainingTime % 86400n) / 3600n;
  const minutes = (remainingTime % 3600n) / 60n;
  const seconds = remainingTime % 60n;
  if (days > 0n) {
    return (
      <p className="text-sm font-bold">
        {days.toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })}
        d{" "}
        {hours.toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })}
        h{" "}
        {minutes.toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })}
        m{" "}
        {seconds.toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })}
        s
      </p>
    );
  }
  if (hours > 0n) {
    return (
      <p className="text-sm font-bold">
        {hours.toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })}
        h{" "}
        {minutes.toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })}
        m{" "}
        {seconds.toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })}
        s
      </p>
    );
  }
  if (minutes > 0n || seconds > 0n) {
    return (
      <p className="text-sm font-bold">
        {minutes.toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })}
        m{" "}
        {seconds.toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })}
        s
      </p>
    );
  }
  if (remainingTime === 0n) {
    setCheckEligibility(true);
  }
  return <p></p>;
};

type Props = {
  umi: Umi;
  guardList: GuardReturn[];
  candyMachine: CandyMachine | undefined;
  candyGuard: CandyGuard | undefined;
  ownedTokens: DigitalAssetWithToken[] | undefined;
  setGuardList: Dispatch<SetStateAction<GuardReturn[]>>;
  mintsCreated:
  | {
    mint: PublicKey;
    offChainMetadata: JsonMetadata | undefined;
  }[]
  | undefined;
  setMintsCreated: Dispatch<
    SetStateAction<
      | { mint: PublicKey; offChainMetadata: JsonMetadata | undefined }[]
      | undefined
    >
  >;
  onOpen: () => void;
  setCheckEligibility: Dispatch<SetStateAction<boolean>>;
};

export function ButtonList({
  umi,
  guardList,
  candyMachine,
  candyGuard,
  ownedTokens = [], // provide default empty array
  setGuardList,
  mintsCreated,
  setMintsCreated,
  onOpen,
  setCheckEligibility,
}: Props): React.JSX.Element {
  const solanaTime = useSolanaTime();
  if (!candyMachine || !candyGuard) {
    return <></>;
  }

  let filteredGuardlist = guardList.filter(
    (elem, index, self) =>
      index === self.findIndex((t) => t.label === elem.label)
  );

  if (filteredGuardlist.length === 0) {
    return <></>;
  }

  if (filteredGuardlist.length > 1) {
    filteredGuardlist = guardList.filter((elem) => elem.label !=="default");
  }
  console.log(`filteredGuardlist.length ${JSON.stringify(filteredGuardlist)}`);

  filteredGuardlist = filteredGuardlist.slice(-1); //additional add for showing the latest Mint

  let buttonGuardList: GuardButtonList[] = [];
  console.log(`guards`);
  for (const guard of filteredGuardlist) {
    const text = mintText.find((elem) => elem.label === guard.label);

    let buttonElement: GuardButtonList = {
      label: guard ? guard.label : "default",
      allowed: guard.allowed,
      header: text ? text.header : "header missing in settings.tsx",
      mintText: text ? text.mintText : "mintText missing in settings.tsx",
      buttonLabel: text ? text.buttonLabel : "buttonLabel missing in settings.tsx",
      startTime: 0n,
      endTime: 0n,
      tooltip: guard.reason,
      maxAmount: guard.maxAmount,
    };
    buttonGuardList.push(buttonElement);

    if (buttonElement.tooltip === 'Wallet does not exist. Do you have SOL?'){
      console.log(`guard ${JSON.stringify(guard)}`);
    }
  }

  const listItems = buttonGuardList.map((buttonGuard, index) => (
    <div key={index} className="mr-5">
      <div className="flex justify-end mr-auto">
        {buttonGuard.endTime > createBigInt(0) &&
          buttonGuard.endTime - solanaTime > createBigInt(0) &&
          (!buttonGuard.startTime ||
            buttonGuard.startTime - solanaTime <= createBigInt(0)) && (
            <>
              <p className="text-sm mr-1">
                Ending in:{" "}
              </p>
              <Timer
                toTime={buttonGuard.endTime}
                solanaTime={solanaTime}
                setCheckEligibility={setCheckEligibility}
              />
            </>
          )}
        {buttonGuard.startTime > createBigInt(0) &&
          buttonGuard.startTime - solanaTime > createBigInt(0) &&
          (!buttonGuard.endTime ||
            solanaTime - buttonGuard.endTime <= createBigInt(0)) && (
            <>
              <p className="text-sm mr-1">
                Starting in:{" "}
              </p>
              <Timer
                toTime={buttonGuard.startTime}
                solanaTime={solanaTime}
                setCheckEligibility={setCheckEligibility}
              />
            </>
          )}
      </div>

      <div>
        <p>{buttonGuard.tooltip}</p>
        <button
          className="justify-center items-center inline-flex hover:scale-105 transition-transform duration-200"
          disabled={!buttonGuard.allowed}
          onClick={() =>
            mintClick(
              umi,
              buttonGuard,
              candyMachine,
              candyGuard,
              ownedTokens,
              mintsCreated,
              setMintsCreated,
              guardList,
              setGuardList,
              onOpen,
              setCheckEligibility
            )
          }
          style={{ cursor: buttonGuard.allowed ? 'pointer' : 'not-allowed' }}
        >
          <div
            className={`h-[90px] w-[270px] bg-[#FFDC62] rounded-full border border-[#E59E69] justify-center items-center inline-flex shadow-[0px_4px_4px_0px_#FFFBEF_inset,0px_-4px_4px_0px_rgba(255,249,228,0.48),0px_5px_4px_0px_rgba(232,140,72,0.48)] ${buttonGuard.allowed ? 'hover:bg-[#FFB23F] hover:pl-[24px] hover:pr-[20px] hover:border-1 hover:border-[#E59E69] hover:shadow-[0px_4px_4px_0px_rgba(255,210,143,0.61)_inset,0px_4px_4px_0px_rgba(136,136,136,0.48)]' : 'opacity-50'}`}
          >
            <div
              className="text-center text-white text-3xl font-normal"
              style={{
                textShadow: "0px 2px 0.6px rgba(240, 139, 0, 0.66)",
              }}
            >
              <span className="hover:text-shadow-none">
                Mint Now
              </span>
            </div>
          </div>
        </button>
      </div>
    </div>
  ));

  return <>{listItems}</>;
}
