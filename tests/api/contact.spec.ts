import { test, expect } from '@playwright/test';

/**
 * SAFETY: `RESEND_API_KEY` must be set to an invalid value for every run of
 * this file (see the verification command in the PR/task notes). Every test
 * here targets one of the endpoint's *pre-send* rejection paths -- honeypot,
 * fill-time gate, validation, malformed/oversized body, wrong method -- all
 * of which return before `resend.emails.send()` is ever called, so they
 * cannot send mail no matter what key is configured.
 *
 * The one test that intentionally reaches the send stage (subject-line
 * sanitization) relies on the invalid key to fail the send and return 500
 * instead of actually delivering anything -- see the comment on that test.
 *
 * Rate-limit isolation: the endpoint's in-memory rate limiter allows only 3
 * requests/hour per resolved client IP, resolved from X-Forwarded-For when
 * present. Since this whole suite runs against a single long-lived server
 * process (and `fullyParallel` may interleave this file with itself across
 * projects), every request below sends a unique X-Forwarded-For value
 * derived from Playwright's own per-test `testId` so no test's requests can
 * count against another test's rate-limit budget.
 */

const API_PATH = '/api/contact';

function ipHeaders(uniqueId: string): Record<string, string> {
  return { 'x-forwarded-for': uniqueId };
}

/** A submission that clears the honeypot and fill-time gates and validates. */
function validBody(
  overrides: Record<string, unknown> = {}
): Record<string, unknown> {
  return {
    website: '',
    formRenderedAt: Date.now() - 4000, // comfortably over MIN_FILL_MS (3000)
    contactName: 'Jane Doe',
    contactPhone: '555-123-4567',
    contactEmail: 'jane@example.com',
    ...overrides,
  };
}

test.describe('POST /api/contact - honeypot bot gate', () => {
  test('filled honeypot returns the normal success response without sending', async ({
    request,
  }, testInfo) => {
    const response = await request.post(API_PATH, {
      headers: ipHeaders(testInfo.testId),
      data: validBody({ website: 'http://spam.example.com' }),
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toEqual({
      success: true,
      message: 'Your inquiry has been sent successfully!',
    });

    // Proof no email was sent: the route only reaches resend.emails.send()
    // after the honeypot and fill-time gates, field validation, and Sanity
    // recipient lookup. With RESEND_API_KEY forced to an invalid value for
    // this run, any request that actually reaches that send stage fails and
    // resolves 500 (the endpoint inspects Resend's {data,error} result
    // rather than assuming success -- see commit 492f62c). A 200 response
    // is therefore only reachable via the honeypot's early return, before
    // Resend is ever touched -- a genuine send attempt with this key cannot
    // produce a 200. That makes the exact-match success body the strongest
    // available proof here, rather than merely a non-500 status.
  });

  test('omitted honeypot field is also rejected (the real form always sends an empty string)', async ({
    request,
  }, testInfo) => {
    const body = validBody();
    delete body.website;

    const response = await request.post(API_PATH, {
      headers: ipHeaders(testInfo.testId),
      data: body,
    });

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({
      success: true,
      message: 'Your inquiry has been sent successfully!',
    });
  });
});

test.describe('POST /api/contact - fill-time bot gate', () => {
  test('formRenderedAt under the 3s minimum is rejected (200, no send)', async ({
    request,
  }, testInfo) => {
    const response = await request.post(API_PATH, {
      headers: ipHeaders(testInfo.testId),
      data: validBody({ formRenderedAt: Date.now() - 500 }),
    });

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({
      success: true,
      message: 'Your inquiry has been sent successfully!',
    });
  });

  test('missing formRenderedAt is rejected (200, no send)', async ({
    request,
  }, testInfo) => {
    const body = validBody();
    delete body.formRenderedAt;

    const response = await request.post(API_PATH, {
      headers: ipHeaders(testInfo.testId),
      data: body,
    });

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({
      success: true,
      message: 'Your inquiry has been sent successfully!',
    });
  });

  test('non-numeric formRenderedAt is rejected (200, no send)', async ({
    request,
  }, testInfo) => {
    const response = await request.post(API_PATH, {
      headers: ipHeaders(testInfo.testId),
      data: validBody({ formRenderedAt: 'not-a-number' }),
    });

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({
      success: true,
      message: 'Your inquiry has been sent successfully!',
    });
  });

  test('future-dated formRenderedAt is rejected (200, no send)', async ({
    request,
  }, testInfo) => {
    const response = await request.post(API_PATH, {
      headers: ipHeaders(testInfo.testId),
      data: validBody({ formRenderedAt: Date.now() + 60_000 }),
    });

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({
      success: true,
      message: 'Your inquiry has been sent successfully!',
    });
  });
});

test.describe('POST /api/contact - field validation', () => {
  test('over-length contactName is rejected (400)', async ({
    request,
  }, testInfo) => {
    const response = await request.post(API_PATH, {
      headers: ipHeaders(testInfo.testId),
      data: validBody({ contactName: 'a'.repeat(101) }),
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(typeof body.error).toBe('string');
  });

  test('badly formatted contactEmail is rejected (400)', async ({
    request,
  }, testInfo) => {
    const response = await request.post(API_PATH, {
      headers: ipHeaders(testInfo.testId),
      data: validBody({ contactEmail: 'not-an-email' }),
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Please provide a valid email address.');
  });

  test('over-length message is rejected (400)', async ({
    request,
  }, testInfo) => {
    const response = await request.post(API_PATH, {
      headers: ipHeaders(testInfo.testId),
      data: validBody({ message: 'a'.repeat(5001) }),
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(typeof body.error).toBe('string');
  });

  test('wrong type for a field is rejected (400)', async ({
    request,
  }, testInfo) => {
    const response = await request.post(API_PATH, {
      headers: ipHeaders(testInfo.testId),
      data: validBody({ contactName: 12345 }),
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(typeof body.error).toBe('string');
  });
});

test.describe('POST /api/contact - malformed / non-object body', () => {
  test('malformed JSON is rejected (400)', async ({ request }, testInfo) => {
    const response = await request.post(API_PATH, {
      headers: {
        ...ipHeaders(testInfo.testId),
        'Content-Type': 'application/json',
      },
      data: '{"contactName": "Jane", invalid-json,,,',
    });

    expect(response.status()).toBe(400);
  });

  test('valid JSON that is not an object (an array) is rejected (400)', async ({
    request,
  }, testInfo) => {
    const response = await request.post(API_PATH, {
      headers: {
        ...ipHeaders(testInfo.testId),
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(['not', 'an', 'object']),
    });

    expect(response.status()).toBe(400);
  });
});

test.describe('POST /api/contact - body size', () => {
  test('a body over MAX_BODY_BYTES (32KB) is rejected before parsing (413)', async ({
    request,
  }, testInfo) => {
    const response = await request.post(API_PATH, {
      headers: {
        ...ipHeaders(testInfo.testId),
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(validBody({ filler: 'x'.repeat(40_000) })),
    });

    expect(response.status()).toBe(413);
  });
});

test.describe('GET /api/contact', () => {
  test('non-POST method is not allowed (405)', async ({
    request,
  }, testInfo) => {
    const response = await request.get(API_PATH, {
      headers: ipHeaders(testInfo.testId),
    });

    // The route module only exports POST; Next's App Router auto-generates
    // a 405 for any other method rather than invoking application code.
    expect(response.status()).toBe(405);
  });
});

test.describe('POST /api/contact - subject-line sanitization', () => {
  test('a newline-injected contactName reaches the send stage without crashing or being misclassified as a validation failure', async ({
    request,
  }, testInfo) => {
    // contactName has no character restrictions beyond length (<=100), so a
    // value containing \r\n passes validation and flows into the interpolated
    // subject line, which `singleLine()` is responsible for sanitizing
    // before it reaches Resend. This submission clears every pre-send gate,
    // so with a real key it would actually send -- it's only safe here
    // because RESEND_API_KEY is forced to an invalid value for this run,
    // which turns the send attempt into a deterministic 500 instead of a
    // delivered email.
    //
    // Limitation: with no seam in app code to intercept the outgoing Resend
    // payload, this test cannot assert the literal sanitized subject string
    // reached Resend -- it can only assert the endpoint accepts the payload
    // and fails at the send stage (500) rather than crashing or misrouting
    // it to a 400. Verifying the exact sanitized subject would require
    // either adding a code seam (out of scope -- app code is not to be
    // modified for this task) or an integration test against a real/stubbed
    // Resend backend.
    const response = await request.post(API_PATH, {
      headers: ipHeaders(testInfo.testId),
      data: validBody({
        contactName: 'Jane Doe\r\nBcc: attacker@evil.example.com',
      }),
    });

    expect(response.status()).toBe(500);
    const body = await response.json();
    expect(typeof body.error).toBe('string');
  });
});
