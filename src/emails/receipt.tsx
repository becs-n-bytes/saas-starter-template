import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Hr,
  Link,
} from '@react-email/components';

interface ReceiptEmailProps {
  customerName: string;
  productName: string;
  amount: number;
  currency: string;
  date: Date;
}

export default function ReceiptEmail({
  customerName,
  productName,
  amount,
  currency,
  date,
}: ReceiptEmailProps) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'My SaaS';

  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount / 100);

  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Html lang="en">
      <Head />
      <Preview>
        Your receipt from {appName} — {formattedAmount}
      </Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={card}>
            <Heading style={heading}>Payment Receipt</Heading>
            <Text style={text}>Hi {customerName}, thanks for your payment.</Text>

            <Section style={receiptBox}>
              <Text style={receiptLabel}>Product</Text>
              <Text style={receiptValue}>{productName}</Text>

              <Text style={receiptLabel}>Amount</Text>
              <Text style={receiptValue}>{formattedAmount}</Text>

              <Text style={receiptLabel}>Date</Text>
              <Text style={receiptValue}>{formattedDate}</Text>
            </Section>

            <Hr style={hr} />

            <Text style={footer}>
              Questions about this charge? Reply to this email or contact{' '}
              <Link href={`mailto:billing@yourdomain.com`} style={link}>
                billing@yourdomain.com
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

ReceiptEmail.PreviewProps = {
  customerName: 'Jane Doe',
  productName: 'Pro Plan — Monthly',
  amount: 999,
  currency: 'USD',
  date: new Date(),
} satisfies ReceiptEmailProps;

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

const receiptBox = {
  backgroundColor: '#fafafa',
  borderRadius: '6px',
  padding: '16px',
  margin: '16px 0',
};

const receiptLabel = {
  fontSize: '12px',
  color: '#a1a1aa',
  textTransform: 'uppercase' as const,
  margin: '0 0 2px',
  letterSpacing: '0.5px',
};

const receiptValue = {
  fontSize: '14px',
  fontWeight: '600' as const,
  color: '#18181b',
  margin: '0 0 12px',
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
