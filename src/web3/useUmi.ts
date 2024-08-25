import type { Umi } from "@metaplex-foundation/umi";
import { createContext, useContext } from "react";

type _UmiContext = {
  umi: Umi | null;
};

const DEFAULT_CONTEXT: _UmiContext = {
  umi: null,
};

export const UmiContext = createContext<_UmiContext>(DEFAULT_CONTEXT);

export function useUmi(): Umi {
  const umi = useContext(UmiContext).umi;
  if (!umi) {
    throw new Error(
      "Umi context was not initialized. " +
        "Did you forget to wrap your app with <UmiProvider />?"
    );
  }
  return umi;
}
