import { useEffect, useRef, useState } from "react";
import { AI, LOGO, enquiry } from "../site";
export function Header() {
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
        ["/#usecases", "Use cases"],
        ["/#howitworks", "How it works"],
        ["/#privacy", "Data & access"],
        ["/#pricing", "Pricing"],
      ]
    : [
        ["/services", "Services"],
        ["/#solutions", "Your business"],
        ["/products", "Products"],
        ["/about", "Our approach"],
      ];
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className="header shell">
        <a
          className="brand"
          href={"/"}
          aria-label={AI ? "Euranix AI home" : "Euranix home"}
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
export function Footer() {
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
            <a href="/technology-review">Technology review ↗</a>
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
