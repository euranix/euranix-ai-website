import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./styles/site.css";
import "./styles/pages.css";
const root = document.getElementById("root")!;
const app = <App path={location.pathname.replace(/\/$/, "") || "/"} />;
if (root.childElementCount) hydrateRoot(root, app);
else createRoot(root).render(app);
