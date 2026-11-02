/* eslint-disable react-refresh/only-export-components -- build-time SSR entry, never a Fast Refresh module */
import { renderToString } from "react-dom/server";
import App from "./App";
export { routes } from "./routes";
export { ORIGIN, LOGO } from "./site";
export function render(path: string) {
  return renderToString(<App path={path} />);
}
