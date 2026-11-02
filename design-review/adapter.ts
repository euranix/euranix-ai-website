// Domain model only. This is NOT a proposed or final Hub wire schema.
export type Enquiry = {
  intent: "general" | "technology-review";
  contactPreference: string;
  preferredContactTime: string;
  name: string;
  email: string;
  company: string;
  service: string;
  message: string;
  marketing: boolean;
};
export type Receipt = { kind: "durably-accepted"; reference: string };
export interface HubTransport {
  submit(enquiry: Enquiry, signal: AbortSignal): Promise<Receipt>;
}
// Implement only against the final Hub contract: bot checks, validation, attribution,
// idempotency, timeout/retry semantics and durable acceptance must be agreed first.
export const hubTransport: HubTransport = {
  async submit() {
    throw new Error(
      "Online enquiries are not connected in this preview. Email contact@euranix.com to contact Euranix.",
    );
  },
};
export type Fixture = "unavailable" | "success" | "failure";
export async function submitFixture(
  fixture: Fixture,
  signal: AbortSignal,
): Promise<{ kind: "simulated" }> {
  if (
    import.meta.env.MODE !== "design-review" ||
    !["127.0.0.1", "localhost", "[::1]"].includes(location.hostname)
  ) {
    throw new Error(
      "Test fixtures are available only in the local design-review build.",
    );
  }
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, 900);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
  if (fixture === "unavailable")
    throw new Error(
      "Hub is not connected. Nothing was sent. You can email contact@euranix.com.",
    );
  if (fixture === "failure")
    throw new Error(
      "Test connection interrupted. Nothing was sent. Your entries are still here; choose the success fixture and retry.",
    );
  return { kind: "simulated" };
}
