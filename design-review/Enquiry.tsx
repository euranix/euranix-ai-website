import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  submitFixture,
  type Enquiry as EnquiryData,
  type Fixture,
} from "./adapter";
const services = [
  "Not sure — help me choose",
  "Managed IT and Cloud",
  "Cybersecurity and Resilience",
  "Business Applications",
  "Custom Software Engineering",
  "Managed AI",
  "Websites and Digital Growth",
  "Managed Operations and Customer Experience",
];
export default function Enquiry({ ai }: { ai: boolean }) {
  const requested = new URLSearchParams(location.search).get("service");
  const reviewRequested =
    requested === "Technology review" ||
    new URLSearchParams(location.search).get("intent") === "technology-review";
  const [data, setData] = useState<EnquiryData>({
    intent: reviewRequested ? "technology-review" : "general",
    contactPreference: "",
    preferredContactTime: "",
    name: "",
    email: "",
    company: "",
    service: services.includes(requested || "")
      ? requested!
      : "Not sure — help me choose",
    message: "",
    marketing: false,
  });
  const [fixture, setFixture] = useState<Fixture>("unavailable");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "failure"
  >("idle");
  const [failure, setFailure] = useState("");
  const summary = useRef<HTMLDivElement>(null);
  const active = useRef<AbortController | null>(null);
  useEffect(() => () => active.current?.abort(), []);
  useEffect(() => {
    if (Object.keys(errors).length) summary.current?.focus();
  }, [errors]);
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (active.current) return;
    const next: Record<string, string> = {};
    if (!data.name.trim()) next.name = "Enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()))
      next.email = "Enter a valid email address.";
    if (data.message.trim().length < 20)
      next.message = "Add at least 20 characters about what you need.";
    setErrors(next);
    if (Object.keys(next).length) {
      setStatus("idle");
      return;
    }
    const controller = new AbortController();
    active.current = controller;
    setStatus("loading");
    try {
      await submitFixture(fixture, controller.signal);
      setStatus("success");
    } catch (error) {
      if (!controller.signal.aborted) {
        setFailure(
          error instanceof Error
            ? error.message
            : "Something interrupted the test. Please retry.",
        );
        setStatus("failure");
      }
    } finally {
      active.current = null;
    }
  }
  function field(
    key: "name" | "email" | "company" | "message" | "preferredContactTime",
    label: string,
    multiline = false,
  ) {
    const props = {
      id: key,
      name: key,
      value: data[key],
      maxLength: key === "message" ? 3000 : 200,
      "aria-invalid": !!errors[key],
      "aria-describedby": errors[key] ? key + "-error" : undefined,
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => setData({ ...data, [key]: e.target.value }),
    };
    return (
      <div className={"field " + (multiline ? "wide" : "")}>
        <label htmlFor={key}>{label}</label>
        {multiline ? (
          <textarea {...props} rows={5} required />
        ) : (
          <input
            {...props}
            type={key === "email" ? "email" : "text"}
            autoComplete={
              key === "name"
                ? "name"
                : key === "email"
                  ? "email"
                  : key === "company"
                    ? "organization"
                    : "off"
            }
            required={key === "name" || key === "email"}
          />
        )}
        {errors[key] && (
          <span className="field-error" id={key + "-error"}>
            {errors[key]}
          </span>
        )}
      </div>
    );
  }
  return (
    <section className="shell enquiry-layout">
      <div className="enquiry-intro">
        <p className="eyebrow">
          {data.intent === "technology-review"
            ? "Technology-review request"
            : "Start a conversation"}
        </p>
        <h1>
          {data.intent === "technology-review"
            ? "Request a review."
            : "Let’s talk."}
        </h1>
        <p className="lede">
          {data.intent === "technology-review"
            ? "Tell us about your current setup. We’ll confirm the meeting scope and time with you by email."
            : ai
              ? "Tell us what you’d like AI to help with, or ask us to help you choose a starting point."
              : "Tell us what you need help with. It’s fine if you’re still working out where to start."}
        </p>
      </div>
      <div className="form-panel">
        <p className="fixture-label">DESIGN REVIEW · TEST FORM ONLY</p>
        <p id="test-notice">
          Use sample details. Nothing is sent or saved. For a real enquiry,
          email <a href="mailto:contact@euranix.com">contact@euranix.com</a>.
        </p>
        <form
          onSubmit={submit}
          noValidate
          aria-describedby="test-notice"
          aria-busy={status === "loading"}
        >
          {!!Object.keys(errors).length && (
            <div
              className="error-summary"
              ref={summary}
              tabIndex={-1}
              role="alert"
            >
              <strong>Please check these details</strong>
              <ul>
                {Object.entries(errors).map(([key, value]) => (
                  <li key={key}>
                    <a
                      href={"#" + key}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(key)?.focus();
                      }}
                    >
                      {value}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <fieldset disabled={status === "loading"}>
            <legend className="sr-only">Your enquiry details</legend>
            <div className="field request-type">
              <label htmlFor="intent">What would you like to do?</label>
              <select
                id="intent"
                value={data.intent}
                onChange={(e) =>
                  setData({
                    ...data,
                    intent: e.target.value as EnquiryData["intent"],
                  })
                }
              >
                <option value="general">Make a general enquiry</option>
                <option value="technology-review">
                  Request a technology review
                </option>
              </select>
              {data.intent === "technology-review" && (
                <p className="small request-context">
                  One hour, free for a limited period. Future standard fee:
                  US$199. We’ll confirm a time with you; this is not an
                  appointment booking.
                </p>
              )}
            </div>
            <div className="form-grid">
              {field("name", "Name (required)")}
              {field("email", "Work email (required)")}
              {field("company", "Business name (optional)")}
              <div className="field">
                <label htmlFor="service">Which service interests you?</label>
                <select
                  id="service"
                  value={data.service}
                  onChange={(e) =>
                    setData({ ...data, service: e.target.value })
                  }
                >
                  {services.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              {field(
                "message",
                "What would you like help with? (required)",
                true,
              )}
            </div>
            <p className="small muted">
              Please don’t include passwords, access keys, sensitive records or
              customer data.
            </p>
            <details className="contact-preferences">
              <summary>Contact preferences (optional)</summary>
              <div className="field">
                <label htmlFor="contactPreference">
                  How would you prefer to follow up?
                </label>
                <select
                  id="contactPreference"
                  value={data.contactPreference}
                  onChange={(e) =>
                    setData({ ...data, contactPreference: e.target.value })
                  }
                >
                  <option value="">No preference</option>
                  <option value="email">Email</option>
                  <option value="conversation">
                    Arrange a conversation by email
                  </option>
                </select>
              </div>
              {field(
                "preferredContactTime",
                "Preferred time and time zone (optional)",
              )}
              <p className="small muted">
                We’ll confirm availability by email. A preference does not
                reserve a time.
              </p>
            </details>
            <label className="check">
              <input
                type="checkbox"
                checked={data.marketing}
                onChange={(e) =>
                  setData({ ...data, marketing: e.target.checked })
                }
              />
              <span>
                Optional: I’d like to receive Euranix news and service updates.
                This is separate from my enquiry.
              </span>
            </label>
            <p className="small">
              Read the{" "}
              <a href="https://www.euranix.com/privacy">
                Euranix privacy policy
              </a>
              .
            </p>
            <details className="fixture-controls" open>
              <summary>Review controls · simulated outcomes</summary>
              <label htmlFor="fixture">Test response</label>
              <select
                id="fixture"
                value={fixture}
                onChange={(e) => {
                  setFixture(e.target.value as Fixture);
                  setStatus("idle");
                }}
              >
                <option value="unavailable">Hub unavailable (default)</option>
                <option value="success">
                  Simulated success — no submission
                </option>
                <option value="failure">Recoverable connection failure</option>
              </select>
            </details>
            <button className="btn primary" type="submit">
              Test enquiry <span aria-hidden="true">↗</span>
            </button>
          </fieldset>
          <div className="form-status" aria-live="polite" aria-atomic="true">
            {status === "loading" && (
              <p>Testing the selected response… No data is being sent.</p>
            )}
            {status === "success" && (
              <div className="success">
                <strong>Test complete — nothing was sent.</strong>
                <p>
                  This is a simulated success state. No enquiry or appointment
                  has been created.
                </p>
                <button
                  type="button"
                  className="text-button"
                  onClick={() => setStatus("idle")}
                >
                  Return to test form
                </button>
              </div>
            )}
          </div>
          {status === "failure" && (
            <div role="alert" className="error-summary">
              <strong>The test did not complete</strong>
              <p>{failure}</p>
              <button
                className="text-button"
                type="button"
                onClick={() => {
                  setStatus("idle");
                  document.getElementById("fixture")?.focus();
                }}
              >
                Review response and retry
              </button>
            </div>
          )}
        </form>
      </div>
      <aside
        className="enquiry-support"
        aria-label="Contact and request details"
      >
        {data.intent === "technology-review" && (
          <div className="review-offer">
            <span className="eyebrow">Your technology review</span>
            <h2>
              One hour.
              <br />A clearer direction.
            </h2>
            <p>
              Talk through your systems, subscriptions and operational
              priorities. We’ll discuss gaps and useful next steps.
            </p>
            <p>
              <strong>Free for a limited period.</strong>
              <br />
              Future standard fee: US$199.
            </p>
            <small>
              We’ll agree a meeting time with you. A request is not a confirmed
              appointment, and there is no automatic billing.
            </small>
          </div>
        )}
        <h2>Prefer email?</h2>
        <a href="mailto:contact@euranix.com">contact@euranix.com ↗</a>
        <p className="small muted">
          Human support follows the working hours agreed with each customer.
        </p>
      </aside>
    </section>
  );
}
