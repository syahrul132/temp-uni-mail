import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

// This edge function receives inbound emails forwarded by Cloudflare Email Workers.
// Cloudflare Email Routing catches emails → Email Worker forwards parsed data here.

const WEBHOOK_SECRET = Deno.env.get('INBOUND_EMAIL_WEBHOOK_SECRET')

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Verify webhook secret
  const authHeader = req.headers.get('x-webhook-secret')
  if (!WEBHOOK_SECRET || authHeader !== WEBHOOK_SECRET) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    const body = await req.json()

    // Expected payload from Cloudflare Email Worker:
    // { from: string, to: string, subject: string, body: string }
    const { from, to, subject, body: emailBody } = body

    if (!from || !to) {
      return new Response(JSON.stringify({ error: 'Missing from or to' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Extract the local part + domain to find matching temp email
    const recipientEmail = to.toLowerCase().trim()

    // Find the temp email that matches this recipient
    const { data: tempEmail, error: findError } = await supabase
      .from('temp_emails')
      .select('id, is_active, expires_at')
      .eq('email_address', recipientEmail)
      .maybeSingle()

    if (findError) {
      console.error('Error finding temp email:', findError)
      return new Response(JSON.stringify({ error: 'Database error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!tempEmail) {
      console.warn('No matching temp email found for:', recipientEmail)
      // Accept the email silently (don't bounce) but don't store it
      return new Response(JSON.stringify({ accepted: false, reason: 'no_matching_mailbox' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Check if expired or inactive
    const isExpired = new Date(tempEmail.expires_at) < new Date()
    if (!tempEmail.is_active || isExpired) {
      return new Response(JSON.stringify({ accepted: false, reason: 'mailbox_expired' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Store the email message
    const { error: insertError } = await supabase
      .from('email_messages')
      .insert({
        temp_email_id: tempEmail.id,
        sender: from,
        recipient: recipientEmail,
        subject: subject || '(Tanpa Subjek)',
        body: emailBody || '',
        direction: 'incoming',
        is_read: false,
      })

    if (insertError) {
      console.error('Error inserting email message:', insertError)
      return new Response(JSON.stringify({ error: 'Failed to store email' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    console.log('Inbound email stored:', { from, to: recipientEmail, subject })

    return new Response(JSON.stringify({ accepted: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error processing inbound email:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
