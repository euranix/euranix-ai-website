import { useState } from "react";
const journeys = [
  {
    label: "A new enquiry",
    request: "“Can you help us connect our sales and invoicing?”",
    stages: [
      [
        "Capture",
        "Website → shared inbox",
        "Keep the request and contact details together.",
        "Website + business applications",
      ],
      [
        "Assign",
        "Shared inbox → named owner",
        "An assigned person clarifies the workflow and agrees the next action.",
        "Managed operations",
      ],
      [
        "Follow through",
        "Owner → customer",
        "Send the next step, record the conversation and keep the handover visible.",
        "Customer experience",
      ],
    ],
  },
  {
    label: "A support request",
    request: "“Our team can’t access the shared files.”",
    stages: [
      [
        "Capture",
        "Team member → support queue",
        "Record the affected service and what the team needs to do.",
        "Managed IT",
      ],
      [
        "Assign",
        "Support queue → service owner",
        "Check access and service health, and route the issue to the right person.",
        "Managed IT + security",
      ],
      [
        "Follow through",
        "Service owner → team",
        "Confirm access with the team and document the outcome.",
        "Managed operations",
      ],
    ],
  },
];
export function BusinessWorkflow() {
  const [journey, setJourney] = useState(0);
  const [step, setStep] = useState(0);
  const item = journeys[journey],
    stage = item.stages[step];
  return (
    <div className="workflow-demo">
      <p className="example-label">ILLUSTRATIVE EXAMPLE · SYNTHETIC REQUEST</p>
      <div className="workflow-heading">
        <h2>
          A clear owner. <br />A clear next step.
        </h2>
        <span className="workflow-symbol" aria-hidden="true">
          ↳
        </span>
      </div>
      <div className="segmented" aria-label="Example business workflow">
        {journeys.map((j, i) => (
          <button
            type="button"
            aria-pressed={journey === i}
            key={j.label}
            onClick={() => {
              setJourney(i);
              setStep(0);
            }}
          >
            {j.label}
          </button>
        ))}
      </div>
      <p className="request-note">{item.request}</p>
      <ol className="workflow-track" aria-label="Request journey">
        {item.stages.map(([label], i) => (
          <li key={label}>
            <button
              type="button"
              aria-pressed={step === i}
              onClick={() => setStep(i)}
            >
              <span className="step-node" aria-hidden="true">
                {i + 1}
              </span>
              {label}
            </button>
          </li>
        ))}
      </ol>
      <div className="workflow-result" aria-live="polite">
        <p className="eyebrow">{stage[1]}</p>
        <p>{stage[2]}</p>
        <span className="workflow-service">{stage[3]}</span>
      </div>
      <p className="demo-footnote">
        Step through the handovers. This example does not create a real request.
      </p>
    </div>
  );
}
const samples = [
  {
    label: "Business knowledge",
    q: "How do I request a purchase?",
    source: "Sample procurement guide · §2",
    excerpt:
      "Send the item, business reason and estimated cost to your team lead for review.",
    answer:
      "Complete a purchase request with the item, business reason and estimated cost. Your team lead reviews it before purchasing.",
    access: "Team member",
    fallback:
      "The sample guide does not specify an approval deadline. Ask the operations owner rather than relying on a guess.",
    owner: "Operations owner",
  },
  {
    label: "Customer support",
    q: "Can I change my delivery address?",
    source: "Sample care guide · Delivery",
    excerpt:
      "Address changes must be checked against the order status by the customer support team.",
    answer:
      "A customer support colleague needs to check the order status before confirming an address change.",
    access: "Customer",
    fallback:
      "This assistant cannot access orders in this demonstration. Ask the customer support team to check the request.",
    owner: "Customer support team",
  },
  {
    label: "Business information",
    q: "Which invoices need follow-up?",
    source: "Synthetic invoice records",
    excerpt:
      "Sample A: overdue. Sample B: overdue. Sample C: payment status unavailable.",
    answer:
      "Two fictional invoices are marked overdue. Check the underlying records before taking action.",
    access: "Accounts role",
    fallback:
      "Payment status is missing for one record. Verify it in the billing system before contacting the customer.",
    owner: "Accounts team",
  },
];
export function KnowledgeDemo() {
  const [sample, setSample] = useState(0);
  const [mode, setMode] = useState<
    "answer" | "missing" | "human" | "restricted"
  >("answer");
  const s = samples[sample];
  return (
    <div className="demo knowledge-demo">
      <p className="example-label">ILLUSTRATIVE EXAMPLE · SYNTHETIC DATA</p>
      <div className="segmented" aria-label="Sample use case">
        {samples.map((s, i) => (
          <button
            type="button"
            key={s.label}
            aria-pressed={sample === i}
            onClick={() => {
              setSample(i);
              setMode("answer");
            }}
          >
            {s.label}
          </button>
        ))}
      </div>
      <p className="demo-question">{s.q}</p>
      <div
        className="knowledge-flow"
        aria-label="How the sample answer is formed"
      >
        <span>01 / Source</span>
        <span aria-hidden="true">→</span>
        <span>02 / Access</span>
        <span aria-hidden="true">→</span>
        <span>03 / Response</span>
      </div>
      <div className="source-document">
        <div className="source-document-heading">
          <span aria-hidden="true">▤</span>
          <strong>
            {mode === "restricted" ? "Source withheld" : s.source}
          </strong>
        </div>
        <blockquote>
          {mode === "restricted"
            ? "This sample role cannot open the source. Its contents are withheld."
            : s.excerpt}
        </blockquote>
        <span className="access-label">
          {mode === "restricted"
            ? "Restricted role · access denied"
            : s.access + " · permitted source"}
        </span>
      </div>
      <div className="demo-response" aria-live="polite">
        <p className="eyebrow">
          Example response /{" "}
          {mode === "human"
            ? "handover"
            : mode === "restricted"
              ? "access denied"
              : mode === "missing"
                ? "information gap"
                : "source-backed answer"}
        </p>
        <p>
          {mode === "answer"
            ? s.answer
            : mode === "missing"
              ? s.fallback
              : mode === "restricted"
                ? "I can’t answer from a source this role cannot access. Ask the information owner about the access you need."
                : "Next step: " +
                  s.owner +
                  ". The question and relevant context go to a person during the agreed working hours. No handover is sent in this demo."}
        </p>
      </div>
      <div className="demo-actions" aria-label="Explore response boundaries">
        {(
          [
            ["answer", "Referenced answer"],
            ["missing", "Missing information"],
            ["restricted", "Restricted access"],
            ["human", "Human handover"],
          ] as const
        ).map(([value, label]) => (
          <button
            type="button"
            key={value}
            aria-pressed={mode === value}
            onClick={() => setMode(value)}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="demo-footnote">
        Synthetic sources and responses. No live AI, access check or message
        delivery.
      </p>
    </div>
  );
}
