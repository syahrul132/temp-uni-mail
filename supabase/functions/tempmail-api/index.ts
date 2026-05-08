import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

async function sha256(str: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

function generateRandomEmail() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let r = ''
  for (let i = 0; i < 10; i++) r += chars.charAt(Math.floor(Math.random() * chars.length))
  return `${r}@adzstore.my.id`
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Auth: Bearer API key
  const authHeader = req.headers.get('Authorization') || ''
  const token = authHeader.replace(/^Bearer\s+/i, '').trim()
  if (!token) return json({ error: 'Missing API key' }, 401)

  const hash = await sha256(token)
  const { data: keyRow } = await supabase
    .from('api_keys')
    .select('id, user_id, is_active')
    .eq('key_hash', hash)
    .maybeSingle()

  if (!keyRow || !keyRow.is_active) return json({ error: 'Invalid API key' }, 401)

  // Verify premium status
  const { data: profile } = await supabase
    .from('profiles')
    .select('unlimited_until, balance')
    .eq('user_id', keyRow.user_id)
    .maybeSingle()

  const isPremium = profile?.unlimited_until && new Date(profile.unlimited_until) > new Date()
  if (!isPremium) return json({ error: 'Premium subscription required' }, 403)

  // Touch last_used
  await supabase.from('api_keys').update({ last_used_at: new Date().toISOString() }).eq('id', keyRow.id)

  const url = new URL(req.url)
  const path = url.pathname.split('/').pop() || ''

  try {
    if (path === 'create-email' && req.method === 'POST') {
      const address = generateRandomEmail()
      const { data, error } = await supabase
        .from('temp_emails')
        .insert({
          user_id: keyRow.user_id,
          email_address: address,
          is_premium: true,
          expires_at: profile!.unlimited_until,
        })
        .select('id, email_address, expires_at')
        .single()
      if (error) return json({ error: error.message }, 500)
      return json({ id: data.id, email: data.email_address, expires_at: data.expires_at })
    }

    if (path === 'inbox' && req.method === 'GET') {
      const emailId = url.searchParams.get('email_id')
      if (!emailId) return json({ error: 'email_id required' }, 400)

      // Verify ownership
      const { data: te } = await supabase
        .from('temp_emails')
        .select('id')
        .eq('id', emailId)
        .eq('user_id', keyRow.user_id)
        .maybeSingle()
      if (!te) return json({ error: 'Email not found' }, 404)

      const { data: messages, error } = await supabase
        .from('email_messages')
        .select('id, sender, recipient, subject, body, is_read, direction, created_at')
        .eq('temp_email_id', emailId)
        .order('created_at', { ascending: false })
      if (error) return json({ error: error.message }, 500)
      return json({ messages })
    }

    if (path === 'list-emails' && req.method === 'GET') {
      const { data, error } = await supabase
        .from('temp_emails')
        .select('id, email_address, is_active, expires_at, created_at')
        .eq('user_id', keyRow.user_id)
        .order('created_at', { ascending: false })
      if (error) return json({ error: error.message }, 500)
      return json({ emails: data })
    }

    return json({ error: 'Endpoint not found', endpoints: ['POST /create-email', 'GET /inbox?email_id=', 'GET /list-emails'] }, 404)
  } catch (e) {
    return json({ error: (e as Error).message }, 500)
  }
})
