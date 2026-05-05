import { CONTRACT_ADDRESS } from "./config";
import { degenDnaAbi } from "./abi";

export const degenDnaContract = CONTRACT_ADDRESS
  ? {
      address: CONTRACT_ADDRESS,
      abi: degenDnaAbi,
    }
  : undefined;
