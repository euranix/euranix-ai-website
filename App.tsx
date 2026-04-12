import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import logoUrl from './assets/logo.png';

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
function Typewriter({ text, speed = 50, onDone }: { text: string; speed?: number; onDone?: () => void }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed(''); setDone(false);
    let i = 0;
    const iv = setInterval(() => {
      if (i < text.length) { setDisplayed(text.slice(0, ++i)); }
      else { clearInterval(iv); setDone(true); onDone?.(); }
    }, speed);
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
        <a href="/" className="nav-logo"><img src={logoUrl} alt="Euranix AI" className="nav-logo-img" /><span className="nav-logo-ai"><span className="red">.</span>AI</span></a>
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
const EXCHANGES = [
  {
    user: "What's our refund policy for EU customers?",
    ai:   "EU customers get a full refund within 30 days — no questions asked. Returns are shipped at company expense, per your Jan 2025 policy doc."
  },
  {
    user: "Summarise last week's board meeting",
    ai:   "Key decisions: Q2 budget approved at $2.4M, 4 engineering hires greenlit. Action items assigned to Sarah (ops) and the Dev leads."
  },
];

type ChatPhase = 'pause' | 'user-typing' | 'ai-thinking' | 'ai-typing';

function HeroChatPreview() {
  const [exchIdx,   setExchIdx]   = useState(0);
  const [phase,     setPhase]     = useState<ChatPhase>('pause');
  const [history,   setHistory]   = useState<{who:string;text:string}[]>([]);
  const tilt = useTilt(6);

  /* advance through phases */
  useEffect(() => {
    let tm: ReturnType<typeof setTimeout>;
    if (phase === 'pause')       tm = setTimeout(() => setPhase('user-typing'), exchIdx === 0 ? 900 : 500);
    if (phase === 'ai-thinking') tm = setTimeout(() => setPhase('ai-typing'),   1800);
    return () => clearTimeout(tm);
  }, [phase, exchIdx]);

  const onUserDone = useCallback(() => {
    setHistory(h => [...h, { who:'user', text: EXCHANGES[exchIdx].user }]);
    setTimeout(() => setPhase('ai-thinking'), 250);
  }, [exchIdx]);

  const onAiDone = useCallback(() => {
    setHistory(h => [...h, { who:'ai', text: EXCHANGES[exchIdx].ai }]);
    const next = (exchIdx + 1) % EXCHANGES.length;
    setTimeout(() => {
      if (next === 0) setHistory([]);
      setExchIdx(next);
      setPhase('pause');
    }, 2800);
  }, [exchIdx]);

  return (
    <div className="hero-preview" ref={tilt.ref} onMouseMove={tilt.handleMove} onMouseLeave={tilt.handleLeave}>
      <div className="card-shine" />
      <div className="preview-glow" />
      {/* title bar */}
      <div className="preview-bar">
        <span className="pd red-dot" /><span className="pd ylw-dot" /><span className="pd grn-dot" />
        <span className="preview-title">euranix.ai &nbsp;/&nbsp; knowledge-base</span>
        <span className="preview-status"><span className="live-dot" />LIVE</span>
      </div>
      {/* messages */}
      <div className="preview-body">
        {history.map((m, i) => (
          <div key={i} className={`preview-msg ${m.who}`}>
            <span className="preview-avatar">{m.who === 'user' ? 'U' : 'AI'}</span>
            <div className="preview-bubble">
              <span className="preview-label">{m.who === 'user' ? 'You' : 'Euranix AI'}</span>
              <span className="preview-text">{m.text}</span>
            </div>
          </div>
        ))}

        {phase === 'user-typing' && (
          <div className="preview-msg user" key={`ut-${exchIdx}`}>
            <span className="preview-avatar">U</span>
            <div className="preview-bubble">
              <span className="preview-label">You</span>
              <span className="preview-text"><Typewriter key={exchIdx} text={EXCHANGES[exchIdx].user} speed={40} onDone={onUserDone} /></span>
            </div>
          </div>
        )}

        {phase === 'ai-thinking' && (
          <div className="preview-msg ai">
            <span className="preview-avatar">AI</span>
            <div className="preview-bubble">
              <span className="preview-label">Euranix AI</span>
              <div className="preview-thinking"><span /><span /><span /></div>
            </div>
          </div>
        )}

        {phase === 'ai-typing' && (
          <div className="preview-msg ai" key={`at-${exchIdx}`}>
            <span className="preview-avatar">AI</span>
            <div className="preview-bubble">
              <span className="preview-label">Euranix AI</span>
              <span className="preview-text"><Typewriter key={`ai-${exchIdx}`} text={EXCHANGES[exchIdx].ai} speed={22} onDone={onAiDone} /></span>
            </div>
          </div>
        )}
      </div>
      {/* fake input bar */}
      <div className="preview-input-row">
        <span className="preview-input-box">
          {phase === 'user-typing'
            ? <span className="preview-input-hint typing">typing<span className="dot-1">.</span><span className="dot-2">.</span><span className="dot-3">.</span></span>
            : <span className="preview-input-hint">Ask Euranix AI anything&hellip;</span>
          }
        </span>
        <span className="preview-send">&#9166;</span>
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
  const stats: [string, string][] = [['50min','Setup to first answer'],['100%','Managed by Euranix'],['10+','Data sources supported']];
  return (
    <section className="hero" ref={heroRef} style={{ '--mx': '0px', '--my': '0px' } as React.CSSProperties}>
      <ParticleCanvas />
      <div className="hero-grid" />
      <div className="orb orb1" /><div className="orb orb2" /><div className="orb orb3" /><div className="orb orb4" />
      <div className="hero-layout">
        <div className="hero-inner">
          <div className="hero-badge"><span className="badge-dot" />EURANIX AI &mdash; FULLY MANAGED TRANSFORMATION</div>
          <h1><span className="gradient-text">AI-POWERED</span><br />INTELLIGENCE<br />FOR YOUR BUSINESS</h1>
          <p className="hero-sub">Legacy systems, scattered data, no AI team &mdash; <strong>not your problem anymore.</strong><br />Euranix connects your data, builds your private AI, and manages everything. Your team just asks questions.</p>
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
    </section>
  );
}

/* ── Outcomes ── */
const outcomes = [
  { icon: 'zap',    title: 'We Handle Everything',          desc: 'You bring the data, we do the rest. Euranix designs, deploys, and manages your AI &mdash; no technical team required on your end.' },
  { icon: 'db',     title: 'Legacy Software? No Problem',   desc: 'Already running on custom or older systems? We integrate directly into your existing software stack. No rip-and-replace.' },
  { icon: 'search', title: 'Instant Answers From Your Data', desc: 'Your team asks in plain English, your AI answers from your actual documents, databases, and records &mdash; in seconds.' },
  { icon: 'chat',   title: '24/7 Customer Support AI',      desc: 'Embed a branded AI assistant on your website. It handles customer questions around the clock using your own knowledge base.' },
  { icon: 'lock',   title: 'Your Data Stays Private',       desc: 'Nothing leaves your environment without your say. We support fully private, on-premise deployments &mdash; your data, your rules.' },
  { icon: 'bot',    title: 'Built For Your Business',       desc: 'Not a generic tool. Your AI is configured around your industry, your workflows, and your language from day one.' },
];
function Outcomes() {
  return (
    <section className="outcomes" id="outcomes">
      <Reveal><div className="section-label">// Why EURANIX AI</div></Reveal>
      <Reveal delay={0.08}><h2>WE HANDLE THE<br /><span className="gradient-text">ENTIRE TRANSFORMATION</span></h2></Reveal>
      <Reveal delay={0.14}><p className="section-sub">Legacy systems, scattered data, no internal AI team &mdash; none of that is your problem anymore. We come in, we build it, and we keep it running.</p></Reveal>
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
  { n: '01', title: 'We Audit Your Data & Systems', desc: 'We start by understanding your business &mdash; your data sources, existing software, and what your team actually needs answers to.', note: 'Works with your existing stack' },
  { n: '02', title: 'We Build & Deploy Your AI',    desc: 'Euranix connects your data sources, configures your private AI, and deploys it &mdash; cloud or on-premise. You do nothing technical.', note: 'Live in under 50 minutes' },
  { n: '03', title: 'Your Team Just Asks',              desc: 'From day one your team gets precise answers from your own data. Ask by text or voice. We monitor, update, and keep it sharp over time.', note: 'Ongoing managed by Euranix' },
];
function HowItWorks() {
  return (
    <section className="hiw" id="howitworks">
      <Reveal><div className="section-label">// How It Works</div></Reveal>
      <Reveal delay={0.08}><h2>UP AND RUNNING<br /><span className="gradient-text">IN 50 MINUTES</span></h2></Reveal>
      <Reveal delay={0.14}><p className="section-sub">We do the heavy lifting. You get a working AI that understands your business &mdash; without hiring a single data scientist.</p></Reveal>
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
  { tag: 'CUSTOMER SUPPORT',  title: 'AI Support, Live on Your Website', desc: 'We deploy a branded AI assistant directly on your site. It resolves customer queries from your own product docs and history &mdash; zero wait time, 24/7.',  list: ['Trained on your FAQs, docs, and past support tickets', 'Seamlessly escalates complex cases to your team', 'Branded to match your product &mdash; we handle the setup'] },
  { tag: 'DATABASE & ANALYTICS', title: 'Query Your Data in Plain English', desc: 'We connect Euranix to your live database. Your team asks business questions directly &mdash; no SQL, no analysts in the loop for simple queries.',      list: ['"Which customers haven\'t ordered in 90 days?"', '"What\'s our margin on product X this quarter?"', 'Supports MySQL, PostgreSQL, and more'] },
  { tag: 'LEGACY INTEGRATION', title: 'AI Inside Your Existing Software', desc: 'Running on older or custom-built systems? We integrate AI directly into your current software &mdash; via API or embedded chat. No rebuild, no migration.', list: ['Full API integration &mdash; we manage it end-to-end', 'AI embedded inside your existing workflows', 'Works alongside the tools your team already uses'] },
  { tag: 'ANY INDUSTRY',      title: 'Tell Us Your Problem. We\'ll Solve It.', desc: 'Clinics, logistics firms, law offices, manufacturers &mdash; we have worked across industries. Bring us your challenge and we will design the solution.', list: ['Policy and compliance Q&A for regulated industries', 'Contract review and document summarization', 'Internal HR assistants, onboarding bots, and more'] },
];
function UseCases() {
  return (
    <section id="usecases" className="usecases-section">
      <Reveal><div className="section-label">// Real World Use Cases</div></Reveal>
      <Reveal delay={0.08}><h2>BUILT FOR<br /><span className="gradient-text">REAL BUSINESS</span></h2></Reveal>
      <Reveal delay={0.14}><p className="section-sub">Every industry has data trapped in the wrong places. We free it. Here is how Euranix transforms different types of businesses.</p></Reveal>
      <div className="usecases-wrap">
        <Reveal delay={0.1}>
          <TiltCard className="usecase-card featured" strength={5}>
            <div className="card-shine" />
            <div>
              <span className="usecase-tag">MOST POPULAR</span>
              <h3>Your Entire Business Knowledge, Answering Questions</h3>
              <p>We take everything your business knows &mdash; documents, SOPs, meeting notes, policies &mdash; and turn it into an AI your whole team can query instantly. New staff productive in hours, not weeks.</p>
              <ul className="usecase-list">
                <li>We ingest all your existing docs &mdash; no reformatting needed</li>
                <li>AI answers sourced directly from your content, with references</li>
                <li>Ask by voice or text, from any device</li>
                <li>Controlled sharing &mdash; not everyone sees everything</li>
                <li>We maintain and update it as your business evolves</li>
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
  { icon: 'zap',    title: 'Managed Deployment',        desc: 'We deploy, configure, and maintain your AI. No devops, no internal expertise needed &mdash; just results.' },
  { icon: 'db',     title: 'Any Data Source',           desc: 'Databases, documents, legacy systems, cloud storage &mdash; we connect it all. Your data does not need to move.' },
  { icon: 'bot',    title: 'Domain-Specific AI Agents', desc: 'Separate agents for support, ops, HR, and sales &mdash; each trained on the right data, all managed centrally.' },
  { icon: 'chat',   title: 'Website AI Assistant',      desc: 'A branded chat widget on your site, trained on your products. We build it, deploy it, and keep it accurate.' },
  { icon: 'sync',   title: 'Always Up to Date',         desc: 'Auto-sync from your database or S3. As your data changes, your AI stays current &mdash; no manual re-training.' },
  { icon: 'mic',    title: 'Voice & Text',          desc: 'Your team interacts however they prefer &mdash; type a question or speak it. Both work out of the box.' },
  { icon: 'chart',  title: 'Usage Intelligence',        desc: 'See exactly what your team asks, track answer quality, and identify gaps. We use this to continuously improve your AI.' },
  { icon: 'lock',   title: 'Private by Default',        desc: 'Cloud, private cloud, or fully on-premise &mdash; your data never feeds public AI models, ever.' },
  { icon: 'note',   title: 'Structured Knowledge',      desc: 'Beyond Q&A &mdash; create structured SOPs, meeting summaries, and policy docs that are instantly queryable.' },
];
function Features() {
  return (
    <section className="features" id="features">
      <Reveal><div className="section-label">// Platform Features</div></Reveal>
      <Reveal delay={0.08}><h2>EVERYTHING YOUR<br />TEAM <span className="gradient-text">NEEDS</span></h2></Reveal>
      <Reveal delay={0.14}><p className="section-sub">One platform, fully managed by us. Every feature below comes deployed, configured, and maintained by Euranix &mdash; not left on your team to figure out.</p></Reveal>
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
      <p className="int-label">SUPPORTED DATA SOURCES</p>
      <div className="int-strip"><div className="int-inner">{t.map((c, i) => <div key={i} className="int-chip">{c}</div>)}</div></div>
    </div>
  );
}

/* ── Pricing ── */
const plans = [
  { name: 'Starter',    price: '199', per: 'per month, flat rate',       featured: false, features: ['Up to 10 team members', '1 managed AI agent', 'Ingest PDFs, docs, spreadsheets and URLs', 'Chat interface and smart notes', '10GB knowledge base storage', 'Euranix-managed setup and deployment', 'Email support'],                                                                                                cta: 'Get Started',      href: 'mailto:contact@euranix.com?subject=Starter Plan' },
  { name: 'Business',   price: '499', per: 'per month, flat rate',       featured: true,  features: ['Up to 50 team members', '5 AI agents with custom personas', 'Everything in Starter', 'Live database connection (MySQL / Postgres)', 'Voice interface', 'Branded website chat widget', 'Auto-sync from S3 or database', '50GB storage with usage analytics', 'Priority support'],         cta: 'Start Free Trial', href: 'https://platform.euranix.ai' },
  { name: 'Enterprise', price: null,  per: 'tailored to your business',  featured: false, features: ['Unlimited team members and agents', 'Everything in Business', 'Legacy system integration — we handle it all', 'Private or on-premise LLM deployment', 'White-label and custom branding', 'Dedicated Euranix AI account manager', 'SLA-backed 24/7 support'],                                                                             cta: 'Contact Us',       href: 'mailto:contact@euranix.com?subject=Enterprise' },
];
function Pricing() {
  return (
    <section className="pricing" id="pricing">
      <Reveal><div className="section-label">// Pricing</div></Reveal>
      <Reveal delay={0.08}><h2>SIMPLE,<br /><span className="gradient-text">HONEST</span> PRICING</h2></Reveal>
      <Reveal delay={0.14}><p className="section-sub">Flat monthly fee. No per-seat charges, no hidden costs. Every plan includes setup and ongoing management by Euranix.</p></Reveal>
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
    </section>
  );
}

/* ── Footer ── */
function Footer() {
  const links: [string, string][] = [['Benefits','#outcomes'],['How It Works','#howitworks'],['Use Cases','#usecases'],['Features','#features'],['Pricing','#pricing'],['Euranix.com','https://www.euranix.com'],['Contact','mailto:contact@euranix.com']];
  return (
    <footer>
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-logo"><img src={logoUrl} alt="Euranix AI" className="footer-logo-img" /></div>
          <p className="footer-tagline">Your AI transformation partner. We build it, manage it, and make it work for your business.</p>
        </div>
        <div className="footer-links-grid">{links.map(([l, h]) => <a key={l} href={h}>{l}</a>)}</div>
      </div>
      <div className="footer-bottom">
        <div className="footer-copy">&copy; {new Date().getFullYear()} EURANIX TECHNOLOGIES. ALL RIGHTS RESERVED.</div>
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
      <Nav /><Hero /><IntegrationStrip /><Outcomes /><HowItWorks /><UseCases /><Features /><Pricing /><Footer />
    </div>
  );
}
