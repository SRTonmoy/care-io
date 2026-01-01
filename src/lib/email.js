import { Resend } from 'resend';
import EmailTemplate from '@/components/emails/EmailTemplate';

const resend = new Resend(process.env.RESEND_API_KEY);

export class EmailService {
  // Send booking confirmation email
  static async sendBookingConfirmation(email, booking, service, user) {
    try {
      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'CARE-IO <noreply@care.io>',
        to: email,
        subject: `Booking Confirmation - #${booking.bookingNumber}`,
        react: EmailTemplate({
          type: 'booking_confirmation',
          data: {
            bookingNumber: booking.bookingNumber,
            serviceName: service.name,
            date: booking.date,
            time: booking.startTime,
            hours: booking.hours,
            address: booking.address,
            totalAmount: booking.finalAmount,
            userName: user.name,
          },
        }),
      });

      if (error) {
        console.error('Error sending booking confirmation email:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error sending booking confirmation email:', error);
      return { success: false, error };
    }
  }

  // Send invoice email
  static async sendInvoice(email, invoiceData) {
    try {
      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'CARE-IO <noreply@care.io>',
        to: email,
        subject: `Invoice #${invoiceData.invoiceNumber}`,
        react: EmailTemplate({
          type: 'invoice',
          data: invoiceData,
        }),
      });

      if (error) {
        console.error('Error sending invoice email:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error sending invoice email:', error);
      return { success: false, error };
    }
  }

  // Send password reset email
  static async sendPasswordReset(email, resetLink) {
    try {
      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'CARE-IO <noreply@care.io>',
        to: email,
        subject: 'Reset Your CARE-IO Password',
        react: EmailTemplate({
          type: 'password_reset',
          data: { resetLink },
        }),
      });

      if (error) {
        console.error('Error sending password reset email:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error sending password reset email:', error);
      return { success: false, error };
    }
  }

  // Send welcome email
  static async sendWelcomeEmail(email, name) {
    try {
      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'CARE-IO <noreply@care.io>',
        to: email,
        subject: 'Welcome to CARE-IO!',
        react: EmailTemplate({
          type: 'welcome',
          data: { name },
        }),
      });

      if (error) {
        console.error('Error sending welcome email:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error };
    }
  }

  // Send booking reminder email
  static async sendBookingReminder(email, booking) {
    try {
      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'CARE-IO <noreply@care.io>',
        to: email,
        subject: `Reminder: Your Care Service Tomorrow`,
        react: EmailTemplate({
          type: 'reminder',
          data: booking,
        }),
      });

      if (error) {
        console.error('Error sending reminder email:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error sending reminder email:', error);
      return { success: false, error };
    }
  }

  // Send caregiver assigned email
  static async sendCaregiverAssigned(email, booking, caregiver) {
    try {
      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'CARE-IO <noreply@care.io>',
        to: email,
        subject: `Your Caregiver Has Been Assigned - #${booking.bookingNumber}`,
        react: EmailTemplate({
          type: 'caregiver_assigned',
          data: { booking, caregiver },
        }),
      });

      if (error) {
        console.error('Error sending caregiver assignment email:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error sending caregiver assignment email:', error);
      return { success: false, error };
    }
  }

  // Send booking cancellation email
  static async sendBookingCancellation(email, booking, reason) {
    try {
      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'CARE-IO <noreply@care.io>',
        to: email,
        subject: `Booking Cancelled - #${booking.bookingNumber}`,
        react: EmailTemplate({
          type: 'cancellation',
          data: { booking, reason },
        }),
      });

      if (error) {
        console.error('Error sending cancellation email:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error sending cancellation email:', error);
      return { success: false, error };
    }
  }

  // Send refund confirmation email
  static async sendRefundConfirmation(email, booking, refundAmount) {
    try {
      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'CARE-IO <noreply@care.io>',
        to: email,
        subject: `Refund Processed - #${booking.bookingNumber}`,
        react: EmailTemplate({
          type: 'refund',
          data: { booking, refundAmount },
        }),
      });

      if (error) {
        console.error('Error sending refund confirmation email:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error sending refund confirmation email:', error);
      return { success: false, error };
    }
  }
}

export default EmailService;