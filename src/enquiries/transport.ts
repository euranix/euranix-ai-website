// Hub contract v1, implemented at 778e1e1a4319d76efdef00413667925e34390ba1.
// This adapter never treats HTTP success alone as durable acceptance.
export type EnquiryType =
  "general_sales" | "service_enquiry" | "ai_demo" | "technology_review_1h";
export type Payload = {
  name: string;
  email: string;
  company?: string;
  message: string;
  enquiry_type: EnquiryType;
  service_interests: string[];
  preferred_contact_method?: "email" | "phone" | "whatsapp";
  phone?: string;
  whatsapp?: string;
  timezone?: string;
  contact_window?: { days: string[]; start: string; end: string };
  source_website: "euranix_com" | "euranix_ai";
  source_page: string;
  privacy_acknowledged: true;
  privacy_notice_version: string;
  marketing_consent: boolean;
  campaign?: Record<string, string>;
};
export type Receipt = { receipt_id: string; status: "accepted" };
export class IntakeError extends Error {
  constructor(
    public code: string,
    message: string,
    public retryAt = 0,
    public fields: string[] = [],
    public uncertain = false,
  ) {
    super(message);
  }
}
export const messages: Record<number, string> = {
  400: "The request could not be read. Please check the details or contact us by email.",
  403: "Verification could not be completed. Complete the security check again before retrying.",
  404: "The online enquiry service is unavailable. Please email contact@euranix.com.",
  405: "The online enquiry service is unavailable. Please email contact@euranix.com.",
  409: "This request conflicts with an earlier submission. Please email us before sending it again.",
  413: "The enquiry is too large. Shorten the message and try again.",
  415: "The online enquiry service could not read this request. Please email us.",
  422: "Please check the highlighted details.",
  429: "Please wait before trying again. Your details are still here.",
  503: "The enquiry service is temporarily unavailable. Keep these details and retry after the wait, or email us.",
};
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function retryTime(value: string | null, now = Date.now()): number {
  if (!value) return 0;
  const seconds = Number(value);
  const time =
    Number.isFinite(seconds) && seconds >= 0
      ? now + seconds * 1000
      : Date.parse(value);
  return Number.isFinite(time) ? Math.max(now, time) : 0;
}
export class EnquirySession {
  private fingerprint = "";
  private key = "";
  private inFlight = false;
  async submit(
    endpoint: string,
    payload: Payload,
    token: string,
    signal?: AbortSignal,
  ): Promise<Receipt> {
    if (this.inFlight)
      throw new IntakeError(
        "in_progress",
        "Please wait for the current request.",
      );
    if (!endpoint || !token)
      throw new IntakeError(
        "unavailable",
        "Online enquiries are unavailable. Please email contact@euranix.com.",
      );
    const business = JSON.stringify(payload);
    if (business !== this.fingerprint) {
      this.fingerprint = business;
      this.key = crypto.randomUUID();
    }
    const controller = new AbortController();
    const abort = () => controller.abort();
    signal?.addEventListener("abort", abort, { once: true });
    const timer = setTimeout(abort, 15000);
    this.inFlight = true;
    try {
      if (signal?.aborted) controller.abort();
      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "omit",
        cache: "no-store",
        redirect: "error",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Idempotency-Key": this.key,
        },
        body: JSON.stringify({ ...payload, bot_token: token }),
        signal: controller.signal,
      });
      let body;
      try {
        body = await response.json();
      } catch {
        throw new IntakeError(
          "unreadable",
          "We could not confirm receipt. Keep the same details and retry, or email us.",
          retryTime(response.headers.get("Retry-After")),
          [],
          true,
        );
      }
      if (
        (response.status === 200 || response.status === 201) &&
        body?.data?.status === "accepted" &&
        typeof body.data.receipt_id === "string" &&
        uuid.test(body.data.receipt_id) &&
        typeof body.request_id === "string" &&
        uuid.test(body.request_id)
      ) {
        return { receipt_id: body.data.receipt_id, status: "accepted" };
      }
      const fields =
        body?.error?.fields && typeof body.error.fields === "object"
          ? Object.keys(body.error.fields)
          : [];
      throw new IntakeError(
        "http_" + response.status,
        messages[response.status] ||
          "We could not confirm receipt. Keep the same details and retry, or email us.",
        retryTime(response.headers.get("Retry-After")),
        fields,
        response.status >= 500 || response.ok,
      );
    } catch (error) {
      if (error instanceof IntakeError) throw error;
      throw new IntakeError(
        controller.signal.aborted ? "timeout" : "network",
        "We could not confirm receipt. Your details are still here. Retry the same enquiry or email us; avoid starting a second request.",
        0,
        [],
        true,
      );
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener("abort", abort);
      this.inFlight = false;
    }
  }
}
