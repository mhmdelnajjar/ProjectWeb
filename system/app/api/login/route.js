import { NextResponse } from 'next/server';
import { signJwt } from '@/app/lib/jwt';
import systemRepo from '@/app/repo/systemRepo';

export async function POST(request) {
  const { username, password } = await request.json();

  // Get all users from Prisma/systemRepo
  const users = await systemRepo.getUsers();
  const user = users.find(u => u.username === username);

  // Fail if not found or wrong password
  if (!user || user.password !== password) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Create JWT payload and sign it
  const token = signJwt({
    username: user.username,
    userType: user.userType,
  });

  // Set the token in secure HttpOnly cookie
  const res = NextResponse.json({
    success: true,
    userType: user.userType, // This is sent to frontend to redirect user
  });

  res.cookies.set('id_token', token, {
    httpOnly: true,
    secure: true,
    path: '/',
    maxAge: 60 * 60, // 1 hour
  });

  return res;
}
