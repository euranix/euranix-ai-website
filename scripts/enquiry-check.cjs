const fs = require("fs"),
  path = require("path"),
  http = require("http"),
  assert = require("assert"),
  { createRequire } = require("module");
const { chromium } = createRequire(
  path.join(process.env.REVIEW_TOOL_ROOT || process.cwd(), "package.json"),
)("playwright");
(async () => {
  const { build } = await import("vite");
  await build({
    build: { outDir: ".build/contract-dist", emptyOutDir: true },
    define: {
      "import.meta.env.VITE_ENQUIRY_API_URL": JSON.stringify(
        "https://intake.example.test/api/v1/enquiries",
      ),
      "import.meta.env.VITE_TURNSTILE_SITE_KEY":
        JSON.stringify("synthetic-test-key"),
      "import.meta.env.VITE_ENQUIRY_PRIVACY_VERSION": JSON.stringify(
        "synthetic-notice-v1",
      ),
    },
  });
  const root = path.resolve(".build/contract-dist");
  const server = http.createServer((req, res) => {
    const pathname = new URL(req.url, "http://localhost").pathname;
    let file = path.resolve(root, "." + pathname);
    if (
      !file.startsWith(root + path.sep) ||
      !fs.existsSync(file) ||
      !fs.statSync(file).isFile()
    )
      file = path.join(root, "index.html");
    const ext = path.extname(file);
    res.setHeader(
      "Content-Type",
      ext === ".js"
        ? "application/javascript"
        : ext === ".css"
          ? "text/css"
          : ext === ".png"
            ? "image/png"
            : "text/html",
    );
    res.end(fs.readFileSync(file));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const origin = "http://127.0.0.1:" + server.address().port;
  const b = await chromium.launch({ channel: "msedge", headless: true });
  const p = await b.newPage();
  const posts = [];
  let reply = {
      status: 503,
      body: { error: { code: "intake_unavailable" } },
      retry: "2",
    },
    abort = false;
  await p.route("https://challenges.cloudflare.com/**", (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: 'window.turnstile={render:(el,o)=>{window.challengeOptions=o;window.challengeCount=(window.challengeCount||0)+1;el.textContent="Synthetic security challenge (test harness only)";setTimeout(()=>o.callback("synthetic-token-"+window.challengeCount),10);return "test-widget"},remove:()=>{}};',
    }),
  );
  await p.route("https://intake.example.test/**", async (route) => {
    if (route.request().method() === "OPTIONS") {
      await route.fulfill({
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Methods": "POST,OPTIONS",
        },
      });
      return;
    }
    posts.push({
      headers: route.request().headers(),
      body: route.request().postDataJSON(),
    });
    if (abort) {
      await route.abort("failed");
      return;
    }
    await route.fulfill({
      status: reply.status,
      contentType: "application/json",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Expose-Headers": "Retry-After",
        ...(reply.retry ? { "Retry-After": reply.retry } : {}),
      },
      body: JSON.stringify(reply.body),
    });
  });
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto(
    origin + "/contact?utm_campaign=unapproved&email=private@example.test",
  );
  await p.getByRole("button", { name: /Send enquiry/ }).click();
  assert.equal(await p.locator("[aria-invalid=true]").count(), 4);
  await p.locator("#name").fill("Synthetic Prospect");
  await p.locator("#email").fill("prospect@example.test");
  await p
    .locator("#message")
    .fill("Synthetic contract test enquiry; no real person or customer.");
  await p.locator("#privacy").check();
  for (const event of ["expired-callback", "error-callback", "timeout-callback"]) {
    await p.evaluate(event => window.challengeOptions[event](), event);
    await p.getByRole("button", {name: "Refresh security check"}).waitFor();
    const count = posts.length;
    await p.getByRole("button", {name: /Send enquiry/}).click();
    assert.equal(posts.length, count);
    await p.getByRole("button", {name: "Refresh security check"}).click();
    await p.waitForTimeout(50);
  }
  assert.equal(await p.locator("#marketing").isChecked(), false);
  await p.getByRole("button", { name: /Send enquiry/ }).click();
  await p
    .getByText("Receipt has not been confirmed", { exact: true })
    .waitFor();
  assert.equal(await p.locator(".success").count(), 0);
  assert(await p.locator(".submit").isDisabled());
  const original = posts[0];
  assert.equal(original.body.enquiry_type, "general_sales");
  assert.equal(original.body.source_website, fs.existsSync("public/brand-logo.png") ? "euranix_ai" : "euranix_com");
  assert.equal(original.body.privacy_acknowledged, true);
  assert.equal(original.body.marketing_consent, false);
  assert(!original.body.campaign);
  assert.equal(original.body.source_page, "/contact");
  assert.deepEqual(original.body.service_interests, []);
  await p.waitForFunction(() => !document.querySelector(".submit").disabled);
  abort = true;
  await p.getByRole("button", { name: /Retry enquiry/ }).click();
  await p.getByText(/We could not confirm receipt. Your details/).waitFor();
  assert.equal(
    posts[1].headers["idempotency-key"],
    original.headers["idempotency-key"],
  );
  abort = false;
  reply = {
    status: 201,
    body: {
      request_id: "00000000-0000-4000-8000-000000000001",
      data: {
        status: "accepted",
        receipt_id: "00000000-0000-4000-8000-000000000002",
      },
    },
  };
  await p.getByRole("button", { name: /Retry enquiry/ }).click();
  await p
    .getByText("Your enquiry has been received.", { exact: true })
    .waitFor();
  assert.equal(
    posts[2].headers["idempotency-key"],
    original.headers["idempotency-key"],
  );
  assert.notEqual(posts[2].body.bot_token, original.body.bot_token);
  assert.equal(posts.length, 3);
  await p.getByRole("button", { name: "Start another enquiry" }).click();
  await p.locator("#intent").selectOption("technology_review_1h");
  await p.locator("#service").selectOption("custom-software-engineering");
  await p.locator("#name").fill("Second Synthetic Prospect");
  await p.locator("#email").fill("second@example.test");
  await p
    .locator("#message")
    .fill("A second synthetic business enquiry with different content.");
  await p.locator("#privacy").check();
  await p.locator(".contact-preferences summary").click();
  await p.locator("#method").selectOption("phone");
  await p.locator("#phone").fill("+91 90000 00000");
  await p.getByLabel("Suggest a contact window").check();
  await p.getByLabel("mon", { exact: true }).check();
  await p.locator("#start").fill("14:00");
  await p.locator("#end").fill("16:00");
  await p.locator("#timezone").fill("Asia/Kolkata");
  reply = {
    status: 422,
    body: {
      request_id: "00000000-0000-4000-8000-000000000001",
      error: {
        code: "validation_failed",
        fields: { email: ["Synthetic validation response"] },
      },
    },
  };
  await p.getByRole("button", { name: /Send enquiry/ }).click();
  await p.locator("#email[aria-invalid=true]").waitFor();
  const second = posts[3];
  assert.notEqual(
    second.headers["idempotency-key"],
    original.headers["idempotency-key"],
  );
  assert.equal(second.body.enquiry_type, "technology_review_1h");
  assert.deepEqual(second.body.service_interests, [
    "custom-software-engineering",
  ]);
  assert.equal(second.body.phone, "+919000000000");
  assert.equal(second.body.preferred_contact_method, "phone");
  assert.deepEqual(second.body.contact_window, {
    days: ["mon"],
    start: "14:00",
    end: "16:00",
  });
  assert.equal(second.body.timezone, "Asia/Kolkata");
  reply = {
    status: 429,
    body: { error: { code: "rate_limited" } },
    retry: "2",
  };
  await p.getByRole("button", { name: /Retry enquiry/ }).click();
  await p
    .getByText("Please wait before trying again.", { exact: false })
    .waitFor();
  assert(await p.locator(".submit").isDisabled());
  await p.waitForFunction(() => !document.querySelector(".submit").disabled);
  reply = { status: 403, body: { error: { code: "verification_failed" } } };
  await p.getByRole("button", { name: /Retry enquiry/ }).click();
  await p.getByText(/Verification could not be completed/).waitFor();
  reply = { status: 200, body: { ok: true } };
  await p.getByRole("button", { name: /Retry enquiry/ }).click();
  await p
    .getByText(
      "We could not confirm receipt. Keep the same details and retry, or email us.",
      { exact: true },
    )
    .waitFor();
  assert.equal(await p.locator(".success").count(), 0);
  reply = {
    status: 200,
    body: {
      request_id: "00000000-0000-4000-8000-000000000003",
      data: {
        status: "accepted",
        receipt_id: "00000000-0000-4000-8000-000000000004",
      },
    },
  };
  await p.getByRole("button", { name: /Retry enquiry/ }).click();
  await p.locator(".success").waitFor();
  assert(
    posts
      .slice(3)
      .every(
        (x) =>
          x.headers["idempotency-key"] === second.headers["idempotency-key"],
      ),
  );
  assert.equal(
    await p.evaluate(() => localStorage.length + sessionStorage.length),
    0,
  );
  assert.deepEqual(errors, []);
  const report = {
    passed: true,
    kind: "Automated contract tests with intercepted synthetic responses; NOT live Hub acceptance",
    hubCommit: "778e1e1a4319d76efdef00413667925e34390ba1",
    contract: "docs/website-enquiries-contract.md",
    checks: [
      "required fields and privacy acknowledgement",
      "expired, errored and timed-out bot challenge prevents submission until refreshed",
      "unchecked optional marketing",
      "canonical service and enquiry type mapping",
      "optional phone and structured IANA contact window",
      "fixed source website/path and discarded unapproved attribution",
      "503 and Retry-After",
      "network failure retains idempotency key",
      "fresh security token on retry",
      "422 field validation",
      "429 cooldown",
      "403 verification retry",
      "malformed 200 never accepted",
      "201 accepted and 200 accepted replay only",
      "new business enquiry gets new UUID",
      "no PII persisted in browser storage",
    ],
    syntheticRequests: posts.length,
    liveHubAcceptance:
      "BLOCKED: staging endpoint, Turnstile key, approved privacy version and allowed origins not confirmed",
  };
  fs.mkdirSync("docs/release-candidate", { recursive: true });
  fs.writeFileSync(
    "docs/release-candidate/enquiry-contract-tests.json",
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report));
  await p.close();
  await b.close();
  await new Promise((resolve) => server.close(resolve));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
