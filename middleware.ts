import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const url = request.nextUrl.clone()
  
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
    
    // Redirect root domain (paing.xyz) to main website
    if (hostname === 'paing.xyz' || hostname === 'www.paing.xyz') {
      // Already on main domain, continue
    }
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

