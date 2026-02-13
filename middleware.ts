import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const url = request.nextUrl.clone()
<<<<<<< HEAD

  // Force HTTPS redirect for SSL (check Cloudflare header)
  const proto = request.headers.get('x-forwarded-proto') || request.headers.get('cf-visitor')
  if (proto && !proto.includes('https')) {
    const httpsUrl = request.nextUrl.clone()
    httpsUrl.protocol = 'https'
    httpsUrl.host = hostname
    return NextResponse.redirect(httpsUrl, 301)
  }

  // Add pathname to headers for layout to check
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', request.nextUrl.pathname)

=======
  
  // Add pathname to headers for layout to check
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', request.nextUrl.pathname)
  
  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  // If Supabase is not configured, skip auth checks but allow basic routing
  if (!supabaseUrl || !supabaseAnonKey) {
    // Admin subdomain routing: admin.paing.xyz -> /admin routes
    if (hostname === 'admin.paing.xyz' || hostname.startsWith('admin.')) {
      // Allow admin routes on admin subdomain
      if (request.nextUrl.pathname === '/') {
        url.pathname = '/admin/login'
        return NextResponse.redirect(url)
      }
    } else {
      // Redirect www.paing.xyz to paing.xyz
      if (hostname === 'www.paing.xyz') {
        url.hostname = 'paing.xyz'
        return NextResponse.redirect(url, 301)
      }
      
      // Main website (paing.xyz) - Block admin routes
      if (request.nextUrl.pathname.startsWith('/admin')) {
        return new NextResponse(null, { status: 404 })
      }
    }
    
    // Continue without auth checks if Supabase not configured
    // Include pathname header for layout
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }
  
>>>>>>> cf27d10a28cc1bf5b39a44a6e85257bde68235bc
  // Admin subdomain routing: admin.paing.xyz -> /admin routes
  if (hostname === 'admin.paing.xyz' || hostname.startsWith('admin.')) {
    // Allow admin routes on admin subdomain
    // Don't redirect root path here - let auth check handle it
    // Continue to authentication check below
  } else {
    // Main website (paing.xyz) - Block admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
      // Return 404 for admin routes on main domain
      return new NextResponse(null, { status: 404 })
    }
<<<<<<< HEAD

=======
    
    // Redirect www.paing.xyz to paing.xyz
    if (hostname === 'www.paing.xyz') {
      url.hostname = 'paing.xyz'
      return NextResponse.redirect(url, 301)
    }
    
>>>>>>> cf27d10a28cc1bf5b39a44a6e85257bde68235bc
    // Redirect root domain (paing.xyz) to main website
    if (hostname === 'paing.xyz') {
      // Already on main domain, continue
    }
  }

  // Create response with pathname header for layout
  // (requestHeaders already declared at top with pathname header)
  let response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  // Create Supabase client
  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Protect admin routes (only on admin subdomain)
  // Allow /admin/login to be accessed without session
  if (hostname === 'admin.paing.xyz' || hostname.startsWith('admin.')) {
    // Handle root path on admin subdomain
    if (request.nextUrl.pathname === '/') {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        // Redirect to overview if logged in
        url.pathname = '/admin/overview'
        return NextResponse.redirect(url)
      } else {
        // Redirect to login if not logged in
        url.pathname = '/admin/login'
        return NextResponse.redirect(url)
      }
    }

    // Protect other admin routes (except login)
    if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        // Redirect to admin login if not authenticated
        const loginUrl = request.nextUrl.clone()
        loginUrl.pathname = '/admin/login'
        return NextResponse.redirect(loginUrl)
      }
    }
  }

  // Protect account routes (require authentication)
  if (request.nextUrl.pathname.startsWith('/account')) {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      // Redirect to home page if not authenticated (admin login is disabled)
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

