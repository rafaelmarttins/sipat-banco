import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Create Supabase client with anon key to verify the requesting user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Verify the requesting user is authenticated
    const { data: { user: requestingUser }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !requestingUser) {
      throw new Error('Unauthorized')
    }

    // Check if requesting user is admin using the has_role function
    const { data: isAdmin, error: roleError } = await supabaseClient.rpc('is_admin')
    if (roleError || !isAdmin) {
      throw new Error('Only admins can create users')
    }

    // Get request body
    const { email, password, nome, setor, localizacao, role } = await req.json()

    if (!email || !password || !nome || !setor) {
      throw new Error('Missing required fields: email, password, nome, setor')
    }

    console.log('Creating user:', { email, nome, setor, role })

    // Create admin client with service role key to create the user
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Create the user with the admin client (bypasses email confirmation)
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm the email
      user_metadata: {
        nome,
        setor,
        localizacao: localizacao || null,
        role: role || 'user'
      }
    })

    if (createError) {
      console.error('Error creating user:', createError)
      throw createError
    }

    console.log('User created successfully:', newUser.user?.id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        user: { 
          id: newUser.user?.id,
          email: newUser.user?.email 
        } 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in create-user function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
