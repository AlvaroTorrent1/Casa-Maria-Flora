import { Resend } from 'resend';
import type { APIRoute } from 'astro';

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const message = String(formData.get('message') ?? '').trim();
  const referer = request.headers.get('referer');
  const redirectUrl = new URL(referer ?? '/', request.url);

  if (!name || !email || !message) {
    redirectUrl.searchParams.set('contact', 'error');
    return Response.redirect(redirectUrl.toString(), 303);
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  const toEmail = import.meta.env.RESEND_TO_EMAIL ?? 'hola@casa-maria-flora.com';
  const fromEmail = import.meta.env.RESEND_FROM_EMAIL ?? 'Casa Maria Flora <contact@casa-maria-flora.com>';

  if (!apiKey) {
    redirectUrl.searchParams.set('contact', 'error');
    return Response.redirect(redirectUrl.toString(), 303);
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: `Casa Maria Flora contact request from ${name}`,
      replyTo: email,
      html: `
        <h2>New contact request</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>
      `,
  });

  if (error) {
    redirectUrl.searchParams.set('contact', 'error');
    return Response.redirect(redirectUrl.toString(), 303);
  }

  redirectUrl.searchParams.set('contact', 'success');
  return Response.redirect(redirectUrl.toString(), 303);
};
