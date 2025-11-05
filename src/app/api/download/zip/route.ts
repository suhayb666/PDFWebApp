// src/app/api/download/zip/route.ts

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getTempUploadDir } from '@/lib/utils';
import JSZip from 'jszip';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversionIds } = body as { conversionIds: number[] };

    if (!conversionIds || conversionIds.length === 0) {
      return new NextResponse('No file IDs provided', { status: 400 });
    }

    const conversions = await db.conversion.findMany({
      where: {
        id: { in: conversionIds },
        status: 'converted',
      },
    });

    if (conversions.length === 0) {
      return new NextResponse('No completed files found', { status: 404 });
    }

    const zip = new JSZip();

    // FIX: Use the writable /tmp directory
    const uploadDir = getTempUploadDir();

    for (const conversion of conversions) {
      if (!conversion.pdfFilename) continue;

      const filePath = path.join(uploadDir, conversion.pdfFilename);

      try {
        const fileData = await fs.readFile(filePath);
        const pdfName = conversion.originalName.replace(/\.[^/.]+$/, '.pdf');
        zip.file(pdfName, fileData);
      } catch (readError) {
        console.error(`Could not read file ${conversion.pdfFilename}:`, readError);
        // Skip this file if it can't be read
      }
    }

    const zipData = await zip.generateAsync({
      type: 'arraybuffer',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 9,
      },
    });

    const headers = new Headers();
    headers.set('Content-Type', 'application/zip');
    headers.set('Content-Disposition', 'attachment; filename="converted_files.zip"');

    return new NextResponse(zipData, { status: 200, headers });

  } catch (error) {
    console.error('Error creating zip file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}