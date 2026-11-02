const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const assert = require("assert");
const vm = require("vm");
const ts = require("typescript");
const { createRequire } = require("module");
const { chromium } = createRequire(
  path.join(process.env.REVIEW_TOOL_ROOT || process.cwd(), "package.json"),
)("playwright");
const ai = fs.existsSync("App.tsx");
const origin = "http://127.0.0.1:" + (ai ? 4274 : 4273);
const out = "docs/design-review/round-two";
(async () => {
  const baseline = JSON.parse(
    fs.readFileSync(
      "docs/design-review/production-build-baseline.json",
      "utf8",
    ),
  );
  const current = {};
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(file);
      else
        current[path.relative("dist", file).split(path.sep).join("/")] = crypto
          .createHash("sha256")
          .update(fs.readFileSync(file))
          .digest("hex");
    }
  }
  walk("dist");
  assert.deepStrictEqual(
    current,
    baseline,
    "Production build must exactly match baseline",
  );
  const src = fs.readFileSync("design-review/adapter.ts", "utf8");
  const compiled = ts.transpileModule(
    src.replaceAll("import.meta.env.MODE", JSON.stringify("production")),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    },
  ).outputText;
  const sandbox = {
    exports: {},
    location: { hostname: "localhost" },
    setTimeout,
    clearTimeout,
    DOMException,
  };
  vm.runInNewContext(compiled, sandbox);
  await assert.rejects(
    sandbox.exports.submitFixture("success", new AbortController().signal),
    /local design-review build/,
  );
  await assert.rejects(
    sandbox.exports.hubTransport.submit({}, new AbortController().signal),
    /not connected/,
  );
  const b = await chromium.launch({ channel: "msedge", headless: true });
  const p = await b.newPage();
  const posts = [];
  p.on("request", (r) => {
    if (r.method() === "POST") posts.push(r.url());
  });
  // Serve the real preview bundle at a non-loopback test origin without external traffic.
  await p.route("http://preview.example.test/**", async (route) => {
    const url = new URL(route.request().url());
    const res = await p.request.get(origin + url.pathname + url.search);
    await route.fulfill({ response: res });
  });
  await p.goto("http://preview.example.test/design-review/enquiry");
  await p.locator("#name").fill("Fixture tester");
  await p.locator("#email").fill("fixture@example.test");
  await p
    .locator("#message")
    .fill("Synthetic fixture isolation check; do not submit.");
  await p.locator("#fixture").selectOption("success");
  await p.getByRole("button", { name: /Test enquiry/ }).click();
  await p
    .getByText(
      "Test fixtures are available only in the local design-review build.",
      { exact: true },
    )
    .waitFor();
  assert.equal(
    await p
      .getByText("Test complete — nothing was sent.", { exact: true })
      .count(),
    0,
  );
  assert.deepEqual(posts, []);
  const root = await p.request.get(origin + "/");
  assert.equal(root.status(), 200);
  await b.close();
  const report = {
    passed: true,
    productionFiles: Object.keys(current).length,
    productionSha256MatchesBaseline: true,
    productionModeRejectsFixture: true,
    nonLoopbackPreviewRejectsSuccess: true,
    hubAdapterRemainsDisconnected: true,
    networkSubmissions: posts.length,
    originalRootStatus: root.status(),
  };
  fs.writeFileSync(
    out + "/isolation-checks.json",
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(JSON.stringify(report));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
