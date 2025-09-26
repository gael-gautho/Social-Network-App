'use server'
import { MyJwtPayload } from '@/types';
import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';


export async function handleLogin(accessToken: string, refreshToken: string) {
    (await cookies()).set('session_access_token', accessToken, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 1, // 1 minutes
        path: '/'
    });

    (await cookies()).set('session_refresh_token', refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 24 * 1, // One day
        path: '/'
    });
    
    redirect('/feed');
}

export async function getAccessToken() {
    let accessToken = (await cookies()).get('session_access_token')?.value;
    return accessToken;
}

export async function getUserInfo() {
    let user_id = "";

    const refreshToken = (await cookies()).get("session_refresh_token")?.value
    
    if (refreshToken) {
    user_id = jwtDecode<MyJwtPayload>(refreshToken).user_id
    };
    
    return {user_id};
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete('session_access_token');
  cookieStore.delete('session_refresh_token');
  redirect('/');
}
