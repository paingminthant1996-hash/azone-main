/**
 * Script to create an admin user in Supabase
 * 
 * Usage:
 *   npx tsx scripts/create-admin-user.ts
 * 
 * Or with environment variables:
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/create-admin-user.ts
 */

import { createClient } from '@supabase/supabase-js'

const EMAIL = 'paingminthant1996@gmail.com'
const PASSWORD = 'paing133#'

async function createAdminUser() {
  // Get Supabase credentials from environment
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Missing Supabase configuration')
    console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  console.log('🔐 Creating admin user...')
  console.log(`📧 Email: ${EMAIL}`)

  // Create Supabase admin client
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  try {
    // Check if user already exists
    const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (listError) {
      console.warn('⚠️  Warning: Could not check existing users:', listError.message)
    }

    const existingUser = existingUsers?.users?.find(u => u.email === EMAIL)
    
    if (existingUser) {
      console.log('👤 User already exists. Updating to admin role...')
      
      const { data: updatedUser, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        existingUser.id,
        {
          user_metadata: {
            role: 'admin'
          }
        }
      )

      if (updateError) {
        console.error('❌ Error updating user:', updateError.message)
        process.exit(1)
      }

      console.log('✅ Success! User updated to admin role')
      console.log(`   User ID: ${updatedUser.user.id}`)
      console.log(`   Email: ${updatedUser.user.email}`)
      return
    }

    // Create new user
    console.log('➕ Creating new admin user...')
    
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: EMAIL,
      password: PASSWORD,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        role: 'admin'
      }
    })

    if (createError) {
      console.error('❌ Error creating user:', createError.message)
      process.exit(1)
    }

    console.log('✅ Success! Admin user created')
    console.log(`   User ID: ${newUser.user.id}`)
    console.log(`   Email: ${newUser.user.email}`)
    console.log(`   Role: admin`)
    console.log('\n🎉 You can now login at: https://admin.paing.xyz/admin/login')
    
  } catch (error: any) {
    console.error('❌ Unexpected error:', error.message)
    process.exit(1)
  }
}

createAdminUser()
