import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/user';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { username } = await req.json();
    if (!username) return NextResponse.json({ error: 'username required' }, { status: 400 });

    const exists = await User.findOne({ username: String(username).trim() }).select('_id').lean();
    return NextResponse.json({ available: !exists });
  } catch (e) {
    console.error('check-username error', e);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}