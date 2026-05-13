import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const WEBHOOK_SECRET = Deno.env.get('CLERK_WEBHOOK_SECRET')

serve(async (req) => {
  try {
    const svix_id = req.headers.get('svix-id')
    const svix_timestamp = req.headers.get('svix-timestamp')
    const svix_signature = req.headers.get('svix-signature')

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response(
        JSON.stringify({ error: 'Missing Svix headers' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const payload = await req.text()
    
    if (WEBHOOK_SECRET) {
      try {
        const { Webhook } = await import('https://esm.sh/svix@1.15.0')
        const wh = new Webhook(WEBHOOK_SECRET)
        wh.verify(payload, {
          'svix-id': svix_id,
          'svix-timestamp': svix_timestamp,
          'svix-signature': svix_signature,
        })
      } catch (err) {
        console.error('Webhook signature verification failed:', err.message)
        return new Response(
          JSON.stringify({ error: 'Invalid signature' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        )
      }
    }

    const event = JSON.parse(payload)
    const eventType = event.type

    console.log(`Webhook event received: ${eventType}`)

    // Procesar eventos relevantes
    const supportedEvents = ['user.created', 'user.updated', 'user.verified']
    
    if (!supportedEvents.includes(eventType)) {
      return new Response(
        JSON.stringify({ message: `Event ${eventType} ignored` }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const userData = event.data
    const clerkId = userData.id
    const email = userData.email_addresses?.[0]?.email_address || ''
    const firstName = userData.first_name || ''
    const lastName = userData.last_name || ''
    const fullName = `${firstName} ${lastName}`.trim() || 'Usuario'
    const imageUrl = userData.image_url || null
    const createdAt = new Date(userData.created_at).toISOString()
    const emailVerified = userData.email_addresses?.[0]?.verification?.status === 'verified'

    console.log(`Processing ${eventType} for: ${fullName} (${email}) - Verified: ${emailVerified}`)

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase credentials')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', clerkId)
      .single()

    if (existingProfile) {
      // Actualizar perfil existente (por si cambió nombre)
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          email: email,
          first_name: firstName,
          last_name: lastName,
          avatar_url: imageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', clerkId)
        .select()
        .single()

      if (error) {
        console.error('Error updating profile:', error.message)
        
        // Fallback sin columnas extra
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('profiles')
          .update({
            full_name: fullName,
            email: email,
            updated_at: new Date().toISOString(),
          })
          .eq('id', clerkId)
          .select()
          .single()

        if (fallbackError) {
          throw fallbackError
        }
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Profile updated (fallback)',
            data: fallbackData 
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      }

      console.log(`Profile updated: ${clerkId}`)
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Profile updated',
          data 
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Crear nuevo perfil
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: clerkId,
        full_name: fullName,
        email: email,
        first_name: firstName,
        last_name: lastName,
        avatar_url: imageUrl,
        role: 'student',
        created_at: createdAt,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating profile:', error.message)
      
      if (error.message.includes('column') || error.message.includes('does not exist')) {
        console.log('Attempting insert with minimal columns...')
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('profiles')
          .insert({
            id: clerkId,
            full_name: fullName,
            email: email,
            role: 'student',
          })
          .select()
          .single()

        if (fallbackError) {
          throw fallbackError
        }
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Profile created (minimal columns)',
            data: fallbackData 
          }),
          { status: 201, headers: { 'Content-Type': 'application/json' } }
        )
      }
      
      throw error
    }

    console.log(`Profile created successfully: ${clerkId}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Profile created',
        data 
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Webhook handler error:', error.message)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
