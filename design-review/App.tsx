import { useEffect, useRef, useState } from "react";
import Enquiry from "./Enquiry";
import { BusinessWorkflow, KnowledgeDemo } from "./WorkflowDemo";
import { AI, LOGO } from "./site";
import "./review.css";
import "./refinements.css";
const base = "/design-review";
const enquiry = (service = "General enquiry") =>
  base + "/enquiry?service=" + encodeURIComponent(service);
const verticals = [
  [
    "Managed IT and Cloud",
    "Keep your team’s everyday tools working.",
    "Domains, hosting, business email, Google Workspace or Microsoft 365, managed VPS, server patching and IT support. Agree the supported environments, responsibilities and hours.",
  ],
  [
    "Cybersecurity and Resilience",
    "Protect the work your business depends on.",
    "Endpoint and website security, password management, business VPN, SSL certificates and cloud backup. Define the controls, recovery requirements and response responsibilities for your environment.",
  ],
  [
    "Business Applications",
    "Connect the work between your tools.",
    "Selection, configuration, migration and management of CRM, invoicing, helpdesk, projects and collaboration tools. Start with the workflow; agree editions, licences, integrations and ongoing support.",
  ],
  [
    "Custom Software Engineering",
    "Build what your existing tools cannot do.",
    "Web and mobile applications, business workflows, APIs and integrations. Secure design, AI-assisted development with human review, meaningful testing and support after launch.",
  ],
  [
    "Managed AI",
    "Make your business knowledge easier to use.",
    "Knowledge assistants, customer support assistants and business information use cases. Agree the data sources, access boundaries, deployment and human escalation with Euranix AI.",
  ],
  [
    "Websites and Digital Growth",
    "Turn interest into a useful conversation.",
    "Website design and development, domains, hosting, business email and digital marketing. Scope creation, maintenance, content and campaigns separately, including any advertising spend.",
  ],
  [
    "Managed Operations and Customer Experience",
    "Give everyday work a clear owner.",
    "Dedicated or shared English-speaking resources, managed by Euranix on monthly subscriptions. Support for your operations and your end customers, with agreed hours, channels and capacity. Onboarding within a few days, subject to agreed requirements.",
  ],
];
function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [open]);
  const links = AI
    ? [
        [base + "#usecases", "Use cases"],
        [base + "#howitworks", "How it works"],
        [base + "#privacy", "Data & access"],
        [base + "#pricing", "Pricing"],
      ]
    : [
        [base + "#services", "Services"],
        [base + "#solutions", "Your business"],
        ["/products", "Products"],
        ["/about", "Our approach"],
      ];
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className="review-bar">
        <span>EURANIX / DESIGN REVIEW</span>
        <a href="/">View existing site ↗</a>
      </div>
      <header className="header shell">
        <a
          className="brand"
          href={base + "/"}
          aria-label={AI ? "Euranix AI preview home" : "Euranix preview home"}
        >
          <img src={LOGO} alt="Euranix" width="176" height="55" />
          {AI && <span className="ai-tag">AI</span>}
        </a>
        <button
          ref={toggle}
          className="menu-button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? "Close ×" : "Menu ☰"}
        </button>
        <nav
          id="navigation"
          className={open ? "nav open" : "nav"}
          aria-label="Main navigation"
        >
          {links.map(([url, label]) => (
            <a key={url} href={url} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
          <a
            className="nav-cross"
            href={AI ? "https://www.euranix.com" : "https://euranix.ai"}
          >
            {AI ? "Euranix.com" : "Euranix AI"} ↗
          </a>
          <a className="btn small-btn" href={enquiry()}>
            Let’s talk <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>
    </>
  );
}
function Footer() {
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer-top">
          <div>
            <img src={LOGO} alt="Euranix" width="176" height="55" />
            <p>
              Technology and operations.
              <br />
              With someone accountable.
            </p>
          </div>
          <div>
            <span className="eyebrow">Start a conversation</span>
            <a className="footer-email" href="mailto:contact@euranix.com">
              contact@euranix.com ↗
            </a>
            <p>
              <a href={AI ? "https://www.euranix.com" : "https://euranix.ai"}>
                {AI ? "Explore the Euranix portfolio" : "Explore Euranix AI"} ↗
              </a>
            </p>
          </div>
          <div className="footer-utilities">
            <a href="https://portal.euranix.com">Client portal ↗</a>
            <a href="https://www.euranixcloud.com">Cloud portal ↗</a>
            {AI && <a href="https://platform.euranix.ai">AI platform ↗</a>}
            <a href="/">Existing website ↗</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Euranix Technologies Private Limited.</span>
          <div>
            <a href={AI ? "https://www.euranix.com/privacy" : "/privacy"}>
              Privacy
            </a>
            <a href={AI ? "https://www.euranix.com/terms" : "/terms"}>Terms</a>
            <a
              href={
                AI ? "https://www.euranix.com/data-deletion" : "/data-deletion"
              }
            >
              Data deletion
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
function CTA({
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
const needs = [
  {
    title: "Simplify the everyday",
    text: "Too many suppliers. Too many renewals. No clear owner.",
    steps: [
      "Review your current setup",
      "Connect IT, security and applications",
      "Agree ongoing management",
    ],
    services: "Managed IT · Cybersecurity · Business Applications",
  },
  {
    title: "Connect the work",
    text: "Information moves between people, but your tools don’t.",
    steps: [
      "Map one business workflow",
      "Configure, integrate or build",
      "Test the handovers with your team",
    ],
    services: "Business Applications · Custom Software · Managed AI",
  },
  {
    title: "Care for your customers",
    text: "Every customer question needs a clear next step.",
    steps: [
      "Agree channels and working hours",
      "Set up knowledge and routing",
      "Assign people and escalation",
    ],
    services: "Managed Operations · Customer Experience · Managed AI",
  },
];
function MainHome() {
  return (
    <>
      <section className="shell hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="red-dot" /> Technology. People. Continuity.
          </p>
          <h1>
            More room
            <br />
            to run your
            <br />
            <em>business.</em>
          </h1>
          <p className="lede">
            From the systems your team uses to the customers you care for.
            Euranix brings technology and managed operations together, with a
            clear owner for the work.
          </p>
          <div className="actions">
            <a className="btn primary" href={enquiry("Technology review")}>
              Request a technology review ↗
            </a>
            <a className="text-link" href="#services">
              Explore our services ↓
            </a>
          </div>
          <p className="small muted">
            A one-hour conversation. Free for a limited period.
            <br />
            Future standard fee US$199. Appointment subject to confirmation.
          </p>
        </div>
        <BusinessWorkflow />
      </section>
      <div className="principle-strip">
        <div className="shell">
          <span>Built for small businesses</span>
          <span>Security throughout the work</span>
          <span>Support beyond launch</span>
        </div>
      </div>
      <section id="services" className="section shell">
        <div className="section-heading">
          <p className="eyebrow">01 / The Euranix portfolio</p>
          <div>
            <h2>
              One business.
              <br />
              Many moving parts.
            </h2>
            <p>
              Choose the help you need today. Connect it with the rest when
              you’re ready. All seven service areas are available.
            </p>
          </div>
        </div>
        <div className="service-list">
          {verticals.map(([title, tag, detail], i) => (
            <details key={title} className="service-row" open={i === 3}>
              <summary>
                <span className="row-number">0{i + 1}</span>
                <h3>{title}</h3>
                <span className="row-tag">{tag}</span>
                <span className="plus" aria-hidden="true">
                  +
                </span>
              </summary>
              <div className="service-detail">
                <p>{detail}</p>
                <a
                  className="text-link"
                  href={
                    i === 3
                      ? base + "/custom-software"
                      : i === 4
                        ? "https://euranix.ai"
                        : enquiry(title)
                  }
                >
                  {i === 3
                    ? "Explore custom software"
                    : i === 4
                      ? "Visit Euranix AI"
                      : "Discuss this service"}{" "}
                  ↗
                </a>
                <span className="small muted">
                  Request pricing · scope agreed with you
                </span>
              </div>
            </details>
          ))}
        </div>
      </section>
      <section id="solutions" className="section solutions">
        <div className="shell">
          <div className="section-heading">
            <p className="eyebrow">02 / Start with the work</p>
            <div>
              <h2>
                The right combination.
                <br />
                For the problem at hand.
              </h2>
              <p>
                Services work better together when each one has a clear purpose.
              </p>
            </div>
          </div>
          <div className="solution-columns">
            {needs.map((n, i) => (
              <article key={n.title}>
                <span className="solution-number">0{i + 1}</span>
                <h3>{n.title}</h3>
                <p>{n.text}</p>
                <p className="small muted">{n.services}</p>
                <a
                  className="text-link"
                  href={enquiry(
                    i === 0
                      ? "Technology review"
                      : i === 1
                        ? "Business Applications"
                        : "Managed Operations and Customer Experience",
                  )}
                >
                  Talk through your needs ↗
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section shell application-section">
        <div>
          <p className="eyebrow">03 / Choose well before you build</p>
          <h2>
            Useful software.
            <br />
            Properly managed.
          </h2>
          <p>
            We help select and operate business applications, and build custom
            software where your workflow needs something more.
          </p>
          <a className="text-link" href="/products">
            Explore existing Euranix products ↗
          </a>
        </div>
        <div className="application-list">
          {[
            ["Customer relationships", "Odoo · Dolibarr · EspoCRM · Twenty"],
            [
              "Billing & customer care",
              "Invoice Ninja · Paymenter · Chatwoot · FreeScout",
            ],
            [
              "Projects & collaboration",
              "Plane · Redmine · Nextcloud · BookStack",
            ],
            [
              "Websites & documents",
              "WordPress · Ghost · Paperless-ngx · Documenso",
            ],
          ].map(([title, names]) => (
            <div key={title}>
              <h3>{title}</h3>
              <p>{names}</p>
            </div>
          ))}
          <p className="small muted">
            We help you choose the right fit, with editions, licences and
            ongoing support agreed for your business.
          </p>
          <a href={enquiry("Business Applications")} className="text-link">
            Find the right application ↗
          </a>
        </div>
      </section>
      <section className="dark-feature">
        <div className="shell two-col">
          <div>
            <p className="eyebrow">04 / People behind the process</p>
            <h2>
              Your operations.
              <br />
              Our responsibility.
            </h2>
          </div>
          <div>
            <p className="lede">
              Dedicated or shared English-speaking resources, managed by
              Euranix, to help keep everyday work moving.
            </p>
            <p>
              Monthly subscriptions with agreed working hours, skills and
              capacity. Onboarding within a few days, subject to agreed
              requirements.
            </p>
            <p>
              Customer Experience teams support your end customers using your
              approved policies, channels and escalation process.
            </p>
            <a
              className="btn light"
              href={enquiry("Managed Operations and Customer Experience")}
            >
              Discuss your team’s capacity ↗
            </a>
          </div>
        </div>
      </section>
      <section className="section shell approach">
        <p className="eyebrow">05 / How we work</p>
        <h2>
          Understand first.
          <br />
          Stay accountable.
        </h2>
        <div className="process-three">
          {[
            [
              "Understand",
              "Map your current tools, people, costs and constraints. Agree what a useful result looks like.",
            ],
            [
              "Deliver",
              "Set a clear scope, responsibilities and acceptance criteria. Keep decisions visible as the work progresses.",
            ],
            [
              "Operate",
              "Agree support hours, management responsibilities and review points. Improve what needs attention.",
            ],
          ].map(([h, p], i) => (
            <article key={h}>
              <span>0{i + 1}</span>
              <h3>{h}</h3>
              <p>{p}</p>
            </article>
          ))}
        </div>
      </section>
      <CTA />
    </>
  );
}
function AIHome() {
  return (
    <>
      <section className="shell hero ai-hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="red-dot" /> Managed AI, by Euranix
          </p>
          <h1>
            Your knowledge.
            <br />A useful answer.
            <br />
            <em>A clear source.</em>
          </h1>
          <p className="lede">
            Give your team a practical way to use the information your business
            already has. We help define, deploy and manage the assistant around
            the job it needs to do.
          </p>
          <div className="actions">
            <a className="btn primary" href={enquiry("Managed AI")}>
              Discuss your AI use case ↗
            </a>
            <a className="text-link" href="#demo">
              Explore the sample ↓
            </a>
          </div>
          <p className="small muted">
            Start with one use case. Agree data access, deployment and ongoing
            care.
          </p>
        </div>
        <div id="demo">
          <KnowledgeDemo />
        </div>
      </section>
      <div className="principle-strip">
        <div className="shell">
          <span>Approved information</span>
          <span>Defined access</span>
          <span>A route to a person</span>
        </div>
      </div>
      <section id="usecases" className="section shell">
        <div className="section-heading">
          <p className="eyebrow">01 / Give AI a useful job</p>
          <div>
            <h2>
              Less searching.
              <br />
              More informed work.
            </h2>
            <p>
              Three starting points, each with information boundaries and a
              clear way to evaluate the result.
            </p>
          </div>
        </div>
        <div className="usecase-list">
          {[
            [
              "Find the right business knowledge",
              "Help staff navigate policies, processes and documents. Identify the source, respect the person’s access and surface gaps in the approved material.",
              "Evaluate with representative questions and source checks.",
            ],
            [
              "Support your customers",
              "Answer routine questions from approved product and support information. Escalate sensitive, unresolved or account-specific requests to the right team.",
              "Agree channels, handover responsibilities and human working hours.",
            ],
            [
              "Ask about business information",
              "Explore approved records in plain language. Scope database permissions and queries, and verify the result against the underlying records.",
              "Keep read access separate from permission to change a record.",
            ],
          ].map(([h, p, n], i) => (
            <article key={h}>
              <span className="row-number">0{i + 1}</span>
              <div>
                <h3>{h}</h3>
                <p>{p}</p>
                <p className="small muted">{n}</p>
              </div>
              <a className="text-link" href={enquiry("Managed AI")}>
                Discuss this use case ↗
              </a>
            </article>
          ))}
        </div>
      </section>
      <section id="howitworks" className="section ai-process">
        <div className="shell">
          <p className="eyebrow">02 / Managed from the start</p>
          <h2>
            From a question
            <br />
            to a working service.
          </h2>
          <div className="process-three">
            {[
              [
                "Define the job",
                "Choose a use case, approved information sources and representative questions. Agree success criteria and what the assistant must decline.",
              ],
              [
                "Configure and evaluate",
                "Set access boundaries, select the deployment model and test references, permissions, uncertainty and escalation before release.",
              ],
              [
                "Manage and improve",
                "Monitor service health and review answer quality. Maintain content connections, evaluate changes and keep human escalation current.",
              ],
            ].map(([h, p], i) => (
              <article key={h}>
                <span>0{i + 1}</span>
                <h3>{h}</h3>
                <p>{p}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section id="privacy" className="section shell two-col">
        <div>
          <p className="eyebrow">03 / Your information, deliberately handled</p>
          <h2>
            Decide what AI
            <br />
            can see. And do.
          </h2>
          <p>
            Deployment and data handling are choices to agree, not assumptions.
            We document where information is processed, who can access it and
            how it is maintained.
          </p>
          <a className="text-link" href={enquiry("Managed AI")}>
            Discuss your requirements ↗
          </a>
        </div>
        <div className="control-list">
          {[
            [
              "Deployment",
              "Cloud, private cloud or on-premise options, scoped to your requirements and supported infrastructure. Confirm model providers, retention and data processing before release.",
            ],
            [
              "Information access",
              "Approved documents, websites and scoped database connections. Define roles, allowed sources and update responsibilities.",
            ],
            [
              "Integrations",
              "Assess your APIs and existing software. Document read/write boundaries and any actions that require human approval.",
            ],
            [
              "Ongoing care",
              "Agree monitoring, content updates, evaluation and escalation. Proactive monitoring does not imply round-the-clock human support.",
            ],
          ].map(([h, p]) => (
            <details key={h} open>
              <summary>{h}</summary>
              <p>{p}</p>
            </details>
          ))}
        </div>
      </section>
      <section id="features" className="section shell">
        <div className="section-heading">
          <p className="eyebrow">04 / Build on what you use</p>
          <div>
            <h2>
              Fit the assistant
              <br />
              to your environment.
            </h2>
            <p>
              Bring together documents, websites and business records. Explore
              database connections, S3 updates, departmental assistants, voice
              and text, website support and usage reporting in a demonstration
              focused on your work.
            </p>
          </div>
        </div>
        <p className="source-line">
          Documents & URLs <span>·</span> Scoped databases <span>·</span>{" "}
          Existing APIs <span>·</span> Approved knowledge
        </p>
      </section>
      <section id="pricing" className="section pricing-section">
        <div className="shell two-col">
          <div>
            <p className="eyebrow">05 / A scope you can understand</p>
            <h2>
              Managed AI.
              <br />
              Clearly agreed.
            </h2>
            <p>
              Pricing follows your use case, data sources, users, integrations
              and deployment requirements.
            </p>
          </div>
          <div className="price-panel">
            <span className="eyebrow">Setup + ongoing management</span>
            <h3>Request pricing</h3>
            <p>
              Your proposal will identify implementation, recurring management,
              model usage, infrastructure, licences and included support.
              Capacity and service hours are agreed with you.
            </p>
            <a className="btn primary" href={enquiry("Managed AI")}>
              Request a scoped proposal ↗
            </a>
          </div>
        </div>
      </section>
      <CTA ai />
    </>
  );
}
const phases = [
  [
    "Discover",
    "Map users, workflows and integrations. Agree functional requirements, security risks, acceptance criteria and scope.",
    "Requirements and risk record",
  ],
  [
    "Design",
    "Review architecture, data access, permissions and open-source components. Plan migration, operational ownership and secure configuration.",
    "Architecture and delivery plan",
  ],
  [
    "Build",
    "Develop in reviewable increments. Use AI assistance where useful, with engineers accountable for design, code review and release decisions.",
    "Reviewed implementation",
  ],
  [
    "Verify",
    "Test important business journeys and failure cases. Combine unit and integration tests, static analysis and security testing; scope penetration testing to the system.",
    "Test evidence and acceptance review",
  ],
  [
    "Release",
    "Check configuration, access and migrations. Prepare rollback and operational handover before an agreed controlled deployment.",
    "Release and rollback plan",
  ],
  [
    "Operate",
    "Maintain a software bill of materials, track dependency vulnerabilities and prioritise remediation. Agree monitoring, patching and ongoing support.",
    "Maintenance and support plan",
  ],
];
function Software() {
  return (
    <>
      <section className="shell service-hero">
        <a className="breadcrumb" href={base + "/#services"}>
          ← All service areas
        </a>
        <div className="two-col">
          <div>
            <p className="eyebrow">Custom Software Engineering</p>
            <h1>
              Software that fits
              <br />
              the way
              <br />
              <em>you work.</em>
            </h1>
          </div>
          <div className="service-intro">
            <p className="lede">
              When existing tools can’t support an important workflow, build the
              capability your business actually needs.
            </p>
            <p>
              Web and mobile applications, business systems, APIs and
              integrations. Designed securely, reviewed by people and supported
              beyond launch.
            </p>
            <a
              className="btn primary"
              href={enquiry("Custom Software Engineering")}
            >
              Discuss your software project ↗
            </a>
            <p className="small muted">
              Request pricing · discovery and delivery scoped to your needs
            </p>
          </div>
        </div>
      </section>
      <section className="section solutions">
        <div className="shell two-col">
          <div>
            <p className="eyebrow">01 / Build for a reason</p>
            <h2>
              Start with the workflow.
              <br />
              Choose the right approach.
            </h2>
          </div>
          <div>
            <p className="lede">
              You may be joining disconnected systems, replacing a spreadsheet
              process, modernising an existing application or creating a new
              service.
            </p>
            <p>
              We first consider whether an existing product can be configured or
              integrated. Custom development makes sense when the fit, control
              or user experience requires it.
            </p>
            <p>
              Agree success in terms your team can verify: a working journey,
              clear permissions, dependable handovers and maintainable software.
            </p>
            <a className="text-link" href={base + "/#services"}>
              Explore complementary services ↗
            </a>
          </div>
        </div>
      </section>
      <section className="section shell">
        <div className="section-heading">
          <p className="eyebrow">02 / From requirement to daily use</p>
          <div>
            <h2>
              Engineering discipline.
              <br />
              At every stage.
            </h2>
            <p>
              AI can assist the work. People remain responsible for the
              decisions, quality and release.
            </p>
          </div>
        </div>
        <div className="delivery-list">
          {phases.map(([h, p, e], i) => (
            <article key={h}>
              <span className="row-number">0{i + 1}</span>
              <h3>{h}</h3>
              <div>
                <p>{p}</p>
                <span className="deliverable">What you receive / {e}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="dark-feature">
        <div className="shell two-col">
          <div>
            <p className="eyebrow">03 / Visibility, not guesswork</p>
            <h2>
              Know what you’re
              <br />
              accepting.
            </h2>
            <p>Review the work against agreed criteria before it goes live.</p>
          </div>
          <div className="evidence">
            <p className="fixture-label">ILLUSTRATIVE ACCEPTANCE CHECKLIST</p>
            <ul>
              {[
                "Core journeys demonstrated to your team",
                "Access and failure cases reviewed",
                "Test results and unresolved issues recorded",
                "Deployment and rollback steps documented",
                "Support ownership and hours agreed",
              ].map((x) => (
                <li key={x}>
                  <span aria-hidden="true">□</span>
                  {x}
                </li>
              ))}
            </ul>
            <small>
              A process example, not a completed customer test report.
            </small>
          </div>
        </div>
      </section>
      <section className="section shell two-col">
        <div>
          <p className="eyebrow">04 / A clear working agreement</p>
          <h2>
            Scope the build.
            <br />
            Plan for its life.
          </h2>
          <p>
            Expect an itemised proposal, with requirements, responsibilities,
            acceptance criteria and a change process.
          </p>
          <a
            className="btn primary"
            href={enquiry("Custom Software Engineering")}
          >
            Request a project discussion ↗
          </a>
        </div>
        <div className="scope-list">
          {[
            [
              "Included work",
              "Discovery, design, implementation, testing, documentation and handover are defined in your scope. Confirm migration, integrations and training explicitly.",
            ],
            [
              "After launch",
              "Agree hosting, proactive monitoring, backups, patching and application support. Human support follows customer working hours; monitoring coverage is specified separately.",
            ],
            [
              "Security response",
              "Assess new vulnerabilities, prioritise by exposure and severity, and agree containment, mitigation and remediation. When a patch is not available, we assess containment and mitigation and explain the remaining risk.",
            ],
            [
              "Commercial clarity",
              "Request pricing. Separate delivery phases, recurring care, infrastructure, licences and change requests. Agree source ownership, access and exit arrangements in the contract.",
            ],
          ].map(([h, p]) => (
            <div key={h}>
              <h3>{h}</h3>
              <p>{p}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="section shell faq">
        <p className="eyebrow">05 / Questions before you begin</p>
        <h2>Let’s make the details clear.</h2>
        {[
          [
            "Can you work with our existing software?",
            "Yes. We review the current architecture, access and integration options before agreeing the work. A change or integration may be more useful than a rebuild.",
          ],
          [
            "How do you use AI in development?",
            "AI can assist implementation and analysis. Engineers review the output and remain responsible for secure design, tests and release approval. We agree data handling for development tools.",
          ],
          [
            "What does security testing include?",
            "The test plan follows the system’s risk and scope. It can include static analysis, dependency checks, access-control tests and scoped penetration testing. Findings and unresolved risks are made visible before acceptance.",
          ],
          [
            "How long will delivery take?",
            "We estimate after understanding the scope and dependencies. We agree milestones and review points with you, then keep you informed as the work progresses.",
          ],
          [
            "Can you maintain the application?",
            "Yes. We offer ongoing care with defined responsibilities, supported environments and human support hours. Proactive monitoring and change capacity are separately scoped.",
          ],
        ].map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </section>
      <CTA software />
    </>
  );
}
export default function App() {
  const path = location.pathname.replace(/\/$/, "");
  const page =
    path === base
      ? "home"
      : path === base + "/enquiry"
        ? "enquiry"
        : !AI && path === base + "/custom-software"
          ? "software"
          : "missing";
  useEffect(() => {
    document.title =
      page === "enquiry"
        ? "Enquiry design review | Euranix" + (AI ? " AI" : "")
        : page === "software"
          ? "Custom Software Engineering design review | Euranix"
          : AI
            ? "Managed AI design review | Euranix AI"
            : "Technology and Operations design review | Euranix";
  }, [page]);
  return (
    <div className={AI ? "review ai" : "review corporate"}>
      <Header />
      <main id="main" tabIndex={-1}>
        {page === "home" ? (
          AI ? (
            <AIHome />
          ) : (
            <MainHome />
          )
        ) : page === "enquiry" ? (
          <Enquiry ai={AI} />
        ) : page === "software" ? (
          <Software />
        ) : (
          <section className="shell section">
            <h1>Page not found</h1>
            <a href={base + "/"}>Return to design review</a>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
