import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { userEmail, userName, bookingData, serviceName } = await request.json();

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: `"Care.IO" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Booking Invoice - ${serviceName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">Care.IO Booking Invoice</h2>
          <p>Dear ${userName},</p>
          <p>Thank you for booking with Care.IO! Here's your booking summary:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Service</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${serviceName}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Duration</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${bookingData.duration} ${bookingData.durationType}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Total Cost</td>
              <td style="padding: 10px; border: 1px solid #ddd;">৳${bookingData.totalCost}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Status</td>
              <td style="padding: 10px; border: 1px solid #ddd;">Pending</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Booking Date</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${new Date().toLocaleDateString()}</td>
            </tr>
          </table>
          
          <p>You can track your booking status in your account dashboard.</p>
          <p>Best regards,<br/>The Care.IO Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Invoice email sent successfully" });
  } catch (error) {
   
    return NextResponse.json(
      { message: "Failed to send email" },
      { status: 500 }
    );
  }
}