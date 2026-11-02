import { AI } from "./site";
import { services } from "./data/services";
export type PageMeta = {
  path: string;
  title: string;
  description: string;
  noindex?: boolean;
};
const company: PageMeta[] = [
  {
    path: "/",
    title: "Technology and operations for small businesses | Euranix",
    description:
      "Choose, build, secure and manage the technology and operations your business relies on. Seven service areas, with clear ownership and ongoing care.",
  },
  {
    path: "/services",
    title: "Technology and operations services | Euranix",
    description:
      "Explore managed IT, cybersecurity, business applications, custom software, managed AI, websites and managed operations with Euranix.",
  },
  ...services.map((s) => ({
    path: "/services/" + s.id,
    title: s.title + " | Euranix",
    description: s.summary + " Discuss scope, delivery and ongoing care with Euranix.",
  })),
  {
    path: "/about",
    title: "About Euranix | An accountable technology partner",
    description:
      "Meet Euranix Technologies Private Limited and our approach to useful engineering, security, clear decisions and ongoing responsibility.",
  },
  {
    path: "/products",
    title: "Euranix products | Software with ongoing care",
    description:
      "Explore Euranix Hub, CollectPro, EuraFinX, Euranix Storage, EuraSplit and Euranix AI. Discuss product fit, implementation and support.",
  },
  {
    path: "/studio",
    title: "Euranix design studio | The phoenix",
    description:
      "Explore the Euranix phoenix and the engineering principles behind our software, applied AI and managed infrastructure.",
    noindex: true,
  },
  {
    path: "/privacy",
    title: "Privacy Policy | Euranix",
    description:
      "How Euranix handles personal information across its websites, applications, integrations and services.",
  },
  {
    path: "/terms",
    title: "Terms of Service | Euranix",
    description:
      "General terms for Euranix websites, applications and services, with links to product-specific terms.",
  },
  {
    path: "/data-deletion",
    title: "Data Deletion Instructions | Euranix",
    description:
      "How to request deletion of personal information held by Euranix and find product-specific deletion instructions.",
  },
  {
    path: "/euranix-hub/privacy",
    title: "Euranix Hub Privacy Notice",
    description:
      "Product-specific information about personal data and processing in Euranix Hub.",
  },
  {
    path: "/euranix-hub/terms",
    title: "Euranix Hub Terms of Service",
    description:
      "Product-specific terms governing access to and use of Euranix Hub.",
  },
  {
    path: "/euranix-hub/data-deletion",
    title: "Euranix Hub Data Deletion Instructions",
    description:
      "How to request deletion of information associated with Euranix Hub.",
  },
];
const ai: PageMeta[] = [
  {
    path: "/",
    title: "Managed business AI | Euranix AI",
    description:
      "Knowledge, customer support and business information assistants, with scoped data access, deployment and ongoing management by Euranix.",
  },
];
export const routes: PageMeta[] = [
  ...(AI ? ai : company),
  {
    path: "/contact",
    title:
      "Contact " +
      (AI ? "Euranix AI" : "Euranix") +
      " | Enquiries and service discussions",
    description:
      "Tell Euranix what you need help with. Discuss a service, request an AI demonstration or ask for help choosing a starting point.",
  },
  {
    path: "/technology-review",
    title: "One-hour technology review | Euranix" + (AI ? " AI" : ""),
    description:
      "Request a one-hour conversation about your systems and priorities. Free for a limited period; future standard fee US$199. Meeting time confirmed separately.",
  },
];
export const missing: PageMeta = {
  path: "/404",
  title: "Page not found | Euranix" + (AI ? " AI" : ""),
  description:
    "This page could not be found. Explore Euranix services or contact the team.",
  noindex: true,
};
export const metadataFor = (path: string) =>
  routes.find((r) => r.path === path) || missing;
