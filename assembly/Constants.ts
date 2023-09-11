import { Base58 } from "@koinos/sdk-as";

export namespace Constants {
  export const NAME: string = "Bitkoin NFT";
  export const SYMBOL: string = "BTK";
  export const MINT_PRICE: u64 = 0;
  export const MINT_FEE: bool = false;
  export const MAX_SUPPLY: u64 = 10;
  export const URI: string = "https://bafybeiaiw3amn4wgyavmppxhgvlhebdpwgmxluuiwp57rat7v2qzda7ssm.ipfs.nftstorage.link/";
  export const OWNER: Uint8Array = Base58.decode("1JGLmE1BbZCZ6xcM2yHJ5tMBnrEQb3eTJA");
  
  export const BTK_ADDRESS: Uint8Array = Base58.decode("16QqxFiift3FhBBaNCJiGoZUivx44Seqxe");
  export const STANDARD_BTK_VALUE: u64 = 5000000000000;
  export const LARGE_BTK_VALUE: u64 = 25000000000000;
  export const MAX_LARGE_BTK_SUPPLY: u64 = 3;

  // token mint
  export const TOKEN_PAY: Uint8Array = Base58.decode("");
  export const ADDRESS_PAY: Uint8Array = Base58.decode("");
}
