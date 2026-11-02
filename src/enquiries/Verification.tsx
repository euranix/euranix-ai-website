import { useEffect, useRef, useState } from "react";
type WidgetAPI = {
  render: (node: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: WidgetAPI;
  }
}
let loading: Promise<WidgetAPI> | undefined;
function load() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!loading)
    loading = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.turnstile) resolve(window.turnstile);
        else {
          script.remove();
          loading = undefined;
          reject(Error("unavailable"));
        }
      };
      script.onerror = () => {
        script.remove();
        loading = undefined;
        reject(Error("unavailable"));
      };
      document.head.appendChild(script);
    });
  return loading;
}
export default function Verification({
  siteKey,
  onToken,
  reset,
}: {
  siteKey: string;
  onToken: (token: string) => void;
  reset: number;
}) {
  const host = useRef<HTMLDivElement>(null);
  const callback = useRef(onToken);
  callback.current = onToken;
  const [problem, setProblem] = useState("");
  const [reload, setReload] = useState(0);
  useEffect(() => {
    let cancelled = false;
    let widget: string | undefined;
    let api: WidgetAPI | undefined;
    setProblem("");
    callback.current("");
    load()
      .then((instance) => {
        if (cancelled || !host.current) return;
        api = instance;
        widget = instance.render(host.current, {
          sitekey: siteKey,
          action: "website_enquiry",
          size: "flexible",
          theme: "auto",
          callback: (token: string) => {
            setProblem("");
            callback.current(token);
          },
          "expired-callback": () => {
            callback.current("");
            setProblem("The security check expired. Please refresh it.");
          },
          "error-callback": () => {
            callback.current("");
            setProblem(
              "The security check is unavailable. Refresh it or contact us by email.",
            );
          },
          "timeout-callback": () => {
            callback.current("");
            setProblem("The security check timed out. Please refresh it.");
          },
        });
      })
      .catch(() => {
        if (!cancelled)
          setProblem(
            "The security check could not load. Refresh it or contact us by email.",
          );
      });
    return () => {
      cancelled = true;
      if (widget) api?.remove(widget);
    };
  }, [siteKey, reset, reload]);
  return (
    <div className="verification">
      <div ref={host} />
      {problem && (
        <p role="alert">
          {problem}{" "}
          <button
            type="button"
            className="text-button"
            onClick={() => setReload((x) => x + 1)}
          >
            Refresh security check
          </button>
        </p>
      )}
    </div>
  );
}
