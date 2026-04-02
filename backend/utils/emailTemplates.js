export const orderConfirmationTemplate = (order) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .header { background: #f8a5c2; padding: 20px; text-align: center; color: white; }
    .content { padding: 20px; }
    .order-item { border-bottom: 1px solid #eee; padding: 10px 0; }
    .footer { background: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🍽️ Order #${order._id}</h1>
  </div>
  <div class="content">
    <h2>Dear ${order.customerName},</h2>
    <p>Your order has been <strong>${order.status.toUpperCase()}</strong>!</p>
    <h3>Order Details:</h3>
    ${order.items
      .map(
        (item) => `<div class="order-item">
      <strong>${item.name}</strong> × ${item.quantity} = ₹${item.price * item.quantity}
    </div>`,
      )
      .join("")}
    <p><strong>Total: ₹${order.totalPrice}</strong></p>
    <p>Payment: ${order.payment.method} (${order.payment.status})</p>
  </div>
  <div class="footer">
    <p>Thank you for dining with us!</p>
  </div>
</body>
</html>
`;

export const reservationConfirmationTemplate = (reservation) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
  </style>
</head>
<body>
  <h2>✅ Reservation Confirmed</h2>
  <p>Dear ${reservation.customerName},</p>
  <p>Your reservation #${reservation._id} is confirmed:</p>
  <ul>
    <li>Date: ${reservation.date}</li>
    <li>Time: ${reservation.time}</li>
    <li>Guests: ${reservation.guests}</li>
  </ul>
  <p>${reservation.specialRequests ? "Special request: " + reservation.specialRequests : ""}</p>
  <p>We look forward to serving you!</p>
</body>
</html>
`;
