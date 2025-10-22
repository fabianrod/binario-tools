import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  await supabase.auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Si el usuario no está autenticado y trata de acceder al panel, redirigir al login
  if (!user && req.nextUrl.pathname.startsWith('/panel')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Si el usuario está autenticado y trata de acceder a login/register, redirigir al panel
  if (user && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register')) {
    return NextResponse.redirect(new URL('/panel', req.url))
  }

  return response
}

export const config = {
  matcher: ['/panel/:path*', '/login', '/register']
}
