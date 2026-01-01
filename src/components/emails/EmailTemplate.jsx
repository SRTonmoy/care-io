import React from 'react';

const EmailTemplate = ({ type, data }) => {
  switch (type) {
    case 'booking_confirmation':
      return (
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>Booking Confirmed!</h1>
            <p style={styles.subtitle}>Your care service has been scheduled</p>
          </div>
          
          <div style={styles.content}>
            <div style={styles.infoCard}>
              <h2 style={styles.infoTitle}>Booking Details</h2>
              <div style={styles.infoGrid}>
                <div style={styles.infoItem}>
                  <strong>Booking Number:</strong>
                  <span>{data.bookingNumber}</span>
                </div>
                <div style={styles.infoItem}>
                  <strong>Service:</strong>
                  <span>{data.serviceName}</span>
                </div>
                <div style={styles.infoItem}>
                  <strong>Date:</strong>
                  <span>{new Date(data.date).toLocaleDateString()}</span>
                </div>
                <div style={styles.infoItem}>
                  <strong>Time:</strong>
                  <span>{data.time}</span>
                </div>
                <div style={styles.infoItem}>
                  <strong>Duration:</strong>
                  <span>{data.hours} hours</span>
                </div>
                <div style={styles.infoItem}>
                  <strong>Total Amount:</strong>
                  <span>${data.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div style={styles.addressCard}>
              <h3 style={styles.addressTitle}>Service Address</h3>
              <p style={styles.addressText}>{data.address}</p>
            </div>
            
            <div style={styles.instructions}>
              <h3 style={styles.instructionsTitle}>Next Steps</h3>
              <ol style={styles.instructionsList}>
                <li>Our team will assign a caregiver within 24 hours</li>
                <li>You'll receive caregiver details via email</li>
                <li>Caregiver will arrive 15 minutes before scheduled time</li>
                <li>Payment will be processed after service completion</li>
              </ol>
            </div>
            
            <div style={styles.cta}>
              <a href={`${process.env.NEXT_PUBLIC_APP_URL}/my-bookings`} style={styles.button}>
                View Booking Details
              </a>
            </div>
          </div>
          
          <div style={styles.footer}>
            <p style={styles.footerText}>
              Need help? Contact our support team at support@care.io or call (555) 123-4567
            </p>
            <p style={styles.copyright}>
              © {new Date().getFullYear()} CARE-IO. All rights reserved.
            </p>
          </div>
        </div>
      );

    case 'invoice':
      return (
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>Invoice #{data.invoiceNumber}</h1>
          </div>
          
          <div style={styles.content}>
            <div style={styles.invoiceHeader}>
              <div>
                <strong>From:</strong>
                <p>CARE-IO Services<br />
                123 Care Street<br />
                Healthcare City, HC 12345<br />
                (555) 123-4567<br />
                billing@care.io</p>
              </div>
              <div>
                <strong>To:</strong>
                <p>{data.to.name}<br />
                {data.to.email}<br />
                {data.to.phone}<br />
                {data.to.address}</p>
              </div>
            </div>
            
            <table style={styles.invoiceTable}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Description</th>
                  <th style={styles.tableHeader}>Quantity</th>
                  <th style={styles.tableHeader}>Rate</th>
                  <th style={styles.tableHeader}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, index) => (
                  <tr key={index}>
                    <td style={styles.tableCell}>{item.description}</td>
                    <td style={styles.tableCell}>{item.quantity}</td>
                    <td style={styles.tableCell}>{item.rate}</td>
                    <td style={styles.tableCell}>${item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" style={styles.tableFooter}>Subtotal</td>
                  <td style={styles.tableFooter}>${data.subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan="3" style={styles.tableFooter}>Tax (8%)</td>
                  <td style={styles.tableFooter}>${data.tax.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan="3" style={styles.tableFooterTotal}>Total</td>
                  <td style={styles.tableFooterTotal}>${data.total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
            
            <div style={styles.paymentInstructions}>
              <h3 style={styles.paymentTitle}>Payment Instructions</h3>
              <p style={styles.paymentText}>{data.paymentInstructions}</p>
              <p style={styles.dueDate}><strong>Due Date:</strong> {data.dueDate}</p>
            </div>
          </div>
          
          <div style={styles.footer}>
            <p style={styles.footerText}>
              Thank you for choosing CARE-IO. Please make payment within 7 days.
            </p>
          </div>
        </div>
      );

    case 'password_reset':
      return (
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>Reset Your Password</h1>
          </div>
          
          <div style={styles.content}>
            <p style={styles.paragraph}>
              You requested to reset your password. Click the button below to create a new password:
            </p>
            
            <div style={styles.cta}>
              <a href={data.resetLink} style={styles.button}>
                Reset Password
              </a>
            </div>
            
            <p style={styles.paragraph}>
              This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
            </p>
            
            <div style={styles.warning}>
              <strong>Note:</strong> For security reasons, never share this link with anyone.
            </div>
          </div>
          
          <div style={styles.footer}>
            <p style={styles.footerText}>
              If you're having trouble clicking the button, copy and paste this URL into your browser:
            </p>
            <p style={styles.link}>{data.resetLink}</p>
          </div>
        </div>
      );

    case 'welcome':
      return (
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>Welcome to CARE-IO, {data.name}! 👋</h1>
          </div>
          
          <div style={styles.content}>
            <p style={styles.paragraph}>
              We're excited to have you join our community of families who trust CARE-IO for their loved ones' care needs.
            </p>
            
            <div style={styles.features}>
              <h3 style={styles.featuresTitle}>Get Started:</h3>
              <ul style={styles.featuresList}>
                <li>Browse our care services</li>
                <li>Book your first care session</li>
                <li>Manage all bookings in one place</li>
                <li>Get 24/7 support when you need it</li>
              </ul>
            </div>
            
            <div style={styles.cta}>
              <a href={`${process.env.NEXT_PUBLIC_APP_URL}`} style={styles.button}>
                Explore Services
              </a>
            </div>
          </div>
          
          <div style={styles.footer}>
            <p style={styles.footerText}>
              Need help getting started? Contact our support team at support@care.io
            </p>
          </div>
        </div>
      );

    default:
      return (
        <div style={styles.container}>
          <h1 style={styles.title}>Email from CARE-IO</h1>
          <p style={styles.paragraph}>This is a default email template.</p>
        </div>
      );
  }
};

const styles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    padding: '40px 20px',
    textAlign: 'center',
    borderRadius: '8px 8px 0 0',
  },
  title: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 'bold',
  },
  subtitle: {
    margin: '10px 0 0',
    fontSize: '16px',
    opacity: 0.9,
  },
  content: {
    padding: '30px',
  },
  infoCard: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
  },
  infoTitle: {
    margin: '0 0 15px',
    fontSize: '18px',
    color: '#1e293b',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  addressCard: {
    backgroundColor: '#f0f9ff',
    border: '1px solid #bae6fd',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
  },
  addressTitle: {
    margin: '0 0 10px',
    fontSize: '16px',
    color: '#0369a1',
  },
  addressText: {
    margin: 0,
    color: '#0c4a6e',
  },
  instructions: {
    marginBottom: '30px',
  },
  instructionsTitle: {
    margin: '0 0 10px',
    fontSize: '16px',
    color: '#1e293b',
  },
  instructionsList: {
    margin: 0,
    paddingLeft: '20px',
    color: '#475569',
    lineHeight: '1.6',
  },
  cta: {
    textAlign: 'center',
    margin: '30px 0',
  },
  button: {
    display: 'inline-block',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    padding: '12px 30px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  footer: {
    backgroundColor: '#f1f5f9',
    padding: '20px',
    textAlign: 'center',
    borderRadius: '0 0 8px 8px',
  },
  footerText: {
    margin: '0 0 10px',
    color: '#64748b',
    fontSize: '14px',
  },
  copyright: {
    margin: '10px 0 0',
    color: '#94a3b8',
    fontSize: '12px',
  },
  paragraph: {
    margin: '0 0 20px',
    color: '#475569',
    lineHeight: '1.6',
  },
  warning: {
    backgroundColor: '#fef3c7',
    border: '1px solid #fbbf24',
    borderRadius: '6px',
    padding: '15px',
    marginTop: '20px',
    color: '#92400e',
  },
  link: {
    color: '#2563eb',
    wordBreak: 'break-all',
    fontSize: '14px',
  },
  invoiceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '30px',
  },
  invoiceTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '30px',
  },
  tableHeader: {
    backgroundColor: '#f1f5f9',
    padding: '12px',
    textAlign: 'left',
    borderBottom: '2px solid #e2e8f0',
    color: '#475569',
  },
  tableCell: {
    padding: '12px',
    borderBottom: '1px solid #e2e8f0',
    color: '#475569',
  },
  tableFooter: {
    padding: '12px',
    borderBottom: '1px solid #e2e8f0',
    fontWeight: 'bold',
    color: '#475569',
  },
  tableFooterTotal: {
    padding: '12px',
    backgroundColor: '#f0f9ff',
    fontWeight: 'bold',
    color: '#0369a1',
    fontSize: '18px',
  },
  paymentInstructions: {
    backgroundColor: '#f8fafc',
    padding: '20px',
    borderRadius: '8px',
  },
  paymentTitle: {
    margin: '0 0 10px',
    color: '#1e293b',
  },
  paymentText: {
    margin: '0 0 10px',
    color: '#475569',
  },
  dueDate: {
    margin: 0,
    color: '#dc2626',
  },
  features: {
    marginBottom: '30px',
  },
  featuresTitle: {
    margin: '0 0 10px',
    color: '#1e293b',
  },
  featuresList: {
    margin: 0,
    paddingLeft: '20px',
    color: '#475569',
    lineHeight: '1.6',
  },
};

export default EmailTemplate;