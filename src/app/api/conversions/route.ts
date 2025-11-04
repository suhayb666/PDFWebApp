import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// CRITICAL FIX: This export forces the route to be dynamic, preventing
// the Vercel build error related to accessing request.url.
export const dynamic = 'force-dynamic'; 

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json({ error: 'Missing filename parameter' }, { status: 400 });
    }

    const conversion = await prisma.conversion.findFirst({
      where: { pdfFilename: filename },
    });

    if (!conversion) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: conversion.id,
      file: conversion,
    });
  } catch (error) {
    console.error('Error fetching conversion by filename:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversion' },
      { status: 500 }
    );
  }
}
