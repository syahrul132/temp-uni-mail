/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface EmailChangeEmailProps {
  siteName: string
  email: string
  newEmail: string
  confirmationUrl: string
}

export const EmailChangeEmail = ({
  siteName,
  email,
  newEmail,
  confirmationUrl,
}: EmailChangeEmailProps) => (
  <Html lang="id" dir="ltr">
    <Head />
    <Preview>Konfirmasi perubahan email untuk {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>📧 Konfirmasi Perubahan Email</Heading>
        <Text style={text}>
          Kamu meminta untuk mengubah alamat email {siteName} dari{' '}
          <Link href={`mailto:${email}`} style={link}>
            {email}
          </Link>{' '}
          ke{' '}
          <Link href={`mailto:${newEmail}`} style={link}>
            {newEmail}
          </Link>
          .
        </Text>
        <Text style={text}>
          Klik tombol di bawah untuk mengkonfirmasi perubahan ini:
        </Text>
        <Button style={button} href={confirmationUrl}>
          Konfirmasi Perubahan Email
        </Button>
        <Text style={footer}>
          Jika kamu tidak meminta perubahan ini, segera amankan akun kamu.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default EmailChangeEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'DM Sans', Arial, sans-serif" }
const container = { padding: '20px 25px' }
const h1 = {
  fontSize: '22px',
  fontWeight: 'bold' as const,
  color: '#1e1e5a',
  fontFamily: "'Space Grotesk', Arial, sans-serif",
  margin: '0 0 20px',
}
const text = {
  fontSize: '14px',
  color: '#55575d',
  lineHeight: '1.5',
  margin: '0 0 25px',
}
const link = { color: '#4f46e5', textDecoration: 'underline' }
const button = {
  backgroundColor: '#4f46e5',
  color: '#ffffff',
  fontSize: '14px',
  borderRadius: '12px',
  padding: '12px 24px',
  textDecoration: 'none',
  fontWeight: 'bold' as const,
}
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0' }
