import React, { createContext, useContext, useEffect, useState } from "react";
import { getSolanaTime } from "./checkerHelper.ts";
import { useUmi } from "../web3/useUmi.ts";

type SolanaTimeContextType = {
  solanaTime: bigint;
};

const SolanaTimeContext = createContext<SolanaTimeContextType>({
  solanaTime: 0n,
});

export const useSolanaTime = () => useContext(SolanaTimeContext).solanaTime;

export const SolanaTimeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const umi = useUmi();
  const [solanaTime, setSolanaTime] = useState(0n);

  useEffect(() => {
    const fetchSolanaTime = async () => {
      const tempSolanaTime = await getSolanaTime(umi);
      setSolanaTime(tempSolanaTime);
    };
    fetchSolanaTime();
  }, [umi]);

  return (
    <SolanaTimeContext.Provider value={{ solanaTime }}>
      {children}
    </SolanaTimeContext.Provider>
  );
};