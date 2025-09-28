import { NextRequest, NextResponse } from 'next/server';

const publicPaths = ['/', '/jobs/[id]', '/jobs/search'];

export async function middleware(req: NextRequest) {
    
    const path = req.nextUrl.pathname;
    const isPublicPath = publicPaths.includes(path);

    let accessToken = req.cookies.get('session_access_token')?.value;
    const refreshToken = req.cookies.get('session_refresh_token')?.value;

    console.log("-----in middleware")
    // Si on a déjà un access token valide → continuer
    if (accessToken && !isExpired(accessToken)) {
        return NextResponse.next();
    }
    
    console.log("-----invalid access token")
    // Pas d'access token mais on a un refresh token → essayer de rafraîchir
    if (refreshToken) {
        try {
            const refreshResponse = await fetch('http://localhost:8000/api/refresh/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refresh: refreshToken })
            });

            const json = await refreshResponse.json();

            if (json.access) {

                const res = NextResponse.redirect(req.url);
                res.cookies.set('session_access_token', json.access, {
                    httpOnly: true,
                    secure: false, 
                    maxAge: 60 * 1, // 1 min
                    path: '/'
                });

                return res;
            } 
        } catch (error) {
            console.error('Erreur refresh token:', error);
            // Tomber dans le cas d'erreur 401 plus bas
        }
    }

    // Pas de refresh token → redirection login
    
    if (req.nextUrl.pathname.startsWith('/api/')) {
        // Pour les appels API, on renvoie une erreur 401.
        console.log(`[Middleware] API request to ${req.nextUrl.pathname} denied with 401.`);
        const response = NextResponse.json(
            { message: 'Authentication required' },
            { status: 401 }
        );
        response.cookies.delete('session_access_token');
        response.cookies.delete('session_refresh_token');
        return response;

    } else if ( !isPublicPath ) {
        // Pour les navigations de page, on redirige vers le login.
        console.log(`[Middleware] Page navigation to ${req.nextUrl.pathname} redirected to /login.`);
        const loginUrl = new URL('/login', req.url);
        
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete('session_access_token');
        response.cookies.delete('session_refresh_token');
        return response;
    }

    return NextResponse.next();

}

function isExpired(token: string) {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}



export const config = {
    matcher: [
        '/api/:path*',
        '/feed:path*',
        '/post/:path*',
        '/profile/:path*',
        '/search/:path*',
        '/chat/:path*',
    ],
};
