import emailjs from '@emailjs/browser';

export class EmailService {
  // Initialize EmailJS
  static init() {
    if (typeof window !== 'undefined' && process.env.EMAILJS_PUBLIC_KEY) {
      emailjs.init(process.env.EMAILJS_PUBLIC_KEY);
    }
  }

  // Send booking confirmation email
  static async sendBookingConfirmation(email, booking, service, user) {
    try {
      const templateParams = {
        to_email: email,
        to_name: user.name,
        booking_number: booking.bookingNumber,
        service_name: service.name,
        booking_date: new Date(booking.date).toLocaleDateString(),
        booking_time: booking.time,
        duration: `${booking.hours} hours`,
        caregiver_name: booking.caregiverName || 'Assigned caregiver',
        total_amount: `$${booking.total.toFixed(2)}`,
        service_address: booking.address,
        special_requests: booking.specialRequests || 'None',
        contact_email: 'support@care.io',
        contact_phone: '(555) 123-4567'
      };

      if (process.env.EMAILJS_SERVICE_ID && process.env.EMAILJS_TEMPLATE_ID) {
        await emailjs.send(
          process.env.EMAILJS_SERVICE_ID,
          process.env.EMAILJS_TEMPLATE_ID,
          templateParams
        );
      }

      console.log('Booking confirmation email sent to:', email);
      return { success: true };
    } catch (error) {
      console.error('Error sending booking confirmation email:', error);
      return { success: false, error: error.message };
    }
  }

  // Send invoice email
  static async sendInvoice(email, invoiceData) {
    try {
      const templateParams = {
        to_email: email,
        to_name: invoiceData.to.name,
        invoice_number: invoiceData.invoiceNumber,
        invoice_date: invoiceData.date,
        due_date: invoiceData.dueDate,
        items: invoiceData.items.map(item => 
          `${item.description} - ${item.quantity} hours @ ${item.rate} = $${item.amount.toFixed(2)}`
        ).join('\n'),
        subtotal: `$${invoiceData.subtotal.toFixed(2)}`,
        tax: `$${invoiceData.tax.toFixed(2)}`,
        total: `$${invoiceData.total.toFixed(2)}`,
        payment_instructions: invoiceData.paymentInstructions,
        billing_address: invoiceData.to.address,
        contact_info: `${invoiceData.from.phone} | ${invoiceData.from.email}`
      };

      // In a real app, you'd use a different template for invoices
      if (process.env.EMAILJS_SERVICE_ID && process.env.EMAILJS_TEMPLATE_ID) {
        await emailjs.send(
          process.env.EMAILJS_SERVICE_ID,
          process.env.EMAILJS_TEMPLATE_ID,
          templateParams
        );
      }

      console.log('Invoice email sent to:', email);
      return { success: true };
    } catch (error) {
      console.error('Error sending invoice email:', error);
      return { success: false, error: error.message };
    }
  }

  // Send password reset email
  static async sendPasswordReset(email, resetLink) {
    try {
      const templateParams = {
        to_email: email,
        reset_link: resetLink,
        expiry_time: '1 hour',
        support_email: 'support@care.io'
      };

      if (process.env.EMAILJS_SERVICE_ID && process.env.EMAILJS_TEMPLATE_ID) {
        await emailjs.send(
          process.env.EMAILJS_SERVICE_ID,
          process.env.EMAILJS_TEMPLATE_ID,
          templateParams
        );
      }

      console.log('Password reset email sent to:', email);
      return { success: true };
    } catch (error) {
      console.error('Error sending password reset email:', error);
      return { success: false, error: error.message };
    }
  }

  // Send welcome email
  static async sendWelcomeEmail(email, name) {
    try {
      const templateParams = {
        to_email: email,
        to_name: name,
        welcome_message: `Welcome to CARE-IO, ${name}! We're excited to help you find the perfect care for your loved ones.`,
        dashboard_link: `${process.env.NEXT_PUBLIC_APP_URL}/my-bookings`,
        explore_services_link: `${process.env.NEXT_PUBLIC_APP_URL}`,
        support_email: 'support@care.io',
        support_phone: '(555) 123-4567'
      };

      if (process.env.EMAILJS_SERVICE_ID && process.env.EMAILJS_TEMPLATE_ID) {
        await emailjs.send(
          process.env.EMAILJS_SERVICE_ID,
          process.env.EMAILJS_TEMPLATE_ID,
          templateParams
        );
      }

      console.log('Welcome email sent to:', email);
      return { success: true };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error: error.message };
    }
  }
}

// Initialize on client side
if (typeof window !== 'undefined') {
  EmailService.init();
}

export default EmailService;