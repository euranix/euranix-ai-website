import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  submitFixture,
  type Enquiry as EnquiryData,
  type Fixture,
} from "./adapter";
const services = [
  "Technology review",
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
  const [data, setData] = useState<EnquiryData>({
    name: "",
    email: "",
    company: "",
    service: services.includes(requested || "")
      ? requested!
      : ai
        ? "Managed AI"
        : "Technology review",
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
    key: "name" | "email" | "company" | "message",
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
                  : "organization"
            }
            required={key !== "company"}
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
      <div>
        <p className="eyebrow">Start a conversation</p>
        <h1>
          What needs to
          <br />
          work better?
        </h1>
        <p className="lede">
          Tell us about the work, the tools you use and where you need help.
          We’ll agree a useful next step with you.
        </p>
        <div className="review-offer">
          <span className="eyebrow">A useful place to start</span>
          <h2>
            One hour.
            <br />A clearer direction.
          </h2>
          <p>
            A technology review of your current systems, subscriptions and
            operational priorities. We’ll discuss the gaps and possible next
            steps.
          </p>
          <p>
            <strong>Free for a limited period.</strong>
            <br />
            Future standard fee: US$199.
          </p>
          <small>
            No promotion end date is set. A review request is not a confirmed
            appointment. There is no automatic billing.
          </small>
        </div>
        <p>
          Prefer to write to us directly?
          <br />
          <a href="mailto:contact@euranix.com">contact@euranix.com ↗</a>
        </p>
        <p className="muted">
          Human support is delivered during the working hours agreed with each
          customer.
        </p>
      </div>
      <div className="form-panel">
        <p className="fixture-label">DESIGN REVIEW · TEST FORM ONLY</p>
        <p id="test-notice">
          Use sample details. This preview sends no enquiries and stores no form
          data. For a real enquiry, use the email link.
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
            <div className="form-grid">
              {field("name", "Name (required)")}
              {field("email", "Work email (required)")}
              {field("company", "Business name (optional)")}
              <div className="field">
                <label htmlFor="service">I’m interested in</label>
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
              . The final enquiry data flow and retention details will be
              reviewed before launch.
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
    </section>
  );
}
