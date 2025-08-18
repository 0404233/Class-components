import { NextResponse } from 'next/server';
import { generateCsv } from '../../../lib/generateCsv';

export async function POST(req: Request) {
  const { names } = await req.json();
  const csv = generateCsv(names);
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="items.csv"',
    },
  });
}
