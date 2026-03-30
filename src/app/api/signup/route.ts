import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function POST(request: Request) {
  try {
    const { domain } = await request.json();

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    // Check if domain exists
    const existingDomain = await prisma.domain.findUnique({
      where: { name: domain }
    });

    if (existingDomain) {
      return NextResponse.json({ error: 'Domain already taken' }, { status: 400 });
    }

    // Success! We return success. Persistence happens after Login.
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Signup API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
