const { createRequire } = require("module");
const fs = require("fs");
const path = require("path");
const assert = require("assert");
const { chromium } = createRequire(
  path.join(process.env.REVIEW_TOOL_ROOT || process.cwd(), "package.json"),
)("playwright");
const ai = fs.existsSync("App.tsx"),
  origin = "http://127.0.0.1:" + (ai ? 4274 : 4273),
  out = "docs/design-review/round-two";
(async () => {
  const b = await chromium.launch({ channel: "msedge", headless: true });
  const records = [];
  for (const width of [390, 1440]) {
    const p = await b.newPage({
      viewport: { width, height: width === 390 ? 844 : 1000 },
    });
    await p.goto(origin + "/design-review/enquiry");
    assert.equal(await p.locator("#intent").inputValue(), "general");
    assert.equal(
      await p.locator("#service").inputValue(),
      "Not sure — help me choose",
    );
    assert.equal(await p.locator(".review-offer").count(), 0);
    assert.equal(await p.locator(".enquiry-intro + .form-panel").count(), 1);
    const intro = await p.locator(".enquiry-intro").boundingBox(),
      form = await p.locator(".form-panel").boundingBox();
    if (width === 390) {
      assert(form.y > intro.y + intro.height, "Form below intro");
      assert(form.y < 500, "Form should begin within first mobile viewport");
    }
    await p.locator("#name").focus();
    await p.keyboard.press("Escape");
    assert.equal(await p.locator(":focus").getAttribute("id"), "name");
    if (width === 390) {
      await p.getByRole("button", { name: "Open navigation" }).click();
      await p.locator("#navigation a").first().focus();
      await p.keyboard.press("Escape");
      assert.equal(
        await p.locator(":focus").getAttribute("aria-label"),
        "Open navigation",
      );
      assert.equal(
        await p
          .getByRole("button", { name: "Open navigation" })
          .getAttribute("aria-expanded"),
        "false",
      );
      await p.locator("#name").focus();
      await p.keyboard.press("Escape");
      assert.equal(await p.locator(":focus").getAttribute("id"), "name");
    }
    await p.locator(".contact-preferences summary").click();
    assert.equal(await p.locator("#contactPreference").inputValue(), "");
    assert.equal(
      await p.locator("#preferredContactTime").getAttribute("required"),
      null,
    );
    await p.locator("#contactPreference").selectOption("conversation");
    await p
      .locator("#preferredContactTime")
      .fill("Weekday afternoons, UTC+5:30");
    await p.locator("#intent").selectOption("technology-review");
    assert.equal(await p.locator(".review-offer").count(), 1);
    assert(
      (await p.locator(".request-context").textContent()).includes("US$199"),
    );
    if (width === 390) {
      const offer = await p.locator(".enquiry-support").boundingBox();
      const f = await p.locator(".form-panel").boundingBox();
      assert(offer.y >= f.y + f.height, "Offer must follow form");
    }
    assert.equal(
      await p.locator("#contactPreference").inputValue(),
      "conversation",
    );
    await p.screenshot({
      path:
        out +
        "/screenshots/review-request-" +
        (width === 390 ? "mobile" : "desktop") +
        ".png",
      fullPage: true,
    });
    await p.locator("#intent").selectOption("general");
    assert.equal(await p.locator(".review-offer").count(), 0);
    await p.goto(origin + "/design-review/enquiry?service=Technology%20review");
    assert.equal(await p.locator("#intent").inputValue(), "technology-review");
    await p.goto(
      origin + "/design-review/enquiry?service=Custom%20Software%20Engineering",
    );
    assert.equal(await p.locator("#intent").inputValue(), "general");
    assert.equal(
      await p.locator("#service").inputValue(),
      "Custom Software Engineering",
    );
    await p.goto(origin + "/design-review/");
    const discovery = await p
      .locator(ai ? "#usecases" : "#services")
      .boundingBox();
    const mainText = await p.locator("main").textContent();
    assert(!mainText.includes("The existing offering describes"));
    assert(!mainText.includes("Examples from the service catalogue"));
    assert(
      (await p.locator(".header .small-btn").getAttribute("href")).includes(
        "General%20enquiry",
      ),
    );
    if (ai) {
      const response = await p.locator(".demo-response").textContent();
      assert(response.includes("purchase request"));
      await p
        .getByRole("button", { name: "Restricted access", exact: true })
        .click();
      assert(
        (await p.locator(".source-document").textContent()).includes(
          "Source withheld",
        ),
      );
      assert(
        !(await p.locator(".source-document").textContent()).includes(
          "estimated cost",
        ),
      );
      assert(
        (await p.locator(".demo-response").textContent()).includes(
          "can’t answer",
        ),
      );
      await p
        .getByRole("button", { name: "Referenced answer", exact: true })
        .click();
      assert(
        (await p.locator(".source-document").textContent()).includes(
          "estimated cost",
        ),
      );
      await p
        .getByRole("button", { name: "Human handover", exact: true })
        .click();
      assert(
        (await p.locator(".demo-response").textContent()).includes(
          "No handover is sent",
        ),
      );
    } else {
      await p.getByRole("button", { name: "Assign", exact: true }).click();
      assert(
        (await p.locator(".workflow-result").textContent()).includes(
          "named owner",
        ),
      );
      await p
        .getByRole("button", { name: "Follow through", exact: true })
        .click();
      assert(
        (await p.locator(".workflow-result").textContent()).includes(
          "record the conversation",
        ),
      );
      await p
        .getByRole("button", { name: "A support request", exact: true })
        .click();
      assert.equal(
        await p
          .getByRole("button", { name: "Capture", exact: true })
          .getAttribute("aria-pressed"),
        "true",
      );
      assert(
        (await p.locator(".hero .primary").getAttribute("href")).includes(
          "Technology%20review",
        ),
      );
    }
    await p.screenshot({
      path:
        out +
        "/screenshots/demo-interaction-" +
        (width === 390 ? "mobile" : "desktop") +
        ".png",
      fullPage: true,
    });
    records.push({
      width,
      formTop: Math.round(form.y),
      discoveryTop: Math.round(discovery.y),
      checks:
        "Intent, optional preferences, mobile reading order, contextual offer, legacy query URLs, Escape focus, new demonstration boundaries passed",
    });
    await p.close();
  }
  const p = await b.newPage();
  const routes = ai
    ? ["/design-review/", "/design-review/enquiry"]
    : [
        "/design-review/",
        "/design-review/custom-software",
        "/design-review/enquiry",
      ];
  for (const width of [320, 768, 1024]) {
    await p.setViewportSize({ width, height: 900 });
    for (const r of routes) {
      await p.goto(origin + r);
      assert(
        !(await p.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        )),
        r + " overflow " + width,
      );
    }
  }
  if (!ai) {
    for (const width of [1440, 1280, 1024]) {
      await p.setViewportSize({ width, height: 1000 });
      await p.goto(origin + "/design-review/custom-software");
      assert(
        (await p.locator(".cta .btn").getAttribute("href")).includes(
          "Custom%20Software%20Engineering",
        ),
      );
      assert(
        (await p.locator(".cta .btn").textContent()).includes(
          "Discuss your software project",
        ),
      );
      const rows = await p.locator(".delivery-list article").evaluateAll((xs) =>
        xs.map((e) => {
          const h = e.querySelector("h3").getBoundingClientRect(),
            d = e.querySelector("div").getBoundingClientRect(),
            r = e.getBoundingClientRect();
          return {
            titleX: h.x,
            bodyX: d.x,
            align: getComputedStyle(e).alignItems,
            overlap: h.right > d.x,
            top: r.y,
            bottom: r.bottom,
          };
        }),
      );
      assert(rows.every((r) => r.align === "baseline" && !r.overlap));
      assert(
        rows.every(
          (r) =>
            Math.abs(r.titleX - rows[0].titleX) < 1 &&
            Math.abs(r.bodyX - rows[0].bodyX) < 1,
        ),
      );
      await p
        .locator(".delivery-list")
        .screenshot({ path: out + "/screenshots/lifecycle-" + width + ".png" });
      records.push({ width, lifecycle: rows });
    }
    for (const zoom of [1.25, 2]) {
      // Actual CSS zoom plus reduced-viewport reflow checks. Not a browser-chrome zoom claim.
      await p.setViewportSize({ width: 1440, height: 1200 });
      await p.goto(origin + "/design-review/custom-software");
      await p.evaluate(
        (z) => (document.documentElement.style.zoom = String(z)),
        zoom,
      );
      assert(
        !(await p.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        )),
        "CSS zoom overflow " + zoom,
      );
      const rows = await p.locator(".delivery-list article").evaluateAll((xs) =>
        xs.map((e) => {
          const h = e.querySelector("h3").getBoundingClientRect(),
            d = e.querySelector("div").getBoundingClientRect();
          return {
            titleX: h.x,
            bodyX: d.x,
            overlap: h.right > d.x && h.bottom > d.y,
          };
        }),
      );
      assert(
        rows.every((r) => !r.overlap),
        "Zoom overlap",
      );
      await p
        .locator(".delivery-list")
        .screenshot({
          path: out + "/screenshots/lifecycle-css-zoom-" + zoom + ".png",
        });
      await p.evaluate(() => (document.documentElement.style.zoom = "1"));
      await p.setViewportSize({ width: Math.round(1440 / zoom), height: 900 });
      assert(
        !(await p.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        )),
        "Zoom-equivalent reflow overflow",
      );
      records.push({
        cssZoom: zoom,
        zoomEquivalentWidth: Math.round(1440 / zoom),
        lifecycleOverlap: false,
      });
    }
  }
  await p.close();
  await b.close();
  fs.writeFileSync(
    out + "/refinement-checks.json",
    JSON.stringify(
      {
        passed: true,
        records,
        scope: "Local preview only. No production readiness claim.",
      },
      null,
      2,
    ),
  );
  console.log(JSON.stringify(records, null, 2));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
