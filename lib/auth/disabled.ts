/** Temporary bypass for UI tooling (e.g. Google Stitch). Set INVITHEM_DISABLE_AUTH=true */
export function isAuthDisabled(): boolean {
  return process.env.INVITHEM_DISABLE_AUTH === "true";
}
