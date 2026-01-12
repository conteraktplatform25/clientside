import { Section, Text, Img, Hr } from '@react-email/components';
import { emailTheme } from '../theme/emailTheme';

type EmailHeaderProps = {
  logoUrl?: string;
  brandName?: string;
};

export default function EmailHeader({ logoUrl, brandName = 'Contakt' }: EmailHeaderProps) {
  return (
    <Section style={styles.wrapper}>
      <Section style={styles.brandRow}>
        {logoUrl && <Img src={logoUrl} alt={brandName} height='32' style={styles.logo} />}

        <Text style={styles.brandText}>{brandName}</Text>
      </Section>

      <Hr style={styles.divider} />
    </Section>
  );
}

const styles = {
  wrapper: {
    padding: '20px 32px 0 32px',
  },

  brandRow: {
    display: 'table', // email-safe layout
  },

  logo: {
    display: 'inline-block',
    verticalAlign: 'middle',
    marginRight: '8px',
  },

  brandText: {
    display: 'inline-block',
    verticalAlign: 'middle',
    margin: '0',
    fontSize: '18px',
    fontWeight: '700',
    color: emailTheme.colors.primary,
    lineHeight: '32px', // aligns text with logo height
  },

  divider: {
    border: 'none',
    borderTop: `1px solid ${emailTheme.colors.border}`,
    margin: '16px 0 0 0',
  },
};
