import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import prisma from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const conversion = await prisma.conversion.findUnique({
      where: { id },
    });

    if (!conversion || !conversion.pdfFilename) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    const filepath = join(process.cwd(), 'public', 'uploads', conversion.pdfFilename);
    const file = await readFile(filepath);

    return new NextResponse(file, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${conversion.pdfFilename}"`,
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