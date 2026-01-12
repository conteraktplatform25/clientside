// emails/WelcomeEmail.tsx
import { Html, Head, Body, Container, Text } from '@react-email/components';

type WelcomeEmailProps = {
  name: string;
};

export default function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Arial, sans-serif' }}>
        <Container>
          <Text>Hi {name},</Text>
          <Text>Welcome to our app 🎉</Text>
        </Container>
      </Body>
    </Html>
  );
}
