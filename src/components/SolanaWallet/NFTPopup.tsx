import { JsonMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey } from "@metaplex-foundation/umi";
import React from "react";

interface TraitProps {
  heading: string;
  description: string;
}

interface TraitsProps {
  metadata: JsonMetadata;
}
const Trait = ({ heading, description }: TraitProps) => {
  return (
    <div
      className="w-32 min-h-12 bg-slate-200 rounded-sm"
    >
      <div>
        <p className="text-sm">{heading}</p>
        <p className="text-sm mt-[-2rem] font-semibold">
          {description}
        </p>
      </div>
    </div>
  );
};

const Traits = ({ metadata }: TraitsProps) => {
  if (metadata === undefined || metadata.attributes === undefined) {
    return <></>;
  }

  //find all attributes with trait_type and value
  const traits = metadata.attributes.filter(
    (a) => a.trait_type !== undefined && a.value !== undefined
  );
  const traitList = traits.map((t) => (
    <Trait
      key={t.trait_type}
      heading={t.trait_type ?? ""}
      description={t.value ?? ""}
    />
  ));

  return (
    <>
      <div className="mr-4" />
      <div className="grid mr-4 grid-cols-3 grid-rows-3">
        {traitList}
      </div>
    </>
  );
};

export default function Card({
  metadata,
}: {
  metadata: JsonMetadata | undefined;
}) {
  // Get the images from the metadata if animation_url is present use this
  if (!metadata) {
    return <></>;
  }
  const image = metadata.animation_url ?? metadata.image;
  return (
    <div 
      className="relative w-full overflow-hidden">
      <div
        key={image}
        className="relative h-3 bg-center bg-no-repeat bg-cover"
        style={{
          backgroundImage: `url(${image})`
        }}
      />
      <p className="font-semibold mt-4">
        {metadata.name}
      </p>
      <p>{metadata.description}</p>
      <Traits metadata={metadata} />
    </div>
  );
}

type Props = {
  nfts:
    | { mint: PublicKey; offChainMetadata: JsonMetadata | undefined }[]
    | undefined;
};

export const NFTPopup = ({ nfts }: Props) => {
  if (nfts === undefined) {
    return <></>;
  }

  const cards = nfts.map((nft, index) => (
    <div key={nft.mint + "Accordion"}>
      <h2>
        <button
          disabled
          onClick={(e) => e.preventDefault()}>
          <span className="flex-1 text-left">
            {nft.offChainMetadata?.name}
          </span>
        </button>
      </h2>
      <div className="pb-4">
        <Card metadata={nft.offChainMetadata} key={nft.mint} />
      </div>
    </div>
  ));
  return (
    <div className="">
      {/*  defaultIndex={[0]} */}
      {cards}
    </div>
  );
};
