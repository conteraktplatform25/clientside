import { NextResponse } from 'next/server';

export async function GET() {
  const data = [
    { id: '1', title: 'Welcome!', body: 'Thanks for signing up.' },
    { id: '2', title: 'New Feature', body: 'We launched...' },
  ];
  return NextResponse.json(data);
}
