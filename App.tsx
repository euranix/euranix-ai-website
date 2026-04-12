import React, { useEffect, useRef, useState } from 'react';
import './App.css';

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(40px)', transition: `opacity 0.7s ${delay}s ease, transform 0.7s ${delay}s ease` }}>
      {children}
    </div>
  );
}

function Typewriter({ text, speed = 55 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      if (i < text.length) { setDisplayed(text.slice(0, ++i)); } else { clearInterval(iv); setDone(true); }
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed]);
  return <span>{displayed}{!done && <span className="caret">|</span>}</span>;
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);
  const links = [['Benefits','#outcomes'],['Use Cases','#usecases'],['Features','#features'],['Privacy','#privacy'],['Pricing','#pricing'],['Euranix.com','https://www.euranix.com']];
  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <a href="/" className="nav-logo">EURANIX<span className="red">.</span>AI</a>
        <div className="nav-links">{links.map(([l,h]) => <a key={l} href={h}>{l}</a>)}</div>
        <a href="https://platform.euranix.ai" className="nav-cta">Get Started →</a>
        <button className="hamburger" onClick={() => setOpen(true)}><span/><span/><span/></button>
      </nav>
      {open && (
        <div className="mobile-menu">
          <button className="mobile-close" onClick={() => setOpen(false)}>✕</button>
          {links.map(([l,h]) => <a key={l} href={h} onClick={() => setOpen(false)}>{l}</a>)}
          <a href="https://platform.euranix.ai" className="nav-cta" onClick={() => setOpen(false)}>Get Started →</a>
        </div>
      )}
    </>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-grid"/>
      <div className="orb orb1"/><div className="orb orb2"/><div className="orb orb3"/>
      <div className="hero-inner">
        <div className="hero-badge"><span className="badge-dot"/>NOW AVAILABLE — EURANIX AI</div>
        <h1>YOUR BUSINESS<br/><span className="red">INTELLIGENCE</span><br/><span className="outline">UNLOCKED</span></h1>
        <p className="hero-sub">Turn your documents, databases, notes, and team knowledge into an AI that <strong>answers questions</strong>, <strong>supports your customers</strong>, and <strong>works the way you do</strong> — with complete privacy and security.</p>
        <div className="hero-actions">
          <a href="https://platform.euranix.ai" className="btn-primary">Start Free Trial →</a>
          <a href="mailto:contact@euranix.com?subject=Demo Request" className="btn-secondary">Book a Demo</a>
        </div>
        <div className="hero-stats">
          {[['5min','To first AI answer'],['100%','Your data, your control'],['10+','Data sources supported'],['24/7','AI always available']].map(([n,l]) => (
            <div key={l} className="stat-item"><div className="stat-num">{n}</div><div className="stat-label">{l}</div></div>
          ))}
        </div>
      </div>
    </section>
  );
}

const outcomes = [
  {icon:'🔍',title:'Find Any Answer Instantly',desc:'Ask in plain English. Get accurate answers from your own documents, databases, and notes — in seconds, not hours of searching.'},
  {icon:'🤖',title:'AI That Knows Your Business',desc:'Not a generic chatbot. An AI trained on your products, processes, and history — that speaks your language and understands your context.'},
  {icon:'🔒',title:'Your Data Never Leaves',desc:'Unlike public AI tools, your business data is never used to train models. Choose cloud or fully private hosting — your call.'},
  {icon:'💬',title:'Support Customers 24/7',desc:'Add an AI chat widget to your website. Customers get instant answers from your knowledge base — even at midnight, even on weekends.'},
  {icon:'🎙️',title:'Talk To Your AI',desc:'Not a fan of typing? Just speak. Euranix AI listens, understands, and responds — in voice or text, whatever works for you.'},
  {icon:'⚡',title:'Works With What You Have',desc:'Connects to your existing software, databases, and files. No migration, no disruption. Your data stays where it is.'},
];

function Outcomes() {
  return (
    <section className="outcomes" id="outcomes">
      <Reveal><div className="section-label">// Why Euranix AI</div></Reveal>
      <Reveal delay={0.1}><h2>STOP LOSING TIME<br/>TO INFORMATION CHAOS</h2></Reveal>
      <Reveal delay={0.15}><p className="section-sub">Your team wastes hours every week searching for answers that already exist somewhere in your business. Euranix AI fixes that.</p></Reveal>
      <div className="outcomes-grid">
        {outcomes.map((o,i) => (
          <Reveal key={o.title} delay={i*0.07}>
            <div className="outcome-card">
              <div className="outcome-icon">{o.icon}</div>
              <h3>{o.title}</h3>
              <p>{o.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const ucards = [
  {tag:'CUSTOMER SUPPORT',title:'AI Chat Widget on Your Website',desc:'Embed a branded AI assistant on your website. It answers customer questions using your product docs, FAQs, and support history — 24/7, no human needed for common queries.',list:['Instant answers from your knowledge base','Escalates to human when needed','Branded with your colors and name','Works on any website or app']},
  {tag:'DATA & ANALYTICS',title:'Ask Questions Over Your Database',desc:'Connect your business database and ask plain English questions. No SQL needed. Your team gets instant answers from live operational data.',list:['"What were our top products last month?"','"Show me pending orders over $500"','"Which customers haven\'t ordered in 90 days?"','Works with MySQL, PostgreSQL, and more']},
  {tag:'LEGACY INTEGRATION',title:'Add AI to Your Existing Software',desc:'Already using custom-built software? We integrate Euranix AI directly into your existing systems — no rebuild required.',list:['API integration into any software','Embedded chat in your existing apps','Custom AI agents for your workflows','We handle the full technical integration']},
  {tag:'CUSTOM USE CASE',title:"Don't See Your Use Case?",desc:"Every business is different. If you have a specific challenge that AI could solve, talk to us. We've built custom AI solutions for clinics, logistics, law firms, and more.",list:['HR policy assistant for large teams','Contract review and summarization','Inventory and supplier Q&A','Multilingual customer support']},
];

function UseCases() {
  return (
    <section id="usecases" className="usecases-section">
      <Reveal><div className="section-label">// Real World Use Cases</div></Reveal>
      <Reveal delay={0.1}><h2>BUILT FOR<br/><span className="red">REAL BUSINESS</span></h2></Reveal>
      <Reveal delay={0.15}><p className="section-sub">Whether you run a clinic, a retail chain, a law firm, or a software company — Euranix AI works for your team.</p></Reveal>
      <div className="usecases-wrap">
        <Reveal delay={0.1}>
          <div className="usecase-card featured">
            <div>
              <span className="usecase-tag">MOST POPULAR</span>
              <h3>Team Knowledge Base + Smart Notes</h3>
              <p>Your team creates notes, uploads documents, writes SOPs — and anyone can ask the AI and get instant answers. New staff onboard in hours, not weeks.</p>
              <ul className="usecase-list">
                <li>Upload PDFs, Word docs, spreadsheets, and more</li>
                <li>Take structured notes with AI-powered templates</li>
                <li>Ask questions in plain English, get precise answers</li>
                <li>Share specific answers with teammates — not everything</li>
                <li>Voice input — speak your question, hear the answer</li>
              </ul>
            </div>
            <div className="usecase-visual">
              <div className="visual-label">// LIVE DEMO</div>
              <div className="prompt">You: What's our warranty policy for international orders?</div>
              <br/>
              <div className="ai-response">AI: Based on your policy document (updated March 2025), international orders carry a 12-month warranty. Customers ship items back at their cost, replacements sent within 14 business days...</div>
              <br/>
              <div className="prompt">You: <Typewriter text="Can you summarize last week's team meeting?"/></div>
            </div>
          </div>
        </Reveal>
        <div className="usecase-grid-2">
          {ucards.map((uc,i) => (
            <Reveal key={uc.tag} delay={i*0.08}>
              <div className="usecase-card">
                <span className="usecase-tag">{uc.tag}</span>
                <h3>{uc.title}</h3>
                <p>{uc.desc}</p>
                <ul className="usecase-list">{uc.list.map(l => <li key={l}>{l}</li>)}</ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const feats = [
  {icon:'📁',title:'Upload Anything',desc:'PDFs, Word docs, Excel, plain text, markdown, website URLs — upload once, query forever.'},
  {icon:'🗄️',title:'Database Connection',desc:'Connect MySQL or PostgreSQL. Ask plain English questions, get real-time answers from live data.'},
  {icon:'📝',title:'Smart Notes',desc:'Create notes with AI-powered templates. Meeting notes, SOPs, project briefs — structured and searchable.'},
  {icon:'🎙️',title:'Voice Interface',desc:'Speak your question, hear the answer. Full voice interaction — hands-free AI for busy teams.'},
  {icon:'💬',title:'Embeddable Chat Widget',desc:'One line of code adds your AI assistant to any website. Branded, customizable, powered by your knowledge.'},
  {icon:'🔗',title:'Share Specific Answers',desc:'Share a specific AI response with a teammate or client — without giving access to your entire knowledge base.'},
  {icon:'📊',title:'Chat History & Analytics',desc:'Every conversation stored and searchable. See what your team asks most and where knowledge gaps exist.'},
  {icon:'🤖',title:'Custom AI Agents',desc:'Create different agents for different purposes — support, sales, HR — all from one platform.'},
  {icon:'🔄',title:'Auto-Sync Your Data',desc:'Connect S3 or your database and set daily sync. Your AI knowledge base stays current automatically.'},
];

function Features() {
  return (
    <section className="features" id="features">
      <Reveal><div className="section-label">// Platform Features</div></Reveal>
      <Reveal delay={0.1}><h2>EVERYTHING YOUR<br/>TEAM NEEDS</h2></Reveal>
      <Reveal delay={0.15}><p className="section-sub">One platform. Multiple ways to use AI. Built for teams that want results, not complexity.</p></Reveal>
      <div className="features-grid">
        {feats.map((f,i) => (
          <Reveal key={f.title} delay={i*0.05}>
            <div className="feature-card">
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const chips = ['📄 PDF Files','📊 Excel / CSV','📝 Word Documents','🗄️ MySQL','🐘 PostgreSQL','🌐 Websites','🔊 Audio Files','🎥 Video / Recordings','📦 AWS S3','📋 Markdown Notes','💾 Database Backups','📁 Any Text File'];

function IntegrationStrip() {
  const doubled = [...chips,...chips,...chips];
  return (
    <div className="int-section">
      <p className="int-label">WORKS WITH YOUR EXISTING TOOLS</p>
      <div className="int-strip">
        <div className="int-inner">{doubled.map((c,i) => <div key={i} className="int-chip">{c}</div>)}</div>
      </div>
    </div>
  );
}

function Privacy() {
  const tiers = [
    {label:'TIER 1 — STANDARD',title:'Cloud Hosted, Data Isolated',desc:'Your data is completely isolated. AI queries use OpenAI — processed but never stored or used for training per their enterprise policy.',active:false},
    {label:'TIER 2 — ENHANCED PRIVACY',title:'Your Own Private AI',desc:'We host an open-source language model on your dedicated server. Your data never touches OpenAI or any third party. 100% private.',active:true},
    {label:'TIER 3 — FULL CONTROL',title:'On-Premise Deployment',desc:'Everything runs on your own infrastructure. We set it up, manage it, and support it. Your data never leaves your building or cloud account.',active:false},
  ];
  const shields = ['Data never used to train public AI models','Complete tenant isolation — your data is yours only','Private LLM hosting available on request','All data encrypted at rest and in transit','Audit logs — see every query, every access','Token usage limits to control costs per user','We manage hosting, updates, and backups','GDPR and data residency options available'];
  return (
    <section className="privacy" id="privacy">
      <Reveal><div className="section-label">// Privacy &amp; Security</div></Reveal>
      <Reveal delay={0.1}><h2>YOUR DATA STAYS<br/><span className="red">YOURS. ALWAYS.</span></h2></Reveal>
      <Reveal delay={0.15}><p className="section-sub">We built Euranix AI for businesses that cannot afford to have their data shared, leaked, or used to train public AI models.</p></Reveal>
      <div className="privacy-grid">
        <Reveal delay={0.1}>
          <div className="privacy-tiers">
            {tiers.map(t => (
              <div key={t.label} className={`privacy-tier ${t.active?'active':''}`}>
                <div className="tier-label">{t.label}</div>
                <h3>{t.title}</h3>
                <p>{t.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="shield-visual">
            <div className="shield-label">// SECURITY GUARANTEES</div>
            {shields.map(g => <div key={g} className="shield-row"><span className="check">✓</span><span>{g}</span></div>)}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const plans = [
  {name:'Starter',price:'199',per:'per month, flat rate',featured:false,features:['Up to 10 team members','1 AI agent / knowledge base','Upload PDFs, docs, text files','Website URL ingestion','Chat interface','Smart notes with templates','10GB knowledge base storage','Email support'],cta:'Get Started →',href:'mailto:contact@euranix.com?subject=Starter Plan'},
  {name:'Business',price:'499',per:'per month, flat rate',featured:true,features:['Up to 50 team members','5 AI agents with custom personas','Everything in Starter','Database connection (MySQL/Postgres)','Voice interface (speak + listen)','Website chat widget','Daily auto-sync from S3 / DB','50GB knowledge base storage','Chat history + analytics','Share specific answers with team','Priority support'],cta:'Start Free Trial →',href:'https://platform.euranix.ai'},
  {name:'Enterprise',price:null,per:'tailored to your business',featured:false,features:['Unlimited team members','Unlimited AI agents','Everything in Business','Private LLM hosting — data never leaves','Legacy software integration','White-label option','On-premise deployment','Custom AI agent development','Dedicated account manager','SLA + 24/7 support'],cta:'Contact Us →',href:'mailto:contact@euranix.com?subject=Enterprise'},
];

function Pricing() {
  return (
    <section className="pricing" id="pricing">
      <Reveal><div className="section-label">// Pricing</div></Reveal>
      <Reveal delay={0.1}><h2>SIMPLE,<br/><span className="red">HONEST</span> PRICING</h2></Reveal>
      <Reveal delay={0.15}><p className="section-sub">No per-user fees. No surprise charges. Pay a flat monthly fee based on what your business needs.</p></Reveal>
      <div className="pricing-grid">
        {plans.map((p,i) => (
          <Reveal key={p.name} delay={i*0.1}>
            <div className={`price-card ${p.featured?'featured':''}`}>
              {p.featured && <div className="popular-badge">MOST POPULAR</div>}
              <div className="plan-name">{p.name}</div>
              {p.price ? <div className="plan-price"><sup>$</sup>{p.price}</div> : <div className="plan-price custom">Custom</div>}
              <div className="plan-per">{p.per}</div>
              <ul className="plan-features">{p.features.map(f => <li key={f}><span className="check">✓</span>{f}</li>)}</ul>
              <a href={p.href} className={`plan-btn ${p.featured?'primary':'outline'}`}>{p.cta}</a>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.2}>
        <div className="pricing-note">
          <p><strong>Not sure which plan is right?</strong><br/>Tell us about your business and we'll recommend the best fit.</p>
          <a href="mailto:contact@euranix.com?subject=Help Me Choose">Talk to us → contact@euranix.com</a>
        </div>
      </Reveal>
    </section>
  );
}

function CTA() {
  return (
    <section className="cta-section">
      <div className="cta-orb"/>
      <Reveal><div className="section-label" style={{justifyContent:'center',display:'flex'}}>// Get Started Today</div></Reveal>
      <Reveal delay={0.1}><h2>READY TO MAKE<br/>YOUR BUSINESS<br/><span className="red">SMARTER?</span></h2></Reveal>
      <Reveal delay={0.15}><p>Upload your first document and ask your AI a question — in under 5 minutes. No credit card required.</p></Reveal>
      <Reveal delay={0.2}>
        <div className="cta-actions">
          <a href="https://platform.euranix.ai" className="btn-primary" style={{fontSize:16,padding:'18px 40px'}}>Start Free Trial →</a>
          <a href="mailto:contact@euranix.com?subject=Demo Request" className="btn-secondary" style={{fontSize:16,padding:'18px 40px'}}>Book a Demo</a>
        </div>
        <div className="contact-row">
          <a href="mailto:contact@euranix.com" className="contact-chip">✉️ contact@euranix.com</a>
          <a href="https://www.euranix.com" className="contact-chip">🌐 euranix.com</a>
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  const links = [['Benefits','#outcomes'],['Use Cases','#usecases'],['Features','#features'],['Privacy','#privacy'],['Pricing','#pricing'],['Euranix.com','https://www.euranix.com'],['Contact','mailto:contact@euranix.com']];
  return (
    <footer>
      <div className="footer-logo">EURANIX<span className="red">.</span>AI</div>
      <div className="footer-links">{links.map(([l,h]) => <a key={l} href={h}>{l}</a>)}</div>
      <div className="footer-copy">© 2025 EURANIX TECHNOLOGIES</div>
    </footer>
  );
}

export default function App() {
  useEffect(() => {
    const cursor = document.createElement('div'); cursor.className = 'cursor';
    const ring = document.createElement('div'); ring.className = 'cursor-ring';
    document.body.appendChild(cursor); document.body.appendChild(ring);
    let mx=0,my=0,rx=0,ry=0;
    const move = (e: MouseEvent) => { mx=e.clientX; my=e.clientY; cursor.style.left=mx+'px'; cursor.style.top=my+'px'; };
    document.addEventListener('mousemove', move);
    let raf: number;
    const anim = () => { rx+=(mx-rx)*0.12; ry+=(my-ry)*0.12; ring.style.left=rx+'px'; ring.style.top=ry+'px'; raf=requestAnimationFrame(anim); };
    anim();
    return () => { document.removeEventListener('mousemove',move); cancelAnimationFrame(raf); cursor.remove(); ring.remove(); };
  }, []);
  return (
    <div className="app">
      <Nav/><Hero/><Outcomes/><UseCases/><Features/><IntegrationStrip/><Privacy/><Pricing/><CTA/><Footer/>
    </div>
  );
}
