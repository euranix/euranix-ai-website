import CTA from "../components/CTA";
import { KnowledgeDemo } from "../components/WorkflowDemo";
import { enquiry } from "../site";
export default function AIHome() {
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
      <div className="principle-strip" id="outcomes">
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
