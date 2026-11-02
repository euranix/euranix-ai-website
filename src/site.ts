export const AI = true;
export const ORIGIN = "https://euranix.ai";
export const LOGO = "/brand-logo.png";
export const enquiry = (service = "General enquiry") =>
  service === "Technology review"
    ? "/technology-review"
    : "/contact?service=" +
      encodeURIComponent(service) +
      (service === "Managed AI" && AI ? "&intent=ai_demo" : "");
