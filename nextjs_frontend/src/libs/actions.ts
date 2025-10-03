'use server'
import { MyJwtPayload } from '@/types';
import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';

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
    const accessToken = (await cookies()).get('session_access_token')?.value;
    return accessToken;
}


export async function setRefreshToken(refreshToken: string) {
  (await cookies()).set('session_refresh_token', refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 24 * 1, // One day
        path: '/'
    });
}

export async function getUserInfo() {
    let user_id = "";

    const accessToken = (await cookies()).get("session_access_token")?.value
    
    if (accessToken) {
    user_id = jwtDecode<MyJwtPayload>(accessToken).user_id
    };
    
    return {user_id};
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete('session_access_token');
  cookieStore.delete('session_refresh_token');
  redirect('/');
}

export const getUser = cache(async () => {
    
    const token = (await cookies()).get("session_access_token")?.value
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/me`, {
    next: { tags: ['user'] },
    headers: {
        'Authorization': `Bearer ${token}`
            } 
  });
  if (!res.ok) return null;
  return res.json();
});
