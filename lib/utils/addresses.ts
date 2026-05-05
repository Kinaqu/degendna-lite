export function shortAddress(address?: string, chars = 4) {
  if (!address) return "0x0000...0000";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function isEvmAddress(address?: string) {
  return Boolean(address?.match(/^0x[a-fA-F0-9]{40}$/));
}
