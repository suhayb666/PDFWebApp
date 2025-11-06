import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const conversion = await prisma.conversion.findUnique({
      where: { id: BigInt(id) },
    });

    if (!conversion || !conversion.pdfFilename) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Fetch the file from Vercel Blob Storage
    const response = await fetch(conversion.pdfFilename);
    
    if (!response.ok) {
      return NextResponse.json({ error: 'File not found in storage' }, { status: 404 });
    }

    const fileBuffer = await response.arrayBuffer();

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${conversion.originalName || 'download.pdf'}"`,
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to download file' },
      { status: 500 }
    );
  }
}