// components/emails/Welcome.tsx
import { Html, Head, Body, Text, Container, Section } from '@react-email/components';
import * as React from 'react';

interface IWelcomeEmailProps {
  name: string;
  email: string;
  token: string;
}

const WelcomeEmail: React.FC<IWelcomeEmailProps> = ({ name, email, token }) => {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Section>
            <Text>Welcome, {name}!</Text>
            <Text>Thank you for registering with your email: {email}</Text>
            <Text>
              If this is a verification, click <a href={`https://localhost:3000/verify?token=${token}`}>here</a>.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;
// }
