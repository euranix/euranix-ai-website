export type Service = {
  id: string;
  title: string;
  summary: string;
  intro: string;
  fit: string;
  work: [string, string][];
  handover: string[];
  boundaries: string;
  questions: [string, string][];
};
export const services: Service[] = [
  {
    id: "managed-it-cloud",
    title: "Managed IT and Cloud",
    summary: "Keep your team’s everyday tools working.",
    intro:
      "Bring business email, hosting, servers and everyday IT support under a clear operating plan. We help small teams understand what they run, who owns it and how to get help.",
    fit: "Useful when subscriptions, accounts and suppliers have grown without a clear owner, or when you need support for a migration or a changing team.",
    work: [
      [
        "Email and productivity",
        "Set up or manage business email, Google Workspace and Microsoft 365. Agree account administration, joiner and leaver processes, supported applications and migration responsibilities.",
      ],
      [
        "Hosting and infrastructure",
        "Domains, hosting, managed VPS and server management, with public or private cloud choices matched to the workload. Cloud architecture, Kubernetes and infrastructure as code are scoped where the environment needs them.",
      ],
      [
        "Patching and visibility",
        "Maintain supported servers and configurations, monitor agreed services and document important dependencies. CI/CD, observability, backups and recovery planning can form part of the operating scope.",
      ],
      [
        "Everyday support",
        "Give support requests an owner, supported channels and an escalation path. Agree human working hours separately from automated monitoring.",
      ],
    ],
    handover: [
      "An inventory of supported systems and accountable owners",
      "A migration or onboarding plan with prerequisites and change windows",
      "A documented support, patching and escalation arrangement",
    ],
    boundaries:
      "Infrastructure, domains and software licences are itemised or explicitly included. Support scope, response targets and recovery responsibilities are agreed for your environment; ongoing management does not mean unlimited changes.",
    questions: [
      [
        "Can you work with our existing providers?",
        "Yes. We review the accounts, access and contracts you already have before proposing a migration or a change of provider.",
      ],
      [
        "Does monitoring mean someone is always on call?",
        "No. Automated monitoring and human availability are separate parts of your agreement. We make the hours and escalation route clear.",
      ],
    ],
  },
  {
    id: "cybersecurity-resilience",
    title: "Cybersecurity and Resilience",
    summary: "Protect the work your business depends on.",
    intro:
      "Put practical security controls around your people, devices, websites and business data. Start with what matters to the business, then agree the controls and response responsibilities.",
    fit: "Useful when you need a clearer view of exposure, stronger access controls, ongoing security maintenance or a plan for handling disruption.",
    work: [
      [
        "Access and endpoints",
        "Endpoint protection, password management, business VPN and identity/access controls. Review administrative access, supported devices and the responsibilities for keeping controls current.",
      ],
      [
        "Websites and servers",
        "Website security, SSL coordination, server hardening, patch management and logging. A certificate protects its configured connection; it is one part of a wider security setup.",
      ],
      [
        "Assessment and readiness",
        "Scope vulnerability assessments, application or network testing, code and architecture reviews to the system and permission provided. Use findings to prioritise improvements and incident readiness.",
      ],
      [
        "Backup and recovery",
        "Define what is backed up, where it is retained and who responds when recovery is needed. Restoration exercises and wider recovery planning are agreed explicitly.",
      ],
    ],
    handover: [
      "A prioritised record of the risks and controls in scope",
      "An agreed remediation and escalation plan",
      "Documented backup, retention and recovery responsibilities",
    ],
    boundaries:
      "No control guarantees complete protection. Where a permanent patch does not exist, we assess containment and mitigation and explain residual risk. Response targets, covered systems and human support hours must be agreed.",
    questions: [
      [
        "Can you review a system another supplier built?",
        "Yes, subject to authorised access and a defined testing scope. We make recommendations and ownership of follow-up actions clear.",
      ],
      [
        "Is a backup the same as a recovery plan?",
        "No. A backup is a copy of data. Recovery also depends on usable restore procedures, dependencies, people and agreed priorities.",
      ],
    ],
  },
  {
    id: "business-applications",
    title: "Business Applications",
    summary: "Connect the work between your tools.",
    intro:
      "Choose and operate applications around the way your team works. We help with selection, configuration, deployment, migration, integration and ongoing care of open-source and licensed software.",
    fit: "Useful when customer records, invoices, projects or support requests are spread across disconnected tools, or a standard product needs careful configuration.",
    work: [
      [
        "Start with the workflow",
        "Map the people, records, permissions and handovers. Shortlist tools and demonstrate the relevant workflow before agreeing the product and edition.",
      ],
      [
        "Configure and connect",
        "Set up roles and business rules, plan data migration, and scope integrations. Keep data ownership, export and exit arrangements clear.",
      ],
      [
        "Deploy and operate",
        "Agree hosting, backup, upgrades, security responsibility and supported versions. Ongoing management includes a defined support relationship.",
      ],
      [
        "Specialist systems",
        "Financial platforms and industry-specific workflows need their own discovery, access controls and implementation plan. They are scoped separately from everyday office applications.",
      ],
    ],
    handover: [
      "A chosen product and edition with documented licence and support scope",
      "A configuration and data migration plan",
      "An operating guide covering updates, access, backup and exit",
    ],
    boundaries:
      "Application names are selection options. Available editions, licence rights and features vary; your proposal identifies the supported combination. Third-party subscriptions and infrastructure are separately identified.",
    questions: [
      [
        "Do we have to replace all our tools?",
        "No. Configuration or a focused integration can be enough. We compare the cost and disruption of keeping, connecting or replacing an application.",
      ],
      [
        "Can you manage open-source software for us?",
        "Yes. We agree the specific product, edition, hosting, update process and support responsibilities. Open source does not mean every feature or service is free.",
      ],
    ],
  },
  {
    id: "custom-software-engineering",
    title: "Custom Software Engineering",
    summary: "Build what your existing tools cannot do.",
    intro:
      "Secure web, mobile and business software, with AI assistance reviewed by people and ongoing care after launch.",
    fit: "",
    work: [],
    handover: [],
    boundaries: "",
    questions: [],
  },
  {
    id: "managed-ai",
    title: "Managed AI",
    summary: "Make your business knowledge easier to use.",
    intro:
      "Put AI to work on a defined business task, with information access, evaluation and ongoing management agreed from the start. Euranix AI is our specialist destination for use cases and demonstrations.",
    fit: "Useful when staff need to find business knowledge, customers need help with routine questions, or a team needs a clearer way to explore approved records.",
    work: [
      [
        "Business knowledge",
        "Help people navigate policies, processes and documents. Evaluate answers against representative questions and visible references; identify information gaps.",
      ],
      [
        "Customer support",
        "Use approved product and support material for routine questions. Define when the assistant must decline, ask for clarification or hand over to a person.",
      ],
      [
        "Business information",
        "Scope database permissions and plain-language questions around approved records. Separate permission to read information from permission to change it.",
      ],
      [
        "Deployment and care",
        "Choose supported cloud, private-cloud or on-premise options for the workload. Agree providers, data location, updates, usage reporting and human escalation.",
      ],
    ],
    handover: [
      "A defined use case, approved sources and evaluation questions",
      "Documented access and deployment boundaries",
      "An ongoing review and escalation arrangement",
    ],
    boundaries:
      "AI outputs need evaluation and may be incomplete. Supported integrations and deployment options are confirmed through a scoped demonstration. Automated availability does not imply continuous human support.",
    questions: [
      [
        "Can AI use our existing systems?",
        "We assess documents, websites, database connections and APIs against the use case and permissions. The exact integration and update process are confirmed in the scope.",
      ],
      [
        "What happens when an answer is missing?",
        "We design for uncertainty: identify the gap, avoid an unsupported answer and route the question to the agreed person or team.",
      ],
    ],
  },
  {
    id: "websites-digital-growth",
    title: "Websites and Digital Growth",
    summary: "Turn interest into a useful conversation.",
    intro:
      "Build a clear route from discovery to enquiry and follow-up. We design, develop and maintain websites, and scope content and digital marketing around the work your business needs.",
    fit: "Useful for a new website, a difficult mobile journey, an ageing site or campaigns that need a clearer destination and accountable upkeep.",
    work: [
      [
        "Plan the customer journey",
        "Clarify audiences, pages, useful content and next steps. Preserve valuable URLs and plan redirects when a page genuinely moves.",
      ],
      [
        "Design and build",
        "Create responsive layouts with accessible controls, useful demonstrations and attention to load cost. Connect approved forms, portals and existing services.",
      ],
      [
        "Launch and maintain",
        "Review metadata, crawlable content, missing pages, mobile behaviour and operational handover. Agree hosting, domains, SSL, maintenance and content responsibilities.",
      ],
      [
        "Content and campaigns",
        "Scope channels, content production, campaign operations and reporting separately. Advertising spend is identified apart from management fees.",
      ],
    ],
    handover: [
      "A page and content plan with clear enquiry journeys",
      "A tested website and documented integrations",
      "An agreed maintenance, content and reporting arrangement",
    ],
    boundaries:
      "Page count, supported integrations, content ownership and ongoing changes are defined in the proposal. We do not promise search rankings, traffic or campaign returns without evidence.",
    questions: [
      [
        "Can you improve our existing site?",
        "Yes. We first inspect its content, URLs, technology and working integrations. A focused improvement may be more useful than a full rebuild.",
      ],
      [
        "Does the website price include advertising?",
        "Advertising spend and ongoing campaign management are separate unless your proposal explicitly includes them.",
      ],
    ],
  },
  {
    id: "managed-operations-cx",
    title: "Managed Operations and Customer Experience",
    summary: "Give everyday work a clear owner.",
    intro:
      "Dedicated or shared English-speaking professionals, managed by Euranix, help with IT and digital operations, projects, administration and care for your end customers.",
    fit: "Useful when recurring work needs reliable ownership, your team needs extra capacity, or customer requests are falling between teams.",
    work: [
      [
        "Dedicated or shared capacity",
        "Choose a resource model suited to the workload. Agree skills, tasks, monthly capacity, working hours and how competing priorities are handled.",
      ],
      [
        "Managed delivery",
        "Euranix manages the agreed work, supervision and reporting. Document responsibilities, escalation, access and the decisions that remain with your business.",
      ],
      [
        "Customer experience",
        "Support your end customers through approved channels and policies. Agree handovers, response expectations, sensitive cases and when to escalate to your team.",
      ],
      [
        "Onboarding and continuity",
        "Onboarding is within a few days, subject to agreed requirements, access and readiness. Agree training, coverage, documentation and change control.",
      ],
    ],
    handover: [
      "A named delivery owner and agreed task boundaries",
      "A working-hours, capacity and escalation plan",
      "A reporting rhythm and documented handovers",
    ],
    boundaries:
      "Services use monthly subscriptions with agreed hours, skills and capacity. They do not imply unlimited work or round-the-clock human availability. Tool subscriptions and specialist tasks are scoped explicitly.",
    questions: [
      [
        "What is the difference between dedicated and shared?",
        "Dedicated capacity is reserved for your agreed work; shared resources divide capacity across agreed workloads. Your proposal defines availability, priorities and coverage.",
      ],
      [
        "Whose customers does customer experience support?",
        "Your end customers. We follow the policies, channels and escalation process you approve for your business.",
      ],
    ],
  },
];
export const serviceById = (id: string) => services.find((s) => s.id === id);
export const catalogue: [string, string][] = [
  ["CRM and business management", "Odoo, Dolibarr, EspoCRM, Twenty"],
  ["Invoicing and billing", "Invoice Ninja, Paymenter"],
  ["Customer support and live chat", "Chatwoot, FreeScout, Chaskiq"],
  ["Appointments and scheduling", "EasyAppointments, Rallly"],
  ["Project and task management", "Plane, Leantime, Redmine, Vikunja, Fizzy"],
  [
    "Websites and blogs",
    "WordPress, Ghost, Drupal, Joomla, ClassicPress, Nitropage",
  ],
  ["File storage and sharing", "Nextcloud, Seafile, Pydio Cells, PairDrop"],
  [
    "Company wiki and knowledge",
    "BookStack, Docmost, Outline, Wiki.js, DokuWiki",
  ],
  ["Collaborative workspaces", "AFFiNE, AppFlowy"],
  [
    "Documents and PDF tools",
    "Paperless-ngx, Stirling PDF, Bento PDF, LibreOffice",
  ],
  ["Electronic signatures", "Documenso, DocuSeal"],
  [
    "Forms, surveys and feedback",
    "HeyForm, OpnForm, LimeSurvey, Formbricks, Fider",
  ],
  ["Newsletters and social media", "Listmonk, Postiz, Mixpost"],
  [
    "Team chat and meetings",
    "Mattermost, Rocket.Chat, Jitsi, Campfire, Matrix Synapse",
  ],
  ["Design, whiteboards and recordings", "Penpot, Excalidraw, Cap"],
  [
    "AI implementation options",
    "AnythingLLM, LibreChat, Open WebUI, Ollama with Open WebUI, Lobe Chat",
  ],
  ["Password management", "Vaultwarden, Passbolt"],
  ["Time tracking", "Kimai"],
  [
    "Photos and media",
    "Immich, Ente Photos, Jellyfin, Plex, Emby, PeerTube, Audiobookshelf, Navidrome, Castopod",
  ],
  [
    "Personal finance and household",
    "Actual Budget, Firefly III, Sure, Mealie, Grocy, Homebox, Baby Buddy",
  ],
  [
    "Reading, bookmarks and notes",
    "Karakeep, Linkwarden, Linkding, Readeck, FreshRSS, Miniflux, Grimmory, Calibre-Web, Memos, Obsidian, SilverBullet, SiYuan, TriliumNext",
  ],
  [
    "Specialist financial services",
    "Mifos; relevant Mifos X and Apache Fineract scope is assessed separately",
  ],
];
