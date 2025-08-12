const passwordResetTemplate = (username, resetLink) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
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
          color: #007bff;
          font-size: 1.6em;
          margin-bottom: 16px;
        }
        p {
          font-size: 1em;
          margin-bottom: 18px;
        }
        .btn {
          display: inline-block;
          padding: 12px 28px;
          background-color: #007bff;
          color: #fff !important;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 600;
          font-size: 1em;
          margin-bottom: 24px;
          transition: background 0.2s;
        }
        .btn:hover {
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
        <h1>Password Reset Request</h1>
        <p>Hi <strong>${username}</strong>,</p>
        <p>We received a request to reset your password. Click the button below to reset it:</p>
        <p style="text-align:center;">
          <a href="${resetLink}" class="btn">Reset Password</a>
        </p>
        <p>If you did not request this change, you can safely ignore this email.</p>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Swift Errand. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
}

export default passwordResetTemplate;