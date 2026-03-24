import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Cabeçalho de autorização ausente')

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )
    
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) throw new Error('Não autorizado')
    
    const { data: profile } = await supabaseClient.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') throw new Error('Acesso negado: apenas administradores podem criar usuários')

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { email, password, role, is_approved } = await req.json()

    if (!email || !password || !role) {
      throw new Error('E-mail, senha e perfil são obrigatórios')
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    let userId = authData?.user?.id

    if (authError) {
      if (authError.message.includes('already registered') || authError.message.includes('User already exists')) {
        // Try to find the existing user in profiles to update them
        const { data: existingProfile } = await supabaseAdmin.from('profiles').select('id').eq('email', email).single()
        
        if (existingProfile) {
          userId = existingProfile.id
          // Force update the password
          const { error: updatePwError } = await supabaseAdmin.auth.admin.updateUserById(userId, { password })
          if (updatePwError) throw new Error(`Erro ao atualizar senha do usuário existente: ${updatePwError.message}`)
        } else {
          throw new Error(`Usuário já existe na autenticação, mas perfil não encontrado: ${authError.message}`)
        }
      } else {
        throw authError
      }
    }

    if (!userId) {
      throw new Error('Não foi possível obter o ID do usuário.')
    }

    const { error: profileError } = await supabaseAdmin.from('profiles').update({
      role,
      is_approved: is_approved !== undefined ? is_approved : true
    }).eq('id', userId)

    if (profileError) {
      console.error('Failed to update profile role', profileError)
      throw new Error(`Erro ao atualizar perfil: ${profileError.message}`)
    }

    return new Response(JSON.stringify({ user: { id: userId, email } }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
