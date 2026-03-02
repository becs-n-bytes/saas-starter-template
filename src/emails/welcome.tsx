import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Hr,
  Link,
} from '@react-email/components';

interface WelcomeEmailProps {
  name: string;
}

export default function WelcomeEmail({ name }: WelcomeEmailProps) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'My SaaS';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return (
    <Html lang="en">
      <Head />
      <Preview>Welcome to {appName} — let&apos;s get started</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={card}>
            <Heading style={heading}>Welcome, {name}!</Heading>
            <Text style={text}>
              Thanks for signing up for {appName}. We&apos;re excited to have
              you on board.
            </Text>
            <Text style={text}>
              Your account is ready to go. Click the button below to get started
              with your dashboard.
            </Text>
            <Button href={`${siteUrl}/dashboard`} style={button}>
              Go to Dashboard
            </Button>
            <Hr style={hr} />
            <Text style={footer}>
              If you have any questions, reply to this email or visit our{' '}
              <Link href={siteUrl} style={link}>
                website
              </Link>
              .
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

WelcomeEmail.PreviewProps = {
  name: 'Jane',
} satisfies WelcomeEmailProps;

const body = {
  backgroundColor: '#f4f4f5',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '560px',
};

const card = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  padding: '32px',
};

const heading = {
  fontSize: '24px',
  fontWeight: '700' as const,
  color: '#18181b',
  margin: '0 0 8px',
};

const text = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#52525b',
  margin: '0 0 16px',
};

const button = {
  backgroundColor: '#18181b',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600' as const,
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 24px',
  margin: '24px 0',
};

const hr = {
  borderColor: '#e4e4e7',
  margin: '24px 0',
};

const footer = {
  fontSize: '14px',
  color: '#a1a1aa',
  margin: '0',
};

const link = {
  color: '#18181b',
  textDecoration: 'underline',
};
