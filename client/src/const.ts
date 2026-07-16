export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Sends the visitor to our own login page. Call this from an event handler or
// effect at the moment you want to navigate, e.g. `onClick={() => startLogin()}`.
export const startLogin = () => {
  window.location.href = "/login";
};
