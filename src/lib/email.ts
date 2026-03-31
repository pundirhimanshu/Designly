import { Resend } from 'resend';

// NOTE: You must add RESEND_API_KEY to your .env file
const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function sendWelcomeEmail(toEmail: string, name: string, publicUrl: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Designly <welcome@designly.co.in>',
      to: [toEmail],
      subject: '✨ Your Portfolio is Live! Congratulations!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=swap');
            body { font-family: 'Inter', sans-serif; background-color: #f9fafb; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 32px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.05); border: 1px solid #eee; }
            .header { background: #FF5C00; padding: 60px 40px; text-align: center; color: white; }
            .header h1 { font-size: 32px; font-weight: 800; margin: 0; letter-spacing: -1px; }
            .content { padding: 40px; text-align: center; color: #1a1a1a; }
            .content p { font-size: 16px; line-height: 1.6; color: #666; margin-bottom: 32px; }
            .btn { display: inline-block; padding: 18px 36px; background: #FF5C00; color: white; text-decoration: none; border-radius: 100px; font-weight: 700; font-size: 16px; box-shadow: 0 10px 20px rgba(255, 92, 0, 0.2); transition: transform 0.2s; }
            .footer { padding: 32px; background: #fafafa; border-top: 1px solid #eee; text-align: center; font-size: 13px; color: #888; }
            .link-display { background: #f0f0f0; padding: 12px; border-radius: 12px; font-family: monospace; font-size: 14px; color: #FF5C00; margin-bottom: 24px; display: block; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>CONGRATULATIONS! 🚀</h1>
            </div>
            <div class="content">
              <p>Hey ${name},<br><br>The wait is over! Your professional portfolio has been launched and is now live for the world to see. This is a huge milestone in your design journey.</p>
              
              <span class="link-display">${publicUrl}</span>
              
              <a href="${publicUrl}" class="btn">View Your Live Portfolio</a>
              
              <p style="margin-top: 40px;">Ready to share? Post your link on LinkedIn, Twitter, or your local coffee shop's bulletin board. We're proud of you!</p>
            </div>
            <div class="footer">
              &copy; 2026 Designly. Built with ❤️ for designers.
            </div>
          </div>
        </body>
        </html>
      `
    });

    if (error) {
      console.error('Resend Error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Email Trigger Error:', err);
    return { success: false, error: err };
  }
}
