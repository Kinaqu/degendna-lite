import { demoRadarTokens } from "./demoRadar";

export function getDemoToken(address?: string) {
  return (
    demoRadarTokens.find(
      (token) => token.address.toLowerCase() === address?.toLowerCase(),
    ) || demoRadarTokens[0]
  );
}
