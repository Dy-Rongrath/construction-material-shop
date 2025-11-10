import nodemailer from 'nodemailer';

type OrderEmailPayload = {
  to: string;
  order: {
    id: string;
    totalAmount: number;
    createdAt: string | Date;
    items: Array<{ name: string; quantity: number; price: number }>;
    shippingAddress?: {
      firstName: string;
      lastName: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
    } | null;
  };
};

function getTransport() {
  if (
    !process.env.EMAIL_SMTP_HOST ||
    !process.env.EMAIL_SMTP_USER ||
    !process.env.EMAIL_SMTP_PASS
  ) {
    throw new Error('SMTP is not configured. Please set EMAIL_SMTP_HOST/USER/PASS');
  }

  const port = parseInt(process.env.EMAIL_SMTP_PORT || '587', 10);

  return nodemailer.createTransport({
    host: process.env.EMAIL_SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.EMAIL_SMTP_USER,
      pass: process.env.EMAIL_SMTP_PASS,
    },
  });
}

export async function sendOrderConfirmationEmail(payload: OrderEmailPayload) {
  const transporter = getTransport();
  const from = process.env.EMAIL_FROM || 'no-reply@example.com';

  const { order } = payload;
  const date = new Date(order.createdAt).toLocaleString();
  const itemsHtml = order.items
    .map(
      it => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee">${it.name}</td>
          <td style="padding:8px;border-bottom:1px solid #eee">${it.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee">$${it.price.toFixed(2)}</td>
          <td style="padding:8px;border-bottom:1px solid #eee">$${(it.quantity * it.price).toFixed(2)}</td>
        </tr>`
    )
    .join('');

  const addressHtml = order.shippingAddress
    ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br/>${order.shippingAddress.address}<br/>${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`
    : 'N/A';

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#111">
      <h2>Thank you for your order #${order.id.slice(-8)}</h2>
      <p>Placed on ${date}. Your order has been confirmed.</p>
      <h3>Order Summary</h3>
      <table style="border-collapse:collapse;width:100%">
        <thead>
          <tr style="background:#f5f5f5">
            <th style="text-align:left;padding:8px">Item</th>
            <th style="text-align:left;padding:8px">Qty</th>
            <th style="text-align:left;padding:8px">Unit Price</th>
            <th style="text-align:left;padding:8px">Total</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <p style="font-weight:700;margin-top:12px">Grand Total: $${order.totalAmount.toFixed(2)}</p>
      <h3>Shipping Address</h3>
      <p>${addressHtml}</p>
      <p style="margin-top:16px">You can download your receipt in your account.</p>
    </div>
  `;

  await transporter.sendMail({
    to: payload.to,
    from,
    subject: `Order Confirmation #${order.id.slice(-8)}`,
    html,
  });
}
