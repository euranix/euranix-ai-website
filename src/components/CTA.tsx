import { enquiry } from "../site";
export default function CTA({
  ai = false,
  software = false,
}: {
  ai?: boolean;
  software?: boolean;
}) {
  return (
    <section className="cta shell">
      <div>
        <p className="eyebrow">A useful next step</p>
        <h2>
          {software
            ? "Let’s shape the software your business needs."
            : ai
              ? "Start with one question your business needs answered."
              : "Let’s work out what your business needs next."}
        </h2>
        <p>
          {software
            ? "Tell us about your workflow, existing tools and the capability you need to build."
            : ai
              ? "Bring a use case. We’ll discuss the information, access and operating model it needs."
              : "Request a one-hour technology review. Free for a limited period; future standard fee US$199."}
        </p>
      </div>
      <a
        className="btn primary"
        href={enquiry(
          software
            ? "Custom Software Engineering"
            : ai
              ? "Managed AI"
              : "Technology review",
        )}
      >
        {software
          ? "Discuss your software project"
          : ai
            ? "Discuss your AI use case"
            : "Request a technology review"}{" "}
        ↗
      </a>
    </section>
  );
}
