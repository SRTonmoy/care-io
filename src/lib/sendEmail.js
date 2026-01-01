import nodemailer from "nodemailer";

export async function sendInvoiceEmail({ to, booking }) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"Care.IO" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Care.IO Booking Confirmation",
    html: `
      <h2>Booking Confirmed</h2>
      <p><strong>Service:</strong> ${booking.service}</p>
      <p><strong>Date:</strong> ${booking.date}</p>
      <p><strong>Address:</strong> ${booking.address}</p>
      <p><strong>Caregiver:</strong> ${booking.caregiver}</p>
      <p><strong>Price:</strong> ৳${booking.price}</p>
      <hr/>
      <p>Thank you for trusting Care.IO</p>
    `
  };

  await transporter.sendMail(mailOptions);
}
