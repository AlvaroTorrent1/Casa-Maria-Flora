import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Check if API key exists
    const apiKey = import.meta.env.RESEND_API_KEY;
    console.log('API Key exists:', !!apiKey);
    console.log('API Key prefix:', apiKey?.substring(0, 10) + '...');
    
    if (!apiKey) {
      console.error('RESEND_API_KEY is not configured');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Email service not configured' 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const resend = new Resend(apiKey);
    
    const formData = await request.formData();
    
    const name = formData.get('name')?.toString() || '';
    const email = formData.get('email')?.toString() || '';
    const project = formData.get('project')?.toString() || 'Not specified';
    const message = formData.get('message')?.toString() || '';

    console.log('Form data received:', { name, email, project, messageLength: message.length });

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Please fill in all required fields' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('Attempting to send email via Resend...');

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'Elske Lena Website <onboarding@resend.dev>',
      to: ['elskelena@icloud.com'],
      replyTo: email,
      subject: `New Contact Form: ${project} - ${name}`,
      html: `
        <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: #988051; font-size: 24px; margin-bottom: 30px;">New Contact Form Submission</h1>
          
          <div style="background-color: #f5f2eb; padding: 30px; border-radius: 4px;">
            <p style="margin: 0 0 20px; color: #2c2a26;">
              <strong style="color: #988051;">Name:</strong><br/>
              ${name}
            </p>
            
            <p style="margin: 0 0 20px; color: #2c2a26;">
              <strong style="color: #988051;">Email:</strong><br/>
              <a href="mailto:${email}" style="color: #988051;">${email}</a>
            </p>
            
            <p style="margin: 0 0 20px; color: #2c2a26;">
              <strong style="color: #988051;">Project Type:</strong><br/>
              ${project}
            </p>
            
            <p style="margin: 0; color: #2c2a26;">
              <strong style="color: #988051;">Message:</strong><br/>
              ${message.replace(/\n/g, '<br/>')}
            </p>
          </div>
          
          <p style="margin-top: 30px; font-size: 12px; color: #7a7568;">
            This message was sent from the Elske Lena website contact form.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend API error:', JSON.stringify(error, null, 2));
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Resend error: ${error.message || 'Unknown error'}`,
          details: error
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('Email sent successfully:', data?.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully',
        id: data?.id 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('Contact form exception:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Exception: ${errorMessage}` 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
