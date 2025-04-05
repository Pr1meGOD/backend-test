import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import WelcomeEmail from './WelcomeEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { email, name } = await request.json();
    // Test comment
    // Add 'await' here (critical fix)
    const emailHtml = await render(<WelcomeEmail userFirstname={name} />);

// In route.js
const { data, error } = await resend.emails.send({
  from: 'KJ Lost & Found <noreply@kjslaf.xyz>',
  to: email,
  subject: 'Your KJSLAF account is ready!',
  html: emailHtml,
});
    if (error) throw error;

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}