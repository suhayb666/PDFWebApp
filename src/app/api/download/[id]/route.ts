import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import prisma from '@/lib/db';
import { getTempUploadDir } from '@/lib/utils';

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

    const uploadDir = getTempUploadDir();
    const filepath = join(uploadDir, conversion.pdfFilename);

    const fileBuffer = await readFile(filepath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${conversion.originalName || conversion.pdfFilename}"`,
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