// src/app/api/download/zip/route.ts

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db'; // <-- FIX 1: Default import
import JSZip from 'jszip';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // FIX 3: Expect numbers to match your frontend state
    const { conversionIds } = body as { conversionIds: number[] };

    if (!conversionIds || conversionIds.length === 0) {
      return new NextResponse('No file IDs provided', { status: 400 });
    }

    // ... around line 21
    const conversions = await db.conversion.findMany({
      where: {
        id: { in: conversionIds },
        status: 'converted', // <-- THE FIX: Change 'COMPLETED' to 'converted'
      },
    });

    if (conversions.length === 0) {
      // This is the 404 you are seeing.
      return new NextResponse('No completed files found', { status: 404 });
    }

// ...

    const zip = new JSZip();

    // !! IMPORTANT: Update this path to your actual uploads folder
    // This assumes an 'uploads' folder in your project's root
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    for (const conversion of conversions) {
      if (!conversion.pdfFilename) continue; // Skip if PDF name is missing

      const filePath = path.join(uploadDir, conversion.pdfFilename);

      try {
        const fileData = await fs.readFile(filePath);
        // Use the original name for the file inside the zip
        const pdfName = conversion.originalName.replace(/\.[^/.]+$/, '.pdf');
        zip.file(pdfName, fileData);
      } catch (readError) {
        console.error(`Could not read file ${conversion.pdfFilename}:`, readError);
        // Skip this file if it can't be read
      }
    }

    // FIX 2: Generate 'arraybuffer' instead of 'nodebuffer'
    const zipData = await zip.generateAsync({
      type: 'arraybuffer', // <-- This is the fix
      compression: 'DEFLATE',
      compressionOptions: {
        level: 9,
      },
    });

    const headers = new Headers();
    headers.set('Content-Type', 'application/zip');
    headers.set('Content-Disposition', 'attachment; filename="converted_files.zip"');

    // 'zipData' (an ArrayBuffer) is a valid BodyInit type
    return new NextResponse(zipData, { status: 200, headers });

  } catch (error) {
    console.error('Error creating zip file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}