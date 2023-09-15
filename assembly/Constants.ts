import { Base58 } from "@koinos/sdk-as";

export namespace Constants {
  export const NAME: string = "Bitkoin NFT";
  export const SYMBOL: string = "BTK";
  export const MINT_PRICE: u64 = 0;
  export const MINT_FEE: bool = false;
  export const MAX_SUPPLY: u64 = 220;
  export const URI: string = "https://bafybeielx6riyeotunzir6himipmt4vxafko3vjk5oa6swxfpgqdwzt4bu.ipfs.nftstorage.link/";
  export const OWNER: Uint8Array = Base58.decode("17H1HS7SHR76JpqhpkRVgfEQHanq9vh8rF");
  
  export const BTK_ADDRESS: Uint8Array = Base58.decode("1F81UPvBW4g2jFLU5VuBvoPeZFFHL5fPqQ");
  export const STANDARD_BTK_VALUE: u64 = 5000000000000;
  export const LARGE_BTK_VALUE: u64 = 25000000000000;
  export const MAX_LARGE_BTK_SUPPLY: u64 = 50;

  // token mint
  export const TOKEN_PAY: Uint8Array = Base58.decode("");
  export const ADDRESS_PAY: Uint8Array = Base58.decode("");
}
