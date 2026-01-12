import { Html, Head, Body, Container, Section, Text, Link } from '@react-email/components';
import { emailTheme } from '../theme/emailTheme';
import EmailHeader from './EmailHeader';

type EmailLayoutProps = {
  children: React.ReactNode;
  supportEmail: string;
  logoUrl?: string;
  year?: number;
};

export default function EmailLayout({
  children,
  supportEmail,
  logoUrl,
  year = new Date().getFullYear(),
}: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <EmailHeader logoUrl={logoUrl} />

          {/* Main Content */}
          <Section style={styles.content}>{children}</Section>

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerLeft}>
              <Link href={`mailto:${supportEmail}`} style={styles.link}>
                {supportEmail}
              </Link>
            </Text>

            <Text style={styles.footerRight}>© {year} Contakt Customer Relationship Platform</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: emailTheme.colors.background,
    fontFamily: emailTheme.typography.fontFamily,
  },

  container: {
    maxWidth: emailTheme.layout.maxWidth,
    margin: '0 auto',
    backgroundColor: emailTheme.colors.white,
    border: `1px solid ${emailTheme.colors.border}`,
  },

  content: {
    padding: emailTheme.spacing.containerPadding,
  },

  footer: {
    padding: emailTheme.spacing.footerPadding,
    backgroundColor: '#fbfdff',
    borderTop: `1px solid ${emailTheme.colors.border}`,
  },

  footerLeft: {
    fontSize: emailTheme.typography.small.fontSize,
    color: emailTheme.colors.neutral500,
    margin: '0 0 6px 0',
  },

  footerRight: {
    fontSize: '12px',
    color: emailTheme.colors.neutral500,
    opacity: 0.85,
    textAlign: 'right' as const,
  },

  link: {
    color: emailTheme.colors.primary,
    textDecoration: 'none',
  },
};
