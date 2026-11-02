import { Header, Footer } from "./components/Layout";
import Enquiry from "./enquiries/Enquiry";
import { metadataFor } from "./routes";
import { useEffect } from "react";
import Home from "./pages/AIHome";

export default function App({ path }: { path: string }) {
  const metadata = metadataFor(path);
  useEffect(() => {
    document.title = metadata.title;
  }, [metadata.title]);
  const content = path === "/" ? <Home /> : null;
  return (
    <div className="site ai">
      <Header />
      <main id="main" tabIndex={-1}>
        {path === "/contact" || path === "/technology-review" ? (
          <Enquiry path={path} review={path === "/technology-review"} />
        ) : (
          content || (
            <section className="shell page-intro missing-page">
              <p className="eyebrow">404 / Page not found</p>
              <h1>This page isn’t here.</h1>
              <p className="lede">
                The address may have changed or been entered incorrectly. Choose
                a useful starting point below.
              </p>
              <div className="actions">
                <a className="btn primary" href="/">
                  Explore Euranix AI ↗
                </a>
                <a href="/contact">Contact us ↗</a>
              </div>
            </section>
          )
        )}
      </main>
      <Footer />
    </div>
  );
}
