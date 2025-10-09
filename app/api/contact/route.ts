import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { client } from '@/lib/sanity';

const resend = new Resend(process.env.RESEND_API_KEY);

// Simple rate limiting using in-memory store
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 3; // Max submissions per time window
const TIME_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
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

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          error:
            'Too many requests. Please try again later or call us directly.',
        },
        { status: 429 }
      );
    }

    // Validate environment variable
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

    const body = await request.json();

    // Basic validation
    if (!body.contactName || !body.contactEmail || !body.contactPhone) {
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.contactEmail)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // Build email content
    const emailContent = `
New Event Inquiry from ChrisCakes Website

===== EVENT DETAILS =====
Event Date: ${body.eventStartDate || 'Not specified'}
Event Start Time: ${body.eventStartTime || 'Not specified'}
Event End Time: ${body.eventEndTime || 'Not specified'}
Number to Serve: ${body.numberToServe || 'Not specified'}

===== LOCATION =====
Organization: ${body.organizationName || 'Not specified'}
Serving Address: ${body.servingAddress || 'Not specified'}
City: ${body.city || 'Not specified'}
State: ${body.state || 'Not specified'}
Zip: ${body.zip || 'Not specified'}

===== CONTACT INFORMATION =====
Name: ${body.contactName}
Email: ${body.contactEmail}
Phone: ${body.contactPhone}
Day-of-Event Phone: ${body.eventPhone || 'Same as above'}

===== EVENT PREFERENCES =====
Has 2-3 Volunteers: ${body.hasVolunteers ? 'Yes' : 'No'}
Is Fundraiser: ${body.isFundraiser ? 'Yes' : 'No'}
Fundraiser Type: ${body.typeOfFundraiser || 'Not selected'}
Breakfast Type: ${body.typeOfBreakfast || 'Not selected'}
Menus N More Type: ${body.typeOfMenusNMore || 'Not selected'}

===== ADDITIONAL INFO =====
How They Heard About Us: ${body.whereDidYouHear || 'Not specified'}

Message:
${body.message || 'No additional message'}

---
This inquiry was submitted via the ChrisCakes website contact form.
Reply directly to this email to respond to the customer.
    `;

    // Send individual email to each recipient
    // This ensures better tracking and avoids testing domain limitations
    const emailPromises = recipientEmails.map((recipient) =>
      resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: recipient,
        replyTo: body.contactEmail,
        subject: `New Event Inquiry - ${body.contactName} - ${body.eventStartDate || 'TBD'}`,
        text: emailContent,
      }),
    );

    const results = await Promise.all(emailPromises);

    console.log(
      `Email sent successfully to ${recipientEmails.length} recipient(s):`,
      recipientEmails,
    );
    console.log('Resend results:', results);

    return NextResponse.json(
      { success: true, message: 'Your inquiry has been sent successfully!' },
      { status: 200 }
    );
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
