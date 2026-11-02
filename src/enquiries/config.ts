// All values here are PUBLIC build configuration, never server credentials.
const raw = import.meta.env.VITE_ENQUIRY_API_URL || "";
export const enquiryConfig = {
  endpoint: /^https:\/\/[^/?#]+\/api\/v1\/enquiries$/.test(raw) ? raw : "",
  siteKey: import.meta.env.VITE_TURNSTILE_SITE_KEY || "",
  privacyVersion: import.meta.env.VITE_ENQUIRY_PRIVACY_VERSION || "",
};
export const enquiriesEnabled = Boolean(
  import.meta.env.VITE_ENQUIRY_ENABLED === "true" &&
  enquiryConfig.endpoint &&
  enquiryConfig.siteKey &&
  enquiryConfig.privacyVersion,
);
// No approved campaign values were supplied. Do not copy arbitrary query values.
// Add business-approved, non-personal values here when campaign attribution is agreed.
export const campaignAllowlist: Record<string, readonly string[]> = {};
export function campaignFrom(search: string) {
  const query = new URLSearchParams(search);
  const result: Record<string, string> = {};
  for (const key of [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ]) {
    const value = query.get(key);
    if (
      value &&
      value.length <= 100 &&
      /^[a-zA-Z0-9 ._~:-]+$/.test(value) &&
      campaignAllowlist[key]?.includes(value)
    )
      result[key] = value;
  }
  return result;
}
