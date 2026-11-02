import { useEffect, useRef, useState, type FormEvent } from "react";
import { AI } from "../site";
import { services } from "../data/services";
import {
  EnquirySession,
  IntakeError,
  type EnquiryType,
  type Payload,
  type Receipt,
} from "./transport";
import { enquiriesEnabled, enquiryConfig, campaignFrom } from "./config";
import Verification from "./Verification";
type FormData = {
  intent: EnquiryType;
  service: string;
  name: string;
  email: string;
  company: string;
  message: string;
  method: "email" | "phone" | "whatsapp";
  phone: string;
  whatsapp: string;
  window: boolean;
  days: string[];
  start: string;
  end: string;
  timezone: string;
  privacy: boolean;
  marketing: boolean;
};
const blank = (review: boolean): FormData => ({
  intent: review ? "technology_review_1h" : "general_sales",
  service: "",
  name: "",
  email: "",
  company: "",
  message: "",
  method: "email",
  phone: "",
  whatsapp: "",
  window: false,
  days: [],
  start: "",
  end: "",
  timezone: "",
  privacy: false,
  marketing: false,
});
const fieldNames: Record<string, string> = {
  name: "Name",
  email: "Work email",
  company: "Business name",
  message: "Message",
  phone: "Phone number",
  whatsapp: "WhatsApp number",
  timezone: "Time zone",
  privacy: "Privacy acknowledgement",
  contactWindow: "Contact window",
  verification: "Security check",
};
export default function Enquiry({
  review = false,
  path,
}: {
  review?: boolean;
  path: string;
}) {
  const [data, setData] = useState<FormData>(() => blank(review));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<
    "idle" | "sending" | "failed" | "accepted"
  >("idle");
  const [failure, setFailure] = useState<IntakeError>();
  const [receipt, setReceipt] = useState<Receipt>();
  const [token, setToken] = useState("");
  const [verificationReset, setVerificationReset] = useState(0);
  const [now, setNow] = useState(Date.now());
  const summary = useRef<HTMLDivElement>(null),
    result = useRef<HTMLDivElement>(null);
  const session = useRef(new EnquirySession());
  const active = useRef<AbortController | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const selected = params.get("service");
    const service =
      services.find((s) => s.id === selected || s.title === selected)?.id || "";
    const rawIntent = params.get("intent");
    const intent: EnquiryType =
      review ||
      selected === "Technology review" ||
      rawIntent === "technology-review" ||
      rawIntent === "technology_review_1h"
        ? "technology_review_1h"
        : rawIntent === "ai_demo"
          ? "ai_demo"
          : service
            ? "service_enquiry"
            : "general_sales";
    setData((d) => ({ ...d, service, intent }));
  }, [review]);
  useEffect(() => () => active.current?.abort(), []);
  useEffect(() => {
    if (Object.keys(errors).length) summary.current?.focus();
    else if (status === "failed" || status === "accepted")
      result.current?.focus();
  }, [errors, status]);
  useEffect(() => {
    if (!failure?.retryAt) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [failure]);
  const wait = Math.max(0, Math.ceil(((failure?.retryAt || 0) - now) / 1000));
  const isReview = data.intent === "technology_review_1h";
  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }
  function check() {
    const e: Record<string, string> = {};
    if (!data.name.trim()) e.name = "Enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()))
      e.email = "Enter a valid email address.";
    if (data.message.trim().length < 10)
      e.message = "Add at least 10 characters about what you need.";
    if (!data.privacy) e.privacy = "Acknowledge the privacy notice.";
    if (
      data.method !== "email" &&
      !/^\+[1-9][0-9]{7,14}$/.test(data[data.method].replace(/[ ()-]/g, ""))
    )
      e[data.method] =
        "Use an international number beginning with + and 8–15 digits.";
    if (data.window) {
      if (
        !data.days.length ||
        !data.start ||
        !data.end ||
        data.end <= data.start
      )
        e.contactWindow =
          "Choose at least one day and an end time later than the start on the same day.";
      try {
        if (!data.timezone) throw Error();
        new Intl.DateTimeFormat("en", { timeZone: data.timezone });
      } catch {
        e.timezone = "Enter a valid IANA time zone, such as Asia/Kolkata.";
      }
    }
    if (enquiriesEnabled && !token)
      e.verification = "Complete the security check.";
    return e;
  }
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (active.current || wait || status === "accepted") return;
    const next = check();
    setErrors(next);
    if (Object.keys(next).length) return;
    if (!enquiriesEnabled) {
      setFailure(
        new IntakeError(
          "disabled",
          "The online form is unavailable. Email contact@euranix.com.",
        ),
      );
      setStatus("failed");
      return;
    }
    const campaign = campaignFrom(location.search);
    const payload: Payload = {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      company: data.company.trim(),
      message: data.message.trim(),
      enquiry_type:
        data.intent === "general_sales" && data.service
          ? "service_enquiry"
          : data.intent,
      service_interests: data.service ? [data.service] : [],
      preferred_contact_method: data.method,
      ...(data.method !== "email"
        ? { [data.method]: data[data.method].replace(/[ ()-]/g, "") }
        : {}),
      ...(data.window
        ? {
            timezone: data.timezone,
            contact_window: {
              days: [...data.days].sort(),
              start: data.start,
              end: data.end,
            },
          }
        : {}),
      source_website: AI ? "euranix_ai" : "euranix_com",
      source_page: path,
      privacy_acknowledged: true,
      privacy_notice_version: enquiryConfig.privacyVersion,
      marketing_consent: data.marketing,
      ...(Object.keys(campaign).length ? { campaign } : {}),
    };
    const controller = new AbortController();
    active.current = controller;
    setStatus("sending");
    setFailure(undefined);
    try {
      const accepted = await session.current.submit(
        enquiryConfig.endpoint,
        payload,
        token,
        controller.signal,
      );
      if (!controller.signal.aborted) {
        setReceipt(accepted);
        setStatus("accepted");
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        const problem =
          error instanceof IntakeError
            ? error
            : new IntakeError(
                "unknown",
                "We could not confirm receipt. Please retry or email us.",
              );
        const next: Record<string, string> = {};
        for (const field of problem.fields) {
          const key =
            field === "privacy_acknowledged"
              ? "privacy"
              : field.startsWith("contact_window")
                ? "contactWindow"
                : field === "bot_token"
                  ? "verification"
                  : field;
          if (fieldNames[key])
            next[key] = "Please check " + fieldNames[key].toLowerCase() + ".";
        }
        setErrors(next);
        setFailure(problem);
        setNow(Date.now());
        setStatus("failed");
      }
    } finally {
      active.current = null;
      setToken("");
      setVerificationReset((x) => x + 1);
    }
  }
  function field(
    key:
      | "name"
      | "email"
      | "company"
      | "message"
      | "phone"
      | "whatsapp"
      | "timezone",
    label: string,
    required = false,
  ) {
    const props = {
      id: key,
      name: key,
      value: data[key],
      "aria-invalid": Boolean(errors[key]),
      "aria-describedby": errors[key] ? key + "-error" : undefined,
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => update(key, e.target.value),
      required,
    };
    return (
      <div className={"field " + (key === "message" ? "wide" : "")}>
        <label htmlFor={key}>{label}</label>
        {key === "message" ? (
          <textarea {...props} rows={5} maxLength={4000} />
        ) : (
          <input
            {...props}
            type={
              key === "email"
                ? "email"
                : key === "phone" || key === "whatsapp"
                  ? "tel"
                  : "text"
            }
            maxLength={
              key === "name"
                ? 120
                : key === "email"
                  ? 254
                  : key === "company"
                    ? 160
                    : key === "timezone"
                      ? 64
                      : 32
            }
            autoComplete={
              key === "name"
                ? "name"
                : key === "email"
                  ? "email"
                  : key === "company"
                    ? "organization"
                    : key === "phone"
                      ? "tel"
                      : "off"
            }
          />
        )}
        {errors[key] && (
          <span id={key + "-error"} className="field-error">
            {errors[key]}
          </span>
        )}
      </div>
    );
  }
  return (
    <>
      <section className="shell enquiry-layout">
        <div className="enquiry-intro">
          <p className="eyebrow">
            {isReview ? "Technology-review request" : "Start a conversation"}
          </p>
          <h1>
            {isReview
              ? "Request a review."
              : data.intent === "ai_demo"
                ? "Discuss your AI use case."
                : "Let’s talk."}
          </h1>
          <p className="lede">
            {isReview
              ? "Tell us about your current setup. We’ll confirm the meeting scope and time with you by email."
              : AI
                ? "Tell us what you’d like AI to help with, or ask us to help you choose a starting point."
                : "Tell us what you need help with. It’s fine if you’re still working out where to start."}
          </p>
        </div>
        <div className="form-panel">
          {!enquiriesEnabled ? (
            <section
              className="email-contact-panel"
              aria-labelledby="email-contact-heading"
            >
              <p className="eyebrow">Contact by email</p>
              <h2 id="email-contact-heading">We’re ready to hear from you.</h2>
              <p>
                Online enquiries are currently unavailable. Email us with a
                short description of what you need, and we’ll follow up.
              </p>
              <a className="btn primary" href="mailto:contact@euranix.com">
                Email contact@euranix.com <span aria-hidden="true">↗</span>
              </a>
              <p className="small muted">
                Please don’t include passwords, payment details or sensitive
                records. You can also copy the email address into your preferred
                email app.
              </p>
              <a
                className="enquiry-privacy-link"
                href="https://www.euranix.com/privacy#website-enquiries"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read the enquiry privacy notice (opens in a new tab)
              </a>
            </section>
          ) : (
            <>
              <noscript>
                <p>
                  Please enable JavaScript to use the form, or email{" "}
                  <a href="mailto:contact@euranix.com">contact@euranix.com</a>.
                </p>
              </noscript>
              <form
                onSubmit={submit}
                noValidate
                aria-busy={status === "sending"}
              >
                {Object.keys(errors).length > 0 && (
                  <div
                    className="error-summary"
                    tabIndex={-1}
                    ref={summary}
                    role="alert"
                  >
                    <strong>Please check these details</strong>
                    <ul>
                      {Object.entries(errors).map(([key, text]) => (
                        <li key={key}>
                          <a
                            href={"#" + key}
                            onClick={(e) => {
                              e.preventDefault();
                              document.getElementById(key)?.focus();
                            }}
                          >
                            {text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <fieldset
                  disabled={status === "sending" || status === "accepted"}
                >
                  <legend className="sr-only">Your enquiry details</legend>
                  <div className="field request-type">
                    <label htmlFor="intent">What would you like to do?</label>
                    <select
                      id="intent"
                      value={data.intent}
                      onChange={(e) =>
                        update("intent", e.target.value as EnquiryType)
                      }
                    >
                      <option value="general_sales">
                        Make a general enquiry
                      </option>
                      <option value="service_enquiry">Discuss a service</option>
                      <option value="ai_demo">
                        Request an AI demonstration
                      </option>
                      <option value="technology_review_1h">
                        Request a technology review
                      </option>
                    </select>
                    {isReview && (
                      <p className="small request-context">
                        One hour, free for a limited period. Future standard
                        fee: US$199. We’ll confirm a time with you; this is not
                        an appointment booking.
                      </p>
                    )}
                  </div>
                  <div className="form-grid">
                    {field("name", "Name (required)", true)}
                    {field("email", "Work email (required)", true)}
                    {field("company", "Business name (optional)")}
                    <div className="field">
                      <label htmlFor="service">
                        Which service interests you?
                      </label>
                      <select
                        id="service"
                        value={data.service}
                        onChange={(e) => update("service", e.target.value)}
                      >
                        <option value="">Not sure — help me choose</option>
                        {services.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.title}
                          </option>
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
                    Please don’t include passwords, access keys, sensitive
                    records or customer data.
                  </p>
                  <details className="contact-preferences">
                    <summary>Contact preferences (optional)</summary>
                    <div className="field">
                      <label htmlFor="method">
                        How would you prefer us to follow up?
                      </label>
                      <select
                        id="method"
                        value={data.method}
                        onChange={(e) =>
                          update("method", e.target.value as FormData["method"])
                        }
                      >
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                        <option value="whatsapp">WhatsApp</option>
                      </select>
                    </div>
                    {data.method === "phone" &&
                      field(
                        "phone",
                        "Your phone number (with country code)",
                        true,
                      )}
                    {data.method === "whatsapp" &&
                      field(
                        "whatsapp",
                        "Your WhatsApp number (with country code)",
                        true,
                      )}
                    <label className="check">
                      <input
                        type="checkbox"
                        checked={data.window}
                        onChange={(e) => update("window", e.target.checked)}
                      />
                      Suggest a contact window
                    </label>
                    {data.window && (
                      <div id="contactWindow" tabIndex={-1}>
                        <fieldset className="day-picker">
                          <legend>Preferred days</legend>
                          {[
                            "mon",
                            "tue",
                            "wed",
                            "thu",
                            "fri",
                            "sat",
                            "sun",
                          ].map((day) => (
                            <label key={day}>
                              <input
                                type="checkbox"
                                checked={data.days.includes(day)}
                                onChange={(e) =>
                                  update(
                                    "days",
                                    e.target.checked
                                      ? [...data.days, day]
                                      : data.days.filter((d) => d !== day),
                                  )
                                }
                              />
                              {day}
                            </label>
                          ))}
                        </fieldset>
                        <div className="form-grid">
                          <div className="field">
                            <label htmlFor="start">From</label>
                            <input
                              type="time"
                              id="start"
                              value={data.start}
                              onChange={(e) => update("start", e.target.value)}
                            />
                          </div>
                          <div className="field">
                            <label htmlFor="end">Until</label>
                            <input
                              type="time"
                              id="end"
                              value={data.end}
                              onChange={(e) => update("end", e.target.value)}
                            />
                          </div>
                        </div>
                        {field(
                          "timezone",
                          "Time zone (for example Asia/Kolkata)",
                          true,
                        )}
                        {errors.contactWindow && (
                          <p className="field-error">{errors.contactWindow}</p>
                        )}
                      </div>
                    )}
                    <p className="small muted">
                      We’ll confirm availability. A preference does not reserve
                      a time.
                    </p>
                  </details>
                  <label className="check">
                    <input
                      id="privacy"
                      type="checkbox"
                      required
                      checked={data.privacy}
                      aria-invalid={Boolean(errors.privacy)}
                      onChange={(e) => update("privacy", e.target.checked)}
                    />
                    <span>
                      I have read the{" "}
                      <a
                        className="enquiry-privacy-link"
                        href="https://www.euranix.com/privacy#website-enquiries"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Euranix website enquiry privacy notice (opens in a new tab)
                      </a>{" "}
                      and acknowledge how my enquiry details will be handled.
                      (Required)
                    </span>
                  </label>
                  <label className="check">
                    <input
                      id="marketing"
                      type="checkbox"
                      checked={data.marketing}
                      onChange={(e) => update("marketing", e.target.checked)}
                    />
                    Optional: I would like to receive marketing updates from Euranix.
                    I can withdraw this choice at any time.
                  </label>
                  {enquiriesEnabled && (
                    <div id="verification" tabIndex={-1}>
                      <Verification
                        siteKey={enquiryConfig.siteKey}
                        onToken={setToken}
                        reset={verificationReset}
                      />
                    </div>
                  )}
                  <button
                    className="btn primary submit"
                    type="submit"
                    disabled={
                      !enquiriesEnabled ||
                      status === "sending" ||
                      wait > 0 ||
                      failure?.code === "http_409"
                    }
                  >
                    {status === "sending"
                      ? "Sending…"
                      : wait
                        ? "Please wait " + wait + " seconds"
                        : status === "failed"
                          ? "Retry enquiry"
                          : "Send enquiry"}{" "}
                    <span aria-hidden="true">↗</span>
                  </button>
                </fieldset>
                {status === "failed" && failure && (
                  <div
                    ref={result}
                    tabIndex={-1}
                    role="alert"
                    className="error-summary"
                  >
                    <strong>Receipt has not been confirmed</strong>
                    <p>{failure.message}</p>
                    {failure.uncertain && (
                      <p className="small">
                        Retry without changing the details to check the same
                        request. Editing them starts a different enquiry. Keep
                        this page open while resolving the result.
                      </p>
                    )}
                    <a href="mailto:contact@euranix.com">
                      Contact us by email ↗
                    </a>
                  </div>
                )}
                {status === "accepted" && receipt && (
                  <div
                    className="success"
                    ref={result}
                    tabIndex={-1}
                    role="status"
                  >
                    <h2>Your enquiry has been received.</h2>
                    <p>
                      Reference:{" "}
                      <span className="receipt">{receipt.receipt_id}</span>
                    </p>
                    <p>
                      We’ll review your request and follow up. This does not
                      confirm an appointment or a payment.
                    </p>
                    <button
                      type="button"
                      className="text-button"
                      onClick={() => {
                        session.current = new EnquirySession();
                        setData(blank(false));
                        setReceipt(undefined);
                        setStatus("idle");
                        setFailure(undefined);
                      }}
                    >
                      Start another enquiry
                    </button>
                  </div>
                )}
              </form>
            </>
          )}
        </div>
        <aside
          className="enquiry-support"
          aria-label="Contact and request details"
        >
          {isReview && (
            <div className="review-offer">
              <p className="eyebrow">Your technology review</p>
              <h2>
                One hour.
                <br />A clearer direction.
              </h2>
              <p>
                Talk through your systems, subscriptions and operational
                priorities. We’ll discuss gaps, options and useful next steps.
              </p>
              <p>
                <strong>Free for a limited period.</strong>
                <br />
                Future standard fee: US$199.
              </p>
              <p className="small">
                We’ll agree a meeting time with you. A request is not a
                confirmed appointment, and there is no automatic billing.
              </p>
              <p className="small">
                Bring a list of tools and priorities. Please do not send
                credentials or sensitive customer records.
              </p>
            </div>
          )}
          <h2>Prefer email?</h2>
          <a href="mailto:contact@euranix.com">contact@euranix.com ↗</a>
          <p className="small muted">
            Human support follows the working hours agreed with each customer.
          </p>
          {!AI && (
            <>
              <h2>Our address</h2>
              <p className="small">
                The Pavilion, 62/63 Church Street
                <br />
                Bengaluru, Karnataka 560001, India
              </p>
              <a href="https://euranix.ai">Explore Euranix AI ↗</a>
            </>
          )}
        </aside>
      </section>
    </>
  );
}
