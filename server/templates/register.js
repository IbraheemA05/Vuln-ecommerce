const registerTemplate = (username) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Swift Errand!</title>
      <style>
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          background-color: #f8fafc;
          color: #222;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 480px;
          margin: 40px auto;
          background: #fff;
          padding: 32px 24px;
          border-radius: 8px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
        }
        h1 {
          color: #28a745;
          font-size: 1.8em;
          margin-bottom: 16px;
        }
        p {
          font-size: 1.08em;
          margin-bottom: 18px;
        }
        .cta {
          display: block;
          width: fit-content;
          margin: 24px auto 0 auto;
          padding: 12px 28px;
          background-color: #007bff;
          color: #fff !important;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 600;
          font-size: 1em;
          transition: background 0.2s;
        }
        .cta:hover {
          background-color: #0056b3;
        }
        .footer {
          font-size: 0.95em;
          color: #888;
          margin-top: 32px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to Swift Errand, ${username}!</h1>
        <p>Thank you for joining <strong>Swift Errand</strong>. Your account has been created successfully.</p>
        <p>We're excited to have you on board. You can now log in and start exploring our services—order, track, and manage errands with ease!</p>
        <a href="https://yourfrontend.com/login" class="cta">Log In to Your Account</a>
        <p style="margin-top:24px;">If you have any questions or need help, just reply to this email or contact our support team.</p>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Swift Errand. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
};

export default registerTemplate;