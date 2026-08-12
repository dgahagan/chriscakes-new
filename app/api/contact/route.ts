import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { client } from '@/lib/sanity';

// Simple rate limiting using in-memory store.
//
// This is best-effort defense-in-depth only: serverless instances are not
// shared, so a determined caller can escape it by landing on a cold instance.
// The honeypot and fill-time gates are the primary defenses.
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 3; // Max submissions per time window
const TIME_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const RATE_LIMIT_MAX_ENTRIES = 10_000; // Hard cap so the Map cannot grow unbounded

// Reject anything larger than this before parsing.
const MAX_BODY_BYTES = 32 * 1024;

// A human cannot realistically complete this form faster than this. The stamp
// is client-supplied and therefore forgeable by design — it exists to catch
// bots that POST the endpoint without ever rendering the form.
const MIN_FILL_MS = 3000;

// The response returned for a genuine success *and* for every bot rejection.
// A bot that learns it was caught adapts, so caught submissions get the normal
// success payload and simply never produce an email.
const SUCCESS_BODY = {
  success: true,
  message: 'Your inquiry has been sent successfully!',
};

/** Drop entries whose window has expired; hard-clear if still over the cap. */
function pruneRateLimitMap(now: number): void {
  for (const [key, record] of rateLimitMap) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  }
  if (rateLimitMap.size > RATE_LIMIT_MAX_ENTRIES) {
    rateLimitMap.clear();
  }
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();

  if (rateLimitMap.size >= RATE_LIMIT_MAX_ENTRIES) {
    pruneRateLimitMap(now);
  }

  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitMap.set(ip, { count: 1, resetTime: now + TIME_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false; // Rate limit exceeded
  }

  record.count++;
  return true;
}

/**
 * Resolve the client IP from a header we can actually trust.
 *
 * `x-forwarded-for` is a client-appendable list: the *leftmost* entry is
 * whatever the caller claimed and is trivially spoofed to defeat rate
 * limiting. The rightmost entry is the one written by the closest trusted
 * proxy, so that is the one we use. `x-vercel-forwarded-for` is set by the
 * platform and is preferred when present.
 */
function getClientIp(request: NextRequest): string {
  const vercelForwarded = request.headers.get('x-vercel-forwarded-for')?.trim();
  if (vercelForwarded) {
    return vercelForwarded;
  }

  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const entries = forwarded
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);
    if (entries.length > 0) {
      return entries[entries.length - 1];
    }
  }

  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

function hostOf(value: string | null): string | null {
  if (!value) return null;
  try {
    return new URL(value).host;
  } catch {
    return null;
  }
}

/**
 * Reject cross-origin posts when the browser told us where they came from.
 * Absent headers are allowed — non-browser clients omit them, and the honeypot
 * and timing gates are the primary defense.
 */
function isSameOrigin(request: NextRequest): boolean {
  const host = request.headers.get('host');
  if (!host) return true;

  const claimedHost =
    hostOf(request.headers.get('origin')) ??
    hostOf(request.headers.get('referer'));
  if (!claimedHost) return true;

  return claimedHost === host;
}

/** Strip characters that would let a value break out of a header line. */
function singleLine(value: string): string {
  return value.replace(/[\r\n\t]+/g, ' ').trim();
}

// Per-field length caps. Anything longer is a rejection, not a truncation.
const FIELD_LIMITS = {
  eventStartDate: 100,
  eventStartTime: 50,
  eventEndTime: 50,
  numberToServe: 50,
  organizationName: 200,
  servingAddress: 300,
  city: 100,
  state: 100,
  zip: 20,
  contactName: 100,
  contactPhone: 50,
  eventPhone: 50,
  contactEmail: 254,
  typeOfFundraiser: 100,
  typeOfBreakfast: 100,
  typeOfMenusNMore: 100,
  whereDidYouHear: 200,
  message: 5000,
} as const;

type FieldName = keyof typeof FIELD_LIMITS;

type ValidationResult =
  | {
      ok: true;
      fields: Record<FieldName, string>;
      isFundraiser: boolean;
      hasVolunteers: boolean;
    }
  | { ok: false; error: string };

function validate(body: Record<string, unknown>): ValidationResult {
  const fields = {} as Record<FieldName, string>;

  for (const [name, limit] of Object.entries(FIELD_LIMITS) as Array<
    [FieldName, number]
  >) {
    const raw = body[name];

    if (raw === undefined || raw === null) {
      fields[name] = '';
      continue;
    }

    if (typeof raw !== 'string') {
      return { ok: false, error: 'Please check your entries and try again.' };
    }

    const trimmed = raw.trim();
    if (trimmed.length > limit) {
      return { ok: false, error: 'Please check your entries and try again.' };
    }

    fields[name] = trimmed;
  }

  if (!fields.contactName || !fields.contactEmail || !fields.contactPhone) {
    return { ok: false, error: 'Please fill in all required fields.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(fields.contactEmail)) {
    return { ok: false, error: 'Please provide a valid email address.' };
  }

  return {
    ok: true,
    fields,
    isFundraiser: body.isFundraiser === true,
    hasVolunteers: body.hasVolunteers === true,
  };
}

export async function POST(request: NextRequest) {
  try {
    if (!checkRateLimit(getClientIp(request))) {
      return NextResponse.json(
        {
          error:
            'Too many requests. Please try again later or call us directly.',
        },
        { status: 429 }
      );
    }

    if (!isSameOrigin(request)) {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 403 });
    }

    // Read as text first so an oversized payload is rejected before parsing.
    const rawBody = await request.text();
    if (rawBody.length > MAX_BODY_BYTES) {
      return NextResponse.json(
        { error: 'Request too large.' },
        { status: 413 }
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    }

    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    }
    const body = parsed as Record<string, unknown>;

    // --- Bot gates. Both answer with the normal success payload. ---

    // Honeypot: a field no human ever sees, so any value means a bot.
    const honeypot = body.website;
    if (typeof honeypot !== 'string' || honeypot.trim() !== '') {
      console.warn('Contact form: honeypot triggered, dropping submission');
      return NextResponse.json(SUCCESS_BODY, { status: 200 });
    }

    // Minimum fill time, measured from form mount on the client.
    const stamp = body.formRenderedAt;
    const stampMs = typeof stamp === 'number' ? stamp : NaN;
    const elapsed = Date.now() - stampMs;
    if (!Number.isFinite(stampMs) || elapsed < MIN_FILL_MS) {
      console.warn(
        'Contact form: fill-time gate triggered, dropping submission'
      );
      return NextResponse.json(SUCCESS_BODY, { status: 200 });
    }

    // --- Field validation ---

    const result = validate(body);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    const { fields, isFundraiser, hasVolunteers } = result;

    // --- Delivery configuration ---

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        {
          error:
            'Email service is not configured. Please call us directly at the number listed.',
        },
        { status: 500 }
      );
    }

    // Fetch contact form recipients from Sanity
    let recipientEmails: string[] = [];
    try {
      const settings = await client.fetch(
        `*[_type == "siteSettings"][0]{ contactFormRecipients }`,
        {},
        { next: { revalidate: 60 } }
      );
      recipientEmails = settings?.contactFormRecipients || [];
    } catch (error) {
      console.error('Error fetching site settings from Sanity:', error);
    }

    // Fallback to environment variable if Sanity doesn't have recipients
    if (recipientEmails.length === 0 && process.env.CONTACT_EMAIL_TO) {
      recipientEmails = [process.env.CONTACT_EMAIL_TO];
    }

    // Ensure we have at least one recipient
    if (recipientEmails.length === 0) {
      console.error('No email recipients configured');
      return NextResponse.json(
        {
          error:
            'Email recipient is not configured. Please call us directly at the number listed.',
        },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const orNotSpecified = (value: string) => value || 'Not specified';

    // Build email content
    const emailContent = `
New Event Inquiry from ChrisCakes Website

===== EVENT DETAILS =====
Event Date: ${orNotSpecified(fields.eventStartDate)}
Event Start Time: ${orNotSpecified(fields.eventStartTime)}
Event End Time: ${orNotSpecified(fields.eventEndTime)}
Number to Serve: ${orNotSpecified(fields.numberToServe)}

===== LOCATION =====
Organization: ${orNotSpecified(fields.organizationName)}
Serving Address: ${orNotSpecified(fields.servingAddress)}
City: ${orNotSpecified(fields.city)}
State: ${orNotSpecified(fields.state)}
Zip: ${orNotSpecified(fields.zip)}

===== CONTACT INFORMATION =====
Name: ${fields.contactName}
Email: ${fields.contactEmail}
Phone: ${fields.contactPhone}
Day-of-Event Phone: ${fields.eventPhone || 'Same as above'}

===== EVENT PREFERENCES =====
Has 2-3 Volunteers: ${hasVolunteers ? 'Yes' : 'No'}
Is Fundraiser: ${isFundraiser ? 'Yes' : 'No'}
Fundraiser Type: ${fields.typeOfFundraiser || 'Not selected'}
Breakfast Type: ${fields.typeOfBreakfast || 'Not selected'}
Menus N More Type: ${fields.typeOfMenusNMore || 'Not selected'}

===== ADDITIONAL INFO =====
How They Heard About Us: ${orNotSpecified(fields.whereDidYouHear)}

Message:
${fields.message || 'No additional message'}

---
This inquiry was submitted via the ChrisCakes website contact form.
Reply directly to this email to respond to the customer.
    `;

    // Interpolated into a header line, so newlines must not survive.
    const subject = singleLine(
      `New Event Inquiry - ${fields.contactName} - ${fields.eventStartDate || 'TBD'}`
    );

    // Send individual email to each recipient
    // This ensures better tracking and avoids testing domain limitations
    const emailPromises = recipientEmails.map((recipient) =>
      resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: recipient,
        replyTo: fields.contactEmail,
        subject,
        text: emailContent,
      })
    );

    // Resend resolves with { data, error } rather than throwing, so a failed
    // delivery has to be read off the result. Without this the endpoint
    // reports success to the visitor and the inquiry is lost silently.
    const results = await Promise.allSettled(emailPromises);

    const failures = results.flatMap((result, index) => {
      const recipient = recipientEmails[index];
      if (result.status === 'rejected') {
        return [{ recipient, reason: String(result.reason) }];
      }
      if (result.value.error) {
        return [{ recipient, reason: String(result.value.error.message) }];
      }
      return [];
    });

    const delivered = recipientEmails.length - failures.length;

    if (failures.length > 0) {
      console.error('Contact form: delivery failed for', failures);
    }

    // Nothing got through — tell the visitor, so they can call instead.
    if (delivered === 0) {
      return NextResponse.json(
        {
          error:
            'Failed to send your inquiry. Please try again or call us directly.',
        },
        { status: 500 }
      );
    }

    console.log(
      `Email sent successfully to ${delivered} of ${recipientEmails.length} recipient(s)`
    );

    return NextResponse.json(SUCCESS_BODY, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);

    // Check if it's a Resend API error
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error:
            'Failed to send your inquiry. Please try again or call us directly.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
