const orderTemplate = ({ username, orderDetails, orderId }) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Order Confirmation</title>
      <style>
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          background-color: #f8fafc;
          color: #222;
          margin: 0;
          padding: 0;
        }
        h1 {
          color: #28a745;
        }
        .container {
          max-width: 480px;
          margin: 40px auto;
          background: #fff;
          padding: 32px 24px;
          border-radius: 8px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Order Confirmation</h1>
        <p>Hi <strong>${username}</strong>,</p>
        <p>Your order with ID <strong>${orderId}</strong> has been successfully placed.</p>
        <p>Order Details:</p>
        <ul>
          ${orderDetails.map(item => `<li>${item.name} - ${item.quantity} @ ₦${item.price}</li>`).join('')}
        </ul>
        <p>Thank you for shopping with us!</p>
      </div>
    </body>
    </html>
  `;
};

export default orderTemplate;
