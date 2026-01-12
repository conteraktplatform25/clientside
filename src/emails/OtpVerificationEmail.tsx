import { Heading, Text, Section, Hr, Link } from '@react-email/components';
import EmailLayout from './components/EmailLayout';
import { emailTheme } from './theme/emailTheme';

export default function OtpVerificationEmail({
  fullName,
  email,
  otpCode,
  expiryMinutes,
  supportEmail,
}: {
  fullName: string;
  email: string;
  otpCode: string;
  expiryMinutes: number;
  supportEmail: string;
}) {
  return (
    <EmailLayout
      supportEmail={supportEmail}
      logoUrl={
        'https://hamkmsacitedfbxxixte.supabase.co/storage/v1/object/public/contakt_assets/uploads/my-contakt-logo/logo.png'
      }
    >
      <Heading as='h1' style={styles.heading}>
        Registration request
      </Heading>

      <Text style={styles.paragraph}>
        Hi <span style={styles.strong}>{fullName}</span>,
      </Text>

      <Text style={styles.paragraph}>
        We received your registration request for <span style={styles.strong}>{email}</span>. Use the OTP below. This
        code expires in <strong>{expiryMinutes} minutes</strong>.
      </Text>

      <Section style={styles.otpWrapper}>
        <div style={styles.otpBox}>
          <Text style={styles.otpCode}>
            👉 <span style={styles.otpMono}>{otpCode}</span>
          </Text>
          <Text style={styles.otpLabel}>One-Time Passcode</Text>
        </div>
      </Section>

      <Hr style={styles.divider} />

      <Text style={styles.smallText}>
        Didn’t request this? Contact{' '}
        <Link href={`mailto:${supportEmail}`} style={styles.link}>
          {supportEmail}
        </Link>
        .
      </Text>
    </EmailLayout>
  );
}

const styles = {
  heading: {
    margin: '0 0 8px 0',
    fontSize: emailTheme.typography.h1.fontSize,
    fontWeight: emailTheme.typography.h1.fontWeight,
    color: emailTheme.colors.neutral900,
  },

  paragraph: {
    margin: '0 0 18px 0',
    fontSize: emailTheme.typography.body.fontSize,
    lineHeight: emailTheme.typography.body.lineHeight,
    color: emailTheme.colors.neutralBase,
  },

  strong: {
    fontWeight: '600',
    color: emailTheme.colors.black,
  },

  otpWrapper: {
    margin: '18px 0',
    textAlign: 'center' as const,
  },

  otpBox: {
    display: 'inline-block',
    padding: '18px 22px',
    borderRadius: '8px',
    backgroundColor: emailTheme.colors.primary50,
    border: `1px solid ${emailTheme.colors.primary200}`,
  },

  otpCode: {
    margin: '0',
    fontSize: '24px',
    letterSpacing: '3px',
    fontWeight: '700',
    color: emailTheme.colors.primary800,
  },

  otpMono: {
    fontFamily: "'Courier New', monospace",
  },

  otpLabel: {
    marginTop: '6px',
    fontSize: emailTheme.typography.small.fontSize,
    color: emailTheme.colors.neutral500,
  },

  divider: {
    border: 'none',
    borderTop: `1px solid ${emailTheme.colors.neutral50}`,
    margin: '20px 0',
  },

  smallText: {
    fontSize: emailTheme.typography.small.fontSize,
    color: emailTheme.colors.neutral500,
  },

  link: {
    color: emailTheme.colors.primary,
    textDecoration: 'none',
  },
};
