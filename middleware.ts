import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''
  
  // Handle blog subdomain
  if (hostname === 'blog.esubalew.et' || hostname === 'blog.localhost:3000') {
    // If visiting root of blog subdomain, rewrite to /blog
    if (url.pathname === '/') {
      url.pathname = '/blog'
      return NextResponse.rewrite(url)
    }
    
    // If visiting any other path on blog subdomain that doesn't start with /blog
    if (!url.pathname.startsWith('/blog/') && url.pathname !== '/blog') {
      url.pathname = `/blog${url.pathname}`
      return NextResponse.rewrite(url)
    }
  }
  
  // Handle main domain blog redirects
  if (hostname === 'esubalew.et' || (hostname.includes('localhost') && !hostname.includes('blog.'))) {
    // Redirect /blog to blog subdomain
    if (url.pathname === '/blog') {
      const blogUrl = hostname.includes('localhost') 
        ? `http://blog.localhost:3000/blog`
        : 'https://blog.esubalew.et/blog'
      return NextResponse.redirect(new URL(blogUrl, request.url), 301)
    }
    
    // Redirect /blog/* to blog subdomain
    if (url.pathname.startsWith('/blog/')) {
      const blogPath = url.pathname.replace('/blog', '')
      const blogUrl = hostname.includes('localhost')
        ? `http://blog.localhost:3000/blog${blogPath}`
        : `https://blog.esubalew.et/blog${blogPath}`
      return NextResponse.redirect(new URL(blogUrl, request.url), 301)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}
