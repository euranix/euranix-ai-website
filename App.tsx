import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';

/* Intersection reveal */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.08 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0) scale(1)' : 'translateY(48px) scale(0.97)',
      transition: `opacity 0.75s ${delay}s cubic-bezier(.16,1,.3,1), transform 0.75s ${delay}s cubic-bezier(.16,1,.3,1)`
    }}>{children}</div>
  );
}

/* 3-D mouse tilt */
function useTilt(strength = 12) {
  const ref = useRef<HTMLDivElement>(null);
  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const r  = el.getBoundingClientRect();
    const x  = (e.clientX - r.left) / r.width  - 0.5;
    const y  = (e.clientY - r.top)  / r.height - 0.5;
    el.style.transform  = `perspective(1000px) rotateY(${x * strength}deg) rotateX(${-y * strength}deg) scale3d(1.03,1.03,1.03)`;
    el.style.transition = 'transform 0.08s linear';
    /* move shine overlay */
    const shine = el.querySelector<HTMLElement>('.card-shine');
    if (shine) { shine.style.background = `radial-gradient(circle at ${(x+0.5)*100}% ${(y+0.5)*100}%, rgba(255,255,255,0.08) 0%, transparent 55%)`; }
  }, [strength]);
  const handleLeave = useCallback(() => {
    const el = ref.current; if (!el) return;
    el.style.transform  = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)';
    el.style.transition = 'transform 0.6s cubic-bezier(.16,1,.3,1)';
    const shine = el.querySelector<HTMLElement>('.card-shine');
    if (shine) shine.style.background = 'none';
  }, []);
  return { ref, handleMove, handleLeave };
}
function TiltCard({ children, className = '', strength = 10 }: { children: React.ReactNode; className?: string; strength?: number }) {
  const { ref, handleMove, handleLeave } = useTilt(strength);
  return <div ref={ref} className={className} onMouseMove={handleMove} onMouseLeave={handleLeave}>{children}</div>;
}

/* Particle / constellation canvas */
function ParticleCanvas() {
  const cnv = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = cnv.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    const pts = Array.from({ length: 90 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.6 + 0.3,
    }));
    let raf: number; let mx = -9999; let my = -9999;
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener('mousemove', onMove);
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(230,57,70,0.6)'; ctx.fill();
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x; const dy = pts[i].y - pts[j].y;
          const d  = Math.hypot(dx, dy);
          if (d < 130) {
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(230,57,70,${(1 - d / 130) * 0.16})`;
            ctx.lineWidth = 0.7; ctx.stroke();
          }
        }
        const dx = pts[i].x - mx; const dy = pts[i].y - my;
        const d  = Math.hypot(dx, dy);
        if (d < 170) {
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(mx, my);
          ctx.strokeStyle = `rgba(255,100,55,${(1 - d / 170) * 0.5})`;
          ctx.lineWidth = 1.1; ctx.stroke();
        }
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('mousemove', onMove); };
  }, []);
  return <canvas ref={cnv} className="particle-canvas" />;
}

/* Typewriter */
function Typewriter({ text, speed = 50 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => { if (i < text.length) { setDisplayed(text.slice(0, ++i)); } else { clearInterval(iv); setDone(true); } }, speed);
    return () => clearInterval(iv);
  }, [text, speed]);
  return <span>{displayed}{!done && <span className="caret">|</span>}</span>;
}

/* SVG icon set — avoids all emoji encoding issues */
const ICONS: Record<string, React.ReactNode> = {
  search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
  bot:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M12 11V7m-4 4V9m8 2V9"/><circle cx="9" cy="15" r="1" fill="currentColor"/><circle cx="15" cy="15" r="1" fill="currentColor"/></svg>,
  lock:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  chat:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  mic:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
  zap:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  upload: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  db:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
  note:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  share:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  chart:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  sync:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  shield: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  check:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  star:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
};
function Icon({ name, size = 20 }: { name: string; size?: number }) {
  return <span className="icon-wrap" style={{ width: size, height: size, flexShrink: 0 }}>{ICONS[name]}</span>;
}

/* ── Nav ── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h);
  }, []);
  const links: [string, string][] = [
    ['Benefits', '#outcomes'], ['How It Works', '#howitworks'],
    ['Use Cases', '#usecases'], ['Pricing', '#pricing'],
    ['Euranix.com', 'https://www.euranix.com'],
  ];
  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <a href="/" className="nav-logo">EURANIX<span className="red">.</span>AI</a>
        <div className="nav-links">
          {links.map(([l, h]) => (
            <a key={l} href={h} className={activeSection === h ? 'active' : ''} onClick={() => setActiveSection(h)}>{l}</a>
          ))}
        </div>
        <a href="https://platform.euranix.ai" className="nav-cta">Get Started &rarr;</a>
        <button className="hamburger" aria-label="Menu" onClick={() => setOpen(true)}><span /><span /><span /></button>
      </nav>
      {open && (
        <div className="mobile-menu">
          <button className="mobile-close" onClick={() => setOpen(false)}>&#x2715;</button>
          {links.map(([l, h]) => <a key={l} href={h} onClick={() => setOpen(false)}>{l}</a>)}
          <a href="https://platform.euranix.ai" onClick={() => setOpen(false)} className="btn-primary">Get Started &rarr;</a>
        </div>
      )}
    </>
  );
}

/* ── Hero chat preview ── */
function HeroChatPreview() {
  const msgs = [
    { who: 'user', text: "What's our refund policy for EU customers?" },
    { who: 'ai',   text: "EU customers have 30 days for a full refund. No questions asked. Returns shipped at company expense per your Jan 2025 policy doc..." },
    { who: 'user', text: "Summarise last week's board meeting" },
  ];
  const [step, setStep] = useState(0);
  const tilt = useTilt(8);
  useEffect(() => {
    if (step >= msgs.length) return;
    const t = setTimeout(() => setStep(s => s + 1), step === 0 ? 900 : 2400);
    return () => clearTimeout(t);
  }, [step, msgs.length]);
  return (
    <div className="hero-preview" ref={tilt.ref} onMouseMove={tilt.handleMove} onMouseLeave={tilt.handleLeave}>
      <div className="card-shine" />
      <div className="preview-glow" />
      <div className="preview-bar">
        <span className="pd red-dot" /><span className="pd ylw-dot" /><span className="pd grn-dot" />
        <span className="preview-title">euranix.ai &nbsp;/&nbsp; knowledge-base</span>
        <span className="preview-status"><span className="live-dot"/>LIVE</span>
      </div>
      <div className="preview-body">
        {msgs.slice(0, step).map((m, i) => (
          <div key={i} className={`preview-msg ${m.who}`}>
            <span className="preview-avatar">{m.who === 'user' ? 'U' : 'AI'}</span>
            <div className="preview-bubble">
              <span className="preview-label">{m.who === 'user' ? 'You' : 'Euranix AI'}</span>
              <span className="preview-text">
                {i === step - 1 && m.who === 'user' ? <Typewriter text={m.text} speed={38} /> : m.text}
              </span>
            </div>
          </div>
        ))}
        {step < msgs.length && (
          <div className="preview-msg ai">
            <span className="preview-avatar">AI</span>
            <div className="preview-bubble"><div className="preview-thinking"><span /><span /><span /></div></div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Hero ── */
function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = heroRef.current; if (!el) return;
    const mv = (e: MouseEvent) => {
      el.style.setProperty('--mx', `${(e.clientX / window.innerWidth  - 0.5) * 20}px`);
      el.style.setProperty('--my', `${(e.clientY / window.innerHeight - 0.5) * 12}px`);
    };
    window.addEventListener('mousemove', mv); return () => window.removeEventListener('mousemove', mv);
  }, []);
  const stats: [string, string][] = [['5min','First AI answer'],['100%','Your data, your control'],['10+','Data sources'],['24/7','AI availability']];
  return (
    <section className="hero" ref={heroRef} style={{ '--mx': '0px', '--my': '0px' } as React.CSSProperties}>
      <ParticleCanvas />
      <div className="hero-grid" />
      <div className="orb orb1" /><div className="orb orb2" /><div className="orb orb3" /><div className="orb orb4" />
      <div className="hero-layout">
        <div className="hero-inner">
          <div className="hero-badge"><span className="badge-dot" />NOW AVAILABLE &mdash; EURANIX AI</div>
          <h1>YOUR BUSINESS<br /><span className="gradient-text">INTELLIGENCE</span><br /><span className="outline">UNLOCKED</span></h1>
          <p className="hero-sub">Turn your documents, databases, notes, and team knowledge into an AI that <strong>answers questions</strong>, <strong>supports customers</strong>, and <strong>works the way you do</strong> &mdash; with complete privacy.</p>
          <div className="hero-actions">
            <a href="https://platform.euranix.ai" className="btn-primary">Start Free Trial &nbsp;&rarr;</a>
            <a href="mailto:contact@euranix.com?subject=Demo Request" className="btn-secondary">Book a Demo</a>
          </div>
          <div className="hero-stats">
            {stats.map(([n, l]) => (
              <div key={l} className="stat-item">
                <div className="stat-num">{n}</div>
                <div className="stat-label">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-visual-col"><HeroChatPreview /></div>
      </div>
      <div className="hero-scroll-hint">
        <div className="scroll-mouse"><div className="scroll-wheel" /></div>
        <span>scroll to explore</span>
      </div>
    </section>
  );
}

/* ── Outcomes ── */
const outcomes = [
  { icon: 'search', title: 'Find Any Answer Instantly',   desc: 'Ask in plain English. Get accurate answers from your own documents, databases, and notes &mdash; in seconds, not hours.' },
  { icon: 'bot',    title: 'AI That Knows Your Business', desc: 'Not a generic chatbot. An AI trained on your products, processes, and history that speaks your language and context.' },
  { icon: 'lock',   title: 'Your Data Never Leaves',      desc: 'Your business data is never used to train public models. Choose cloud or fully private hosting &mdash; your call.' },
  { icon: 'chat',   title: 'Support Customers 24/7',      desc: 'Add an AI chat widget to your website. Customers get instant answers from your knowledge base &mdash; even at midnight.' },
  { icon: 'mic',    title: 'Talk To Your AI',             desc: 'Not a fan of typing? Just speak. Euranix AI listens, understands, and responds &mdash; in voice or text.' },
  { icon: 'zap',    title: 'Works With What You Have',    desc: 'Connects to your existing software, databases, and files. No migration, no disruption. Your data stays where it is.' },
];
function Outcomes() {
  return (
    <section className="outcomes" id="outcomes">
      <Reveal><div className="section-label">// Why Euranix AI</div></Reveal>
      <Reveal delay={0.08}><h2>STOP LOSING TIME<br />TO <span className="gradient-text">INFORMATION CHAOS</span></h2></Reveal>
      <Reveal delay={0.14}><p className="section-sub">Your team wastes hours every week searching for answers that already exist in your business. Euranix AI fixes that.</p></Reveal>
      <div className="outcomes-grid">
        {outcomes.map((o, i) => (
          <Reveal key={o.title} delay={i * 0.07}>
            <TiltCard className="outcome-card">
              <div className="card-shine" />
              <div className="outcome-icon"><Icon name={o.icon} size={22} /></div>
              <h3>{o.title}</h3>
              <p dangerouslySetInnerHTML={{ __html: o.desc }} />
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── How It Works ── */
const steps = [
  { n: '01', title: 'Connect Your Knowledge',   desc: 'Upload PDFs, Word docs, spreadsheets, connect your database, paste website URLs &mdash; anything your business knows.', note: 'Supports 10+ data sources' },
  { n: '02', title: 'Your AI Learns Instantly',  desc: 'Euranix processes and indexes your content. Your private AI is trained on your specific business context &mdash; no generic responses.', note: 'Ready in under 5 minutes' },
  { n: '03', title: 'Ask Anything, Anytime',     desc: 'Your team asks in plain English and gets precise, sourced answers. Embed a chat widget on your site for customers too.', note: 'Voice & text support' },
];
function HowItWorks() {
  return (
    <section className="hiw" id="howitworks">
      <Reveal><div className="section-label">// How It Works</div></Reveal>
      <Reveal delay={0.08}><h2>UP AND RUNNING<br /><span className="gradient-text">IN 5 MINUTES</span></h2></Reveal>
      <Reveal delay={0.14}><p className="section-sub">No technical setup. No data migration. No AI experts needed. Just connect, train, and ask.</p></Reveal>
      <div className="steps-grid">
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.12}>
            <TiltCard className="step-card" strength={7}>
              <div className="card-shine" />
              <div className="step-number">{s.n}</div>
              <h3>{s.title}</h3>
              <p dangerouslySetInnerHTML={{ __html: s.desc }} />
              <div className="step-note"><Icon name="check" size={14} />{s.note}</div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── Use Cases ── */
const ucards = [
  { tag: 'CUSTOMER SUPPORT',  title: 'AI Chat Widget on Your Website',   desc: 'Embed a branded AI assistant. It answers customer questions using your product docs, FAQs, and support history &mdash; 24/7.',    list: ['Instant answers from your knowledge base', 'Escalates to human when needed', 'Branded with your colors and name', 'Works on any website or app'] },
  { tag: 'DATA & ANALYTICS',  title: 'Ask Questions Over Your Database', desc: 'Connect your business database and ask plain English questions. No SQL needed. Get answers from live operational data.',            list: ['"What were our top products last month?"', '"Show pending orders over $500"', 'Works with MySQL, PostgreSQL, and more'] },
  { tag: 'LEGACY INTEGRATION',title: 'Add AI to Existing Software',       desc: 'Already using custom-built software? We integrate Euranix AI directly into your existing systems &mdash; no rebuild required.',    list: ['API integration into any software', 'Embedded chat in your existing apps', 'We handle the full technical integration'] },
  { tag: 'CUSTOM USE CASE',   title: "Don't See Your Use Case?",          desc: "Every business is different &mdash; clinics, logistics, law firms. Talk to us and we'll build the right AI solution.",              list: ['HR policy assistant for large teams', 'Contract review and summarization', 'Multilingual customer support'] },
];
function UseCases() {
  return (
    <section id="usecases" className="usecases-section">
      <Reveal><div className="section-label">// Real World Use Cases</div></Reveal>
      <Reveal delay={0.08}><h2>BUILT FOR<br /><span className="gradient-text">REAL BUSINESS</span></h2></Reveal>
      <Reveal delay={0.14}><p className="section-sub">Whether you run a clinic, a retail chain, a law firm, or a software company &mdash; Euranix AI works for your team.</p></Reveal>
      <div className="usecases-wrap">
        <Reveal delay={0.1}>
          <TiltCard className="usecase-card featured" strength={5}>
            <div className="card-shine" />
            <div>
              <span className="usecase-tag">MOST POPULAR</span>
              <h3>Team Knowledge Base + Smart Notes</h3>
              <p>Your team creates notes, uploads documents, writes SOPs &mdash; and anyone can ask the AI and get instant answers. New staff onboard in hours, not weeks.</p>
              <ul className="usecase-list">
                <li>Upload PDFs, Word docs, spreadsheets, and more</li>
                <li>Structured notes with AI-powered templates</li>
                <li>Ask in plain English, get precise answers</li>
                <li>Share specific answers with teammates &mdash; not everything</li>
                <li>Voice input &mdash; speak your question, hear the answer</li>
              </ul>
            </div>
            <div className="usecase-visual">
              <div className="visual-label">// LIVE DEMO</div>
              <div className="prompt">You: What's our warranty policy for international orders?</div>
              <br />
              <div className="ai-response">AI: Based on your policy document (updated March 2025), international orders carry a 12-month warranty. Replacements sent within 14 business days...</div>
              <br />
              <div className="prompt">You: <Typewriter text="Can you summarize last week's team meeting?" /></div>
            </div>
          </TiltCard>
        </Reveal>
        <div className="usecase-grid-2">
          {ucards.map((uc, i) => (
            <Reveal key={uc.tag} delay={i * 0.08}>
              <TiltCard className="usecase-card">
                <div className="card-shine" />
                <span className="usecase-tag">{uc.tag}</span>
                <h3>{uc.title}</h3>
                <p dangerouslySetInnerHTML={{ __html: uc.desc }} />
                <ul className="usecase-list">{uc.list.map(l => <li key={l} dangerouslySetInnerHTML={{ __html: l }} />)}</ul>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Features ── */
const feats = [
  { icon: 'upload', title: 'Upload Anything',          desc: 'PDFs, Word docs, Excel, plain text, markdown, website URLs &mdash; upload once, query forever.' },
  { icon: 'db',     title: 'Database Connection',       desc: 'Connect MySQL or PostgreSQL. Ask plain English questions, get real-time answers from live data.' },
  { icon: 'note',   title: 'Smart Notes',               desc: 'Create notes with AI-powered templates. Meeting notes, SOPs, project briefs &mdash; structured and searchable.' },
  { icon: 'mic',    title: 'Voice Interface',           desc: 'Speak your question, hear the answer. Full voice interaction &mdash; hands-free AI for busy teams.' },
  { icon: 'chat',   title: 'Embeddable Chat Widget',    desc: 'One line of code adds your AI assistant to any website. Branded, customizable, powered by your knowledge.' },
  { icon: 'share',  title: 'Share Specific Answers',    desc: 'Share a specific AI response with a teammate without giving access to your entire knowledge base.' },
  { icon: 'chart',  title: 'Analytics & History',       desc: 'Every conversation stored and searchable. See what your team asks most and where knowledge gaps exist.' },
  { icon: 'bot',    title: 'Custom AI Agents',          desc: 'Create different agents for support, sales, HR &mdash; all powered from one unified platform.' },
  { icon: 'sync',   title: 'Auto-Sync Your Data',       desc: 'Connect S3 or your database and set daily sync. Your AI knowledge base stays current automatically.' },
];
function Features() {
  return (
    <section className="features" id="features">
      <Reveal><div className="section-label">// Platform Features</div></Reveal>
      <Reveal delay={0.08}><h2>EVERYTHING YOUR<br />TEAM <span className="gradient-text">NEEDS</span></h2></Reveal>
      <Reveal delay={0.14}><p className="section-sub">One platform. Multiple ways to use AI. Built for teams that want results, not complexity.</p></Reveal>
      <div className="features-grid">
        {feats.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.05}>
            <TiltCard className="feature-card">
              <div className="card-shine" />
              <div className="feature-icon"><Icon name={f.icon} size={24} /></div>
              <h3>{f.title}</h3>
              <p dangerouslySetInnerHTML={{ __html: f.desc }} />
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── Integration Strip ── */
const chips = ['PDF Files','Excel / CSV','Word Documents','MySQL','PostgreSQL','Websites','Audio Files','Video Recordings','AWS S3','Markdown Notes','Database Backups','Any Text File'];
function IntegrationStrip() {
  const t = [...chips, ...chips, ...chips];
  return (
    <div className="int-section">
      <p className="int-label">WORKS WITH YOUR EXISTING TOOLS</p>
      <div className="int-strip"><div className="int-inner">{t.map((c, i) => <div key={i} className="int-chip">{c}</div>)}</div></div>
    </div>
  );
}

/* ── Privacy ── */
function Privacy() {
  const tiers = [
    { label: 'TIER 1 &mdash; STANDARD',         title: 'Cloud Hosted, Data Isolated', desc: 'Your data is completely isolated. AI queries use OpenAI &mdash; never stored or used for training per their enterprise policy.', active: false },
    { label: 'TIER 2 &mdash; ENHANCED PRIVACY',  title: 'Your Own Private AI',         desc: 'We host an open-source LLM on your dedicated server. Your data never touches OpenAI or any third party. 100% private.',            active: true },
    { label: 'TIER 3 &mdash; FULL CONTROL',      title: 'On-Premise Deployment',       desc: 'Everything runs on your own infrastructure. We set it up, manage it, and support it. Your data never leaves your building.',         active: false },
  ];
  const shields = ['Data never used to train public AI models','Complete tenant isolation &mdash; your data is yours only','Private LLM hosting available on request','All data encrypted at rest and in transit','Audit logs &mdash; every query, every access tracked','Token usage limits to control costs per user','We manage hosting, updates, and backups','GDPR and data residency options available'];
  return (
    <section className="privacy" id="privacy">
      <Reveal><div className="section-label">// Privacy &amp; Security</div></Reveal>
      <Reveal delay={0.08}><h2>YOUR DATA STAYS<br /><span className="gradient-text">YOURS. ALWAYS.</span></h2></Reveal>
      <Reveal delay={0.14}><p className="section-sub">We built Euranix AI for businesses that cannot afford to have their data shared, leaked, or used to train public AI models.</p></Reveal>
      <div className="privacy-grid">
        <Reveal delay={0.1}>
          <div className="privacy-tiers">
            {tiers.map(t => (
              <TiltCard key={t.title} className={`privacy-tier ${t.active ? 'active' : ''}`} strength={6}>
                <div className="card-shine" />
                <div className="tier-label" dangerouslySetInnerHTML={{ __html: t.label }} />
                <h3>{t.title}</h3>
                <p dangerouslySetInnerHTML={{ __html: t.desc }} />
              </TiltCard>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="shield-visual">
            <div className="shield-label">// SECURITY GUARANTEES</div>
            {shields.map((g, i) => (
              <div key={i} className="shield-row">
                <span className="shield-check"><Icon name="check" size={13} /></span>
                <span dangerouslySetInnerHTML={{ __html: g }} />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Testimonials ── */
const testimonials = [
  { quote: 'We onboarded 6 new staff in one week &mdash; they were productive immediately because the AI answered every question from our SOPs.', name: 'Markus L.', role: 'Operations Director, Logistics Firm',      initials: 'ML' },
  { quote: 'Support tickets dropped 40% in the first month. The chat widget handles common questions and customers love the instant answers.',     name: 'Sarah K.',  role: 'Head of Customer Experience, E-commerce', initials: 'SK' },
  { quote: 'I was sceptical about AI privacy. Running our own private LLM through Euranix meant zero data left our servers. Game changer.',        name: 'David R.',  role: 'CTO, Healthcare Provider',               initials: 'DR' },
];
function Testimonials() {
  return (
    <section className="testimonials-section">
      <Reveal><div className="section-label">// Customer Stories</div></Reveal>
      <Reveal delay={0.08}><h2>TEAMS LOVE<br /><span className="gradient-text">EURANIX AI</span></h2></Reveal>
      <div className="testimonials-grid">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.1}>
            <TiltCard className="testimonial-card">
              <div className="card-shine" />
              <div className="quote-icon"><Icon name="chat" size={18} /></div>
              <p className="quote-text" dangerouslySetInnerHTML={{ __html: t.quote }} />
              <div className="quote-author">
                <div className="author-avatar">{t.initials}</div>
                <div><div className="author-name">{t.name}</div><div className="author-role">{t.role}</div></div>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── Pricing ── */
const plans = [
  { name: 'Starter',    price: '199', per: 'per month, flat rate',       featured: false, features: ['Up to 10 team members', '1 AI agent / knowledge base', 'Upload PDFs, docs, text files', 'Website URL ingestion', 'Chat interface', 'Smart notes with templates', '10GB knowledge base storage', 'Email support'],                                                                                                cta: 'Get Started',      href: 'mailto:contact@euranix.com?subject=Starter Plan' },
  { name: 'Business',   price: '499', per: 'per month, flat rate',       featured: true,  features: ['Up to 50 team members', '5 AI agents with custom personas', 'Everything in Starter', 'Database connection (MySQL / Postgres)', 'Voice interface (speak + listen)', 'Website chat widget', 'Daily auto-sync from S3 / DB', '50GB storage + analytics', 'Share answers with team', 'Priority support'],         cta: 'Start Free Trial', href: 'https://platform.euranix.ai' },
  { name: 'Enterprise', price: null,  per: 'tailored to your business',  featured: false, features: ['Unlimited team members', 'Unlimited AI agents', 'Everything in Business', 'Private LLM hosting', 'Legacy software integration', 'White-label option', 'On-premise deployment', 'Dedicated account manager', 'SLA + 24/7 support'],                                                                             cta: 'Contact Us',       href: 'mailto:contact@euranix.com?subject=Enterprise' },
];
function Pricing() {
  return (
    <section className="pricing" id="pricing">
      <Reveal><div className="section-label">// Pricing</div></Reveal>
      <Reveal delay={0.08}><h2>SIMPLE,<br /><span className="gradient-text">HONEST</span> PRICING</h2></Reveal>
      <Reveal delay={0.14}><p className="section-sub">No per-user fees. No surprise charges. Pay a flat monthly fee based on what your business needs.</p></Reveal>
      <div className="pricing-grid">
        {plans.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.1}>
            <TiltCard className={`price-card ${p.featured ? 'featured' : ''}`} strength={8}>
              <div className="card-shine" />
              {p.featured && <div className="popular-badge">MOST POPULAR</div>}
              <div className="plan-name">{p.name}</div>
              {p.price ? <div className="plan-price"><sup>$</sup>{p.price}</div> : <div className="plan-price custom">Custom</div>}
              <div className="plan-per">{p.per}</div>
              <ul className="plan-features">
                {p.features.map(f => <li key={f}><span className="plan-check"><Icon name="check" size={13} /></span>{f}</li>)}
              </ul>
              <a href={p.href} className={`plan-btn ${p.featured ? 'primary' : 'outline'}`}>{p.cta} &rarr;</a>
            </TiltCard>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.2}>
        <div className="pricing-note">
          <p><strong>Not sure which plan is right?</strong><br />Tell us about your business and we will recommend the best fit.</p>
          <a href="mailto:contact@euranix.com?subject=Help Me Choose">Talk to us &rarr; contact@euranix.com</a>
        </div>
      </Reveal>
    </section>
  );
}

/* ── CTA ── */
function CTA() {
  return (
    <section className="cta-section">
      <div className="cta-orb" /><div className="cta-orb2" />
      <Reveal><div className="section-label" style={{ justifyContent: 'center', display: 'flex' }}>// Get Started Today</div></Reveal>
      <Reveal delay={0.08}><h2>READY TO MAKE<br />YOUR BUSINESS<br /><span className="gradient-text">SMARTER?</span></h2></Reveal>
      <Reveal delay={0.14}><p>Upload your first document and ask your AI a question &mdash; in under 5 minutes. No credit card required.</p></Reveal>
      <Reveal delay={0.2}>
        <div className="cta-actions">
          <a href="https://platform.euranix.ai" className="btn-primary btn-xl">Start Free Trial &nbsp;&rarr;</a>
          <a href="mailto:contact@euranix.com?subject=Demo Request" className="btn-secondary btn-xl">Book a Demo</a>
        </div>
        <div className="contact-row">
          <a href="mailto:contact@euranix.com" className="contact-chip">contact@euranix.com</a>
          <a href="https://www.euranix.com" className="contact-chip">euranix.com</a>
        </div>
      </Reveal>
    </section>
  );
}

/* ── Footer ── */
function Footer() {
  const links: [string, string][] = [['Benefits','#outcomes'],['How It Works','#howitworks'],['Use Cases','#usecases'],['Features','#features'],['Privacy','#privacy'],['Pricing','#pricing'],['Euranix.com','https://www.euranix.com'],['Contact','mailto:contact@euranix.com']];
  return (
    <footer>
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-logo">EURANIX<span className="red">.</span>AI</div>
          <p className="footer-tagline">Turn your business knowledge into AI that works for you.</p>
        </div>
        <div className="footer-links-grid">{links.map(([l, h]) => <a key={l} href={h}>{l}</a>)}</div>
      </div>
      <div className="footer-bottom">
        <div className="footer-copy">&copy; 2025 EURANIX TECHNOLOGIES. ALL RIGHTS RESERVED.</div>
        <div className="footer-legal">
          <a href="mailto:contact@euranix.com">Privacy Policy</a>
          <a href="mailto:contact@euranix.com">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

/* ── App root ── */
export default function App() {
  useEffect(() => {
    const cursor = document.createElement('div'); cursor.className = 'cursor';
    const ring   = document.createElement('div'); ring.className   = 'cursor-ring';
    document.body.appendChild(cursor);
    document.body.appendChild(ring);
    let mx = 0, my = 0, rx = 0, ry = 0;
    const move = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'; };
    document.addEventListener('mousemove', move);
    let raf: number;
    const anim = () => { rx += (mx - rx) * 0.14; ry += (my - ry) * 0.14; ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; raf = requestAnimationFrame(anim); };
    anim();
    const enter = () => { cursor.classList.add('hovered'); ring.classList.add('hovered'); };
    const leave = () => { cursor.classList.remove('hovered'); ring.classList.remove('hovered'); };
    document.querySelectorAll('a,button').forEach(el => { el.addEventListener('mouseenter', enter); el.addEventListener('mouseleave', leave); });
    return () => { document.removeEventListener('mousemove', move); cancelAnimationFrame(raf); cursor.remove(); ring.remove(); };
  }, []);
  return (
    <div className="app">
      <Nav /><Hero /><Outcomes /><HowItWorks /><UseCases /><Features /><IntegrationStrip /><Privacy /><Testimonials /><Pricing /><CTA /><Footer />
    </div>
  );
}
