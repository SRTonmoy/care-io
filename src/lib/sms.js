import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

export class SmsService {
  // Send booking confirmation SMS
  static async sendBookingConfirmation(phoneNumber, booking) {
    try {
      const message = await client.messages.create({
        body: `CARE-IO: Your booking #${booking.bookingNumber} has been confirmed for ${booking.date}. Caregiver will arrive at ${booking.startTime}. Need help? Call (555) 123-4567`,
        from: twilioPhoneNumber,
        to: phoneNumber,
      });
      
      return { success: true, messageId: message.sid };
    } catch (error) {
      console.error('Error sending booking confirmation SMS:', error);
      return { success: false, error: error.message };
    }
  }

  // Send booking reminder SMS (24 hours before)
  static async sendBookingReminder(phoneNumber, booking) {
    try {
      const message = await client.messages.create({
        body: `CARE-IO Reminder: Your care service is scheduled for tomorrow at ${booking.startTime}. Caregiver: ${booking.caregiver?.name || 'To be assigned'}. Call (555) 123-4567 for changes.`,
        from: twilioPhoneNumber,
        to: phoneNumber,
      });
      
      return { success: true, messageId: message.sid };
    } catch (error) {
      console.error('Error sending booking reminder SMS:', error);
      return { success: false, error: error.message };
    }
  }

  // Send booking cancellation SMS
  static async sendBookingCancellation(phoneNumber, booking, reason) {
    try {
      const message = await client.messages.create({
        body: `CARE-IO: Your booking #${booking.bookingNumber} has been cancelled. Reason: ${reason}. Refund will be processed within 5-7 business days.`,
        from: twilioPhoneNumber,
        to: phoneNumber,
      });
      
      return { success: true, messageId: message.sid };
    } catch (error) {
      console.error('Error sending cancellation SMS:', error);
      return { success: false, error: error.message };
    }
  }

  // Send caregiver assignment SMS
  static async sendCaregiverAssignment(phoneNumber, booking, caregiver) {
    try {
      const message = await client.messages.create({
        body: `CARE-IO: Your caregiver has been assigned! ${caregiver.name} will provide your care service. Experience: ${caregiver.experience} years. Contact: ${caregiver.phone || 'Via CARE-IO platform'}`,
        from: twilioPhoneNumber,
        to: phoneNumber,
      });
      
      return { success: true, messageId: message.sid };
    } catch (error) {
      console.error('Error sending caregiver assignment SMS:', error);
      return { success: false, error: error.message };
    }
  }

  // Send payment confirmation SMS
  static async sendPaymentConfirmation(phoneNumber, booking, amount) {
    try {
      const message = await client.messages.create({
        body: `CARE-IO: Payment of $${amount.toFixed(2)} for booking #${booking.bookingNumber} has been confirmed. Receipt sent to your email.`,
        from: twilioPhoneNumber,
        to: phoneNumber,
      });
      
      return { success: true, messageId: message.sid };
    } catch (error) {
      console.error('Error sending payment confirmation SMS:', error);
      return { success: false, error: error.message };
    }
  }

  // Send OTP for verification
  static async sendVerificationCode(phoneNumber, code) {
    try {
      const message = await client.messages.create({
        body: `Your CARE-IO verification code is: ${code}. This code will expire in 10 minutes.`,
        from: twilioPhoneNumber,
        to: phoneNumber,
      });
      
      return { success: true, messageId: message.sid };
    } catch (error) {
      console.error('Error sending verification SMS:', error);
      return { success: false, error: error.message };
    }
  }

  // Send emergency alert
  static async sendEmergencyAlert(phoneNumber, booking, emergencyType) {
    try {
      const message = await client.messages.create({
        body: `URGENT: Emergency alert for booking #${booking.bookingNumber}. Type: ${emergencyType}. Please check the CARE-IO platform immediately or call emergency services.`,
        from: twilioPhoneNumber,
        to: phoneNumber,
        priority: 'high',
      });
      
      return { success: true, messageId: message.sid };
    } catch (error) {
      console.error('Error sending emergency alert SMS:', error);
      return { success: false, error: error.message };
    }
  }
}

export default SmsService;