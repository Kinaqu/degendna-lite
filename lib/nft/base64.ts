export function toBase64(input: string) {
  if (typeof window === "undefined") return Buffer.from(input, "utf8").toString("base64");
  return window.btoa(unescape(encodeURIComponent(input)));
}

export function fromBase64(input: string) {
  if (typeof window === "undefined") return Buffer.from(input, "base64").toString("utf8");
  return decodeURIComponent(escape(window.atob(input)));
}
