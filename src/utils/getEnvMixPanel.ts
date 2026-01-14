/**
 * Retrieves the MixPanel environment variable from Vite's import.meta.env (frontend only).
 *
 * @returns {string} The MixPanel environment variable or an empty string if not found.
 */
const getEnvMixPanel = () => {
  const mixpanelProjectToken = import.meta.env.VITE_PUBLIC_MIXPANEL_PROJECT_TOKEN || "";
  if (!mixpanelProjectToken) {
    console.error("VITE_PUBLIC_MIXPANEL_PROJECT_TOKEN is not set");
  }
  return mixpanelProjectToken;
};

export { getEnvMixPanel };
