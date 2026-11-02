const { createRequire } = require("module");
const fs = require("fs");
const path = require("path");
const assert = require("assert");
const requireTools = createRequire(
  path.join(process.env.REVIEW_TOOL_ROOT || process.cwd(), "package.json"),
);
const { chromium } = requireTools("playwright");
const AxeBuilder = requireTools("@axe-core/playwright").default;
const root = process.cwd();
const ai = fs.existsSync("App.tsx");
const port = ai ? 4274 : 4273;
const origin = "http://127.0.0.1:" + port;
const out = "docs/design-review";
const routes = ai
  ? ["/design-review/", "/design-review/enquiry"]
  : [
      "/design-review/",
      "/design-review/custom-software",
      "/design-review/enquiry",
    ];
(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const results = [];
  const issues = [];
  const performance = [];
  for (const device of ["desktop", "mobile"]) {
    const context = await browser.newContext({
      viewport:
        device === "desktop"
          ? { width: 1440, height: 1000 }
          : { width: 390, height: 844 },
    });
    const page = await context.newPage();
    const errors = [];
    const failed = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("response", (r) => {
      if (r.status() >= 400) failed.push(r.url() + ": " + r.status());
    });
    for (const route of routes) {
      const response = await page.goto(origin + route);
      assert.equal(response.status(), 200);
      assert.match(response.headers()["x-robots-tag"], /noindex/);
      await page.waitForTimeout(400);
      assert.equal(await page.locator("h1").count(), 1);
      assert.equal(
        await page.locator("meta[name=robots]").getAttribute("content"),
        "noindex,nofollow,noarchive",
      );
      assert.equal(await page.locator("link[rel=canonical]").count(), 0);
      assert(
        !(await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        )),
        "Horizontal overflow " + route,
      );
      assert(
        await page
          .locator("img")
          .evaluateAll((imgs) =>
            imgs.every((i) => i.complete && i.naturalWidth > 0),
          ),
        "Broken image",
      );
      const a11y = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      issues.push(
        ...a11y.violations.map((v) => ({
          route,
          device,
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.map((n) => n.target),
        })),
      );
      const name = route.includes("custom-software")
        ? "software"
        : route.includes("enquiry")
          ? "enquiry"
          : "home";
      await page.screenshot({
        path: out + "/screenshots/preview-" + name + "-" + device + ".png",
        fullPage: true,
      });
      const links = await page
        .locator("a[href]")
        .evaluateAll((els) =>
          els.map((e) => ({
            href: e.getAttribute("href"),
            text: e.textContent,
          })),
        );
      for (const { href } of links) {
        if (href.startsWith("#"))
          assert(await page.locator(href).count(), "Missing anchor " + href);
        else if (href.startsWith("/")) {
          const r = await page.request.get(origin + href);
          assert(r.ok(), "Broken internal link " + href);
        }
      }
      results.push({
        route,
        device,
        title: await page.title(),
        a11yViolations: a11y.violations.length,
        links: links.length,
        overflow: false,
      });
    }
    await page.goto(origin + "/design-review/");
    await page.keyboard.press("Tab");
    assert.equal(await page.locator(":focus").textContent(), "Skip to content");
    await page.keyboard.press("Enter");
    assert.equal(await page.locator(":focus").getAttribute("id"), "main");
    if (device === "mobile") {
      await page.getByRole("button", { name: "Open navigation" }).click();
      assert.equal(
        await page
          .getByRole("button", { name: "Close navigation" })
          .getAttribute("aria-expanded"),
        "true",
      );
      await page.keyboard.press("Escape");
      assert.equal(
        await page
          .getByRole("button", { name: "Open navigation" })
          .getAttribute("aria-expanded"),
        "false",
      );
    }
    if (ai) {
      await page
        .getByRole("button", { name: "Missing information", exact: true })
        .click();
      assert(
        (await page.locator(".demo-response").textContent()).includes(
          "does not specify",
        ),
      );
      await page
        .getByRole("button", { name: "Human handover", exact: true })
        .click();
      assert(
        (await page.locator(".demo-response").textContent()).includes(
          "No handover is sent",
        ),
      );
      await page
        .getByRole("button", { name: "Customer support", exact: true })
        .click();
      assert(
        (await page.locator(".demo-question").textContent()).includes(
          "delivery address",
        ),
      );
    } else {
      await page
        .getByRole("button", { name: "Connect the work", exact: true })
        .click();
      assert(
        (await page.locator(".map-content").textContent()).includes(
          "Map one business workflow",
        ),
      );
      assert.equal(await page.locator(".service-row").count(), 7);
    }
    await page.goto(
      origin + "/design-review/enquiry?service=Custom%20Software%20Engineering",
    );
    assert.equal(
      await page.locator("#service").inputValue(),
      "Custom Software Engineering",
    );
    await page.getByRole("button", { name: /Test enquiry/ }).click();
    assert.equal(await page.locator("[aria-invalid=true]").count(), 3);
    assert.equal(await page.locator(":focus").getAttribute("role"), "alert");
    const posts = [];
    page.on("request", (r) => {
      if (r.method() === "POST") posts.push(r.url());
    });
    await page
      .getByLabel("Name (required)", { exact: true })
      .fill("Preview Tester");
    await page
      .getByLabel("Work email (required)", { exact: true })
      .fill("preview@example.test");
    await page
      .getByLabel("What would you like help with? (required)", { exact: true })
      .fill("Synthetic preview enquiry to test accessible form behaviour.");
    assert.equal(await page.locator("input[type=checkbox]").isChecked(), false);
    await page.getByRole("button", { name: /Test enquiry/ }).click();
    await page.getByText("Hub is not connected.", { exact: false }).waitFor();
    assert.equal(posts.length, 0);
    await page.locator("#fixture").selectOption("failure");
    await page.getByRole("button", { name: /Test enquiry/ }).click();
    assert.equal(await page.locator("form").getAttribute("aria-busy"), "true");
    assert(
      await page.getByRole("button", { name: /Test enquiry/ }).isDisabled(),
    );
    await page
      .getByText("Test connection interrupted.", { exact: false })
      .waitFor();
    assert.equal(await page.locator("#name").inputValue(), "Preview Tester");
    await page.locator("#fixture").selectOption("success");
    await page.getByRole("button", { name: /Test enquiry/ }).click();
    await page
      .getByText("Test complete — nothing was sent.", { exact: true })
      .waitFor();
    assert.equal(posts.length, 0);
    await page.emulateMedia({ reducedMotion: "reduce" });
    assert.equal(
      await page.evaluate(
        () => getComputedStyle(document.documentElement).scrollBehavior,
      ),
      "auto",
    );
    assert.equal(
      await page
        .locator(".btn")
        .first()
        .evaluate((e) => getComputedStyle(e).transitionDuration),
      "0s",
    );
    assert.deepEqual(errors, []);
    assert.deepEqual(failed, []);
    await context.close();
  }
  const c = await browser.newContext();
  const p = await c.newPage();
  assert.equal(
    (await p.goto(origin + "/design-review/not-a-page")).status(),
    404,
  );
  assert.equal(
    (await p.request.get(origin + "/review-assets/missing.js")).status(),
    404,
  );
  assert.match(
    await (await p.request.get(origin + "/robots.txt")).text(),
    /Disallow: \//,
  );
  await c.close();
  for (const device of ["desktop", "mobile"])
    for (let run = 1; run <= 3; run++) {
      const c = await browser.newContext({
        viewport:
          device === "desktop"
            ? { width: 1440, height: 1000 }
            : { width: 390, height: 844 },
      });
      const p = await c.newPage();
      const cdp = await c.newCDPSession(p);
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
      await p.addInitScript(() => {
        window.reviewMetrics = { lcp: 0, cls: 0 };
        new PerformanceObserver((l) => {
          for (const e of l.getEntries())
            window.reviewMetrics.lcp = e.startTime;
        }).observe({ type: "largest-contentful-paint", buffered: true });
        new PerformanceObserver((l) => {
          for (const e of l.getEntries())
            if (!e.hadRecentInput) window.reviewMetrics.cls += e.value;
        }).observe({ type: "layout-shift", buffered: true });
      });
      await p.goto(origin + "/design-review/");
      await p.waitForTimeout(3000);
      performance.push({
        device,
        run,
        ...(await p.evaluate(() => ({
          ...window.reviewMetrics,
          dcl: performance.getEntriesByType("navigation")[0]
            .domContentLoadedEventEnd,
          resources: performance.getEntriesByType("resource").length,
          bytes: performance
            .getEntriesByType("resource")
            .reduce((n, r) => n + r.transferSize, 0),
        }))),
      });
      await c.close();
    }
  fs.writeFileSync(
    out + "/preview-checks.json",
    JSON.stringify(
      {
        results,
        issues,
        behaviour:
          "Passed desktop/mobile: routes, links, images, 7 services or AI demo, menu and Escape, skip link, validation/focus, unavailable/success/failure fixtures, no POST, no default consent, retry preserves data, busy/disabled, reduced motion, 404s and robots.",
      },
      null,
      2,
    ),
  );
  fs.writeFileSync(
    out + "/preview-performance.json",
    JSON.stringify(
      {
        method:
          "Same baseline method: fresh Edge contexts, CPU 4x, loopback gzip-compressed assets, no network throttling, three runs/device, 3-second observation. Not field CWV.",
        runs: performance,
      },
      null,
      2,
    ),
  );
  await browser.close();
  console.log(JSON.stringify({ results, issues }, null, 2));
  if (issues.length) process.exitCode = 1;
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
