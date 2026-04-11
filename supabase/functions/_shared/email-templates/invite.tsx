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

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({
  siteName,
  siteUrl,
  confirmationUrl,
}: InviteEmailProps) => (
  <Html lang="id" dir="ltr">
    <Head />
    <Preview>Kamu diundang untuk bergabung di {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🎉 Kamu Diundang!</Heading>
        <Text style={text}>
          Kamu telah diundang untuk bergabung di{' '}
          <Link href={siteUrl} style={link}>
            <strong>{siteName}</strong>
          </Link>
          . Klik tombol di bawah untuk menerima undangan dan membuat akun.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Terima Undangan
        </Button>
        <Text style={footer}>
          Jika kamu tidak mengharapkan undangan ini, abaikan email ini.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default InviteEmail

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
