import { Section, Text, Button } from '@react-email/components';
import EmailLayout from './components/EmailLayout';
import { emailTheme } from './theme/emailTheme';

interface ITeamMemberInviteEmailProps {
  inviterName: string;
  businessName: string;
  inviteUrl: string;
  supportEmail: string;
  expiryHour: number;
}

export default function TeamMemberInviteEmail({
  inviterName,
  businessName,
  inviteUrl,
  expiryHour,
  supportEmail,
}: ITeamMemberInviteEmailProps) {
  return (
    <EmailLayout
      supportEmail={supportEmail}
      logoUrl={
        'https://hamkmsacitedfbxxixte.supabase.co/storage/v1/object/public/contakt_assets/uploads/my-contakt-logo/logo.png'
      }
    >
      <Section>
        <Text style={styles.heading}>
          You’ve been invited to join <strong>{businessName}</strong>
        </Text>

        <Text style={styles.body}>
          {inviterName} has invited you to collaborate on <strong>{businessName}</strong> using Contakt platform.
        </Text>

        <Text style={styles.body}>
          You’ll be able to manage conversations, customers, and WhatsApp automation based on the role assigned to you.
        </Text>

        <Section style={styles.buttonWrapper}>
          <Button href={inviteUrl} style={styles.button}>
            Accept Invitation
          </Button>
        </Section>

        <Text style={styles.note}>
          This invitation will expire in <strong>{expiryHour} hours</strong>. If you weren’t expecting this invitation,
          you can safely ignore this email.
        </Text>

        <Text style={styles.signature}>— The Contakt Team</Text>
      </Section>
    </EmailLayout>
  );
}

const styles = {
  heading: {
    fontSize: emailTheme.typography.h1.fontSize,
    fontWeight: emailTheme.typography.h1.fontWeight,
    color: emailTheme.colors.neutral900,
    marginBottom: '12px',
  },

  body: {
    fontSize: emailTheme.typography.body.fontSize,
    lineHeight: emailTheme.typography.body.lineHeight,
    color: emailTheme.colors.neutral700,
    marginBottom: '12px',
  },

  buttonWrapper: {
    margin: '24px 0',
    textAlign: 'center' as const,
  },

  button: {
    backgroundColor: emailTheme.colors.primary,
    color: emailTheme.colors.white,
    padding: '12px 20px',
    borderRadius: '6px',
    fontWeight: '600',
    textDecoration: 'none',
    display: 'inline-block',
  },

  note: {
    fontSize: emailTheme.typography.small.fontSize,
    color: emailTheme.colors.neutral500,
    marginTop: '16px',
  },

  signature: {
    marginTop: '24px',
    fontSize: emailTheme.typography.small.fontSize,
    color: emailTheme.colors.neutral500,
  },
};
