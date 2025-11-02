import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { email, fileIds } = await request.json();

    if (!email || !fileIds || fileIds.length === 0) {
      return NextResponse.json(
        { error: 'Email and file IDs required' },
        { status: 400 }
      );
    }

    const downloadLinks = fileIds.map((id: number) => 
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/download/${id}`
    );

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@file2pdf.com',
      subject: 'Your converted PDF files are ready',
      text: `Your files have been converted to PDF. Download them here:\n\n${downloadLinks.join('\n')}`,
      html: `
        <h2>Your files are ready!</h2>
        <p>Your files have been converted to PDF. Click the links below to download:</p>
        <ul>
          ${downloadLinks.map((link: string) => `<li><a href="${link}">Download PDF</a></li>`).join('')}
        </ul>
        <p><small>These links will expire in 1 hour.</small></p>
      `,
    };

    await sgMail.send(msg);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}