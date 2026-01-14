import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Redirect root domain (paing.xyz) to subdomain (store.paing.xyz)
  const hostname = request.headers.get('host') || ''
  const url = request.nextUrl.clone()
  
  // Check if it's the root domain (paing.xyz) without subdomain
  if (hostname === 'paing.xyz' || hostname === 'www.paing.xyz') {
    url.host = 'store.paing.xyz'
    url.protocol = 'https:'
    return NextResponse.redirect(url, 301) // Permanent redirect
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

  // BLOCK ALL ADMIN ROUTES - Completely disabled
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Return 404 for all admin routes (including login)
    return new NextResponse(null, { status: 404 })
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

