import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * POST /api/create-admin
 * 
 * Creates an admin user in Supabase Auth
 * 
 * Body:
 *   email: string (required)
 *   password: string (required)
 *   adminSecret: string (required) - Secret key to protect this endpoint
 * 
 * Returns:
 *   { success: boolean, message: string, userId?: string }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, adminSecret } = body

    // Validate required fields
    if (!email || !password || !adminSecret) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: email, password, adminSecret' },
        { status: 400 }
      )
    }

    // Verify admin secret
    const expectedSecret = process.env.ADMIN_CREATE_SECRET || 'create-admin-secret-key'
    if (adminSecret !== expectedSecret) {
      return NextResponse.json(
        { success: false, message: 'Invalid admin secret' },
        { status: 401 }
      )
    }

    // Get Supabase credentials
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { success: false, message: 'Supabase configuration missing. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY' },
        { status: 500 }
      )
    }

    // Create Supabase admin client (uses service role key - bypasses RLS)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Check if user already exists
    const { data: existingUsers, error: checkError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (checkError) {
      console.error('Error checking existing users:', checkError)
      // Continue anyway, might be a permission issue
    }

    const existingUser = existingUsers?.users?.find(u => u.email === email)
    if (existingUser) {
      // User exists, update to admin role
      const { data: updatedUser, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        existingUser.id,
        {
          user_metadata: {
            role: 'admin'
          }
        }
      )

      if (updateError) {
        return NextResponse.json(
          { success: false, message: `Failed to update existing user: ${updateError.message}` },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: `User ${email} already exists. Updated to admin role.`,
        userId: updatedUser.user.id,
        email: updatedUser.user.email
      })
    }

    // Create new user with admin role
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        role: 'admin'
      }
    })

    if (createError) {
      return NextResponse.json(
        { success: false, message: `Failed to create user: ${createError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Admin user ${email} created successfully`,
      userId: newUser.user.id,
      email: newUser.user.email
    })

  } catch (error: any) {
    console.error('Error creating admin user:', error)
    return NextResponse.json(
      { success: false, message: `Internal server error: ${error.message}` },
      { status: 500 }
    )
  }
}
