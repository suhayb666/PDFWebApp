### 5️⃣ **app/api/convert/route.ts** (Conversion API)
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import prisma from '@/lib/db';
import { convertImageToPDF } from '@/lib/converters/imageConverter';
import { convertWordToPDF } from '@/lib/converters/wordConverter';
import { convertExcelToPDF } from '@/lib/converters/excelConverter';
import { PDFDocument } from 'pdf-lib';
import { readFile, writeFile } from 'fs/promises';

export async function POST(request: NextRequest) {
  try {
    const { fileIds, merge } = await request.json();

    if (!fileIds || fileIds.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const conversions = await prisma.conversion.findMany({
      where: {
        id: { in: fileIds },
      },
    });

    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const convertedFiles = [];

    for (const conversion of conversions) {
      const inputPath = join(uploadDir, conversion.filename);
      const outputFilename = conversion.filename.replace(/\.[^/.]+$/, '') + '.pdf';
      const outputPath = join(uploadDir, outputFilename);

      try {
        // Convert based on file type
        if (conversion.filetype.startsWith('image/')) {
          await convertImageToPDF(inputPath, outputPath);
        } else if (conversion.filetype.includes('word')) {
          await convertWordToPDF(inputPath, outputPath);
        } else if (conversion.filetype.includes('sheet') || conversion.filetype.includes('excel')) {
          await convertExcelToPDF(inputPath, outputPath);
        }

        // Update database
        await prisma.conversion.update({
          where: { id: conversion.id },
          data: {
            status: 'converted',
            pdfFilename: outputFilename,
          },
        });

        convertedFiles.push({
          id: conversion.id,
          originalName: conversion.originalName,
          pdfFilename: outputFilename,
        });
      } catch (error) {
        console.error(`Error converting ${conversion.filename}:`, error);
        await prisma.conversion.update({
          where: { id: conversion.id },
          data: { status: 'failed' },
        });
      }
    }

    // Merge PDFs if requested
    if (merge && convertedFiles.length > 1) {
      const mergedPdf = await PDFDocument.create();

      for (const file of convertedFiles) {
        const pdfPath = join(uploadDir, file.pdfFilename);
        const pdfBytes = await readFile(pdfPath);
        const pdf = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedFilename = `merged-${Date.now()}.pdf`;
      const mergedPath = join(uploadDir, mergedFilename);
      const mergedPdfBytes = await mergedPdf.save();
      await writeFile(mergedPath, mergedPdfBytes);

      return NextResponse.json({
        success: true,
        merged: true,
        filename: mergedFilename,
      });
    }

    return NextResponse.json({
      success: true,
      files: convertedFiles,
    });
  } catch (error) {
    console.error('Conversion error:', error);
    return NextResponse.json(
      { error: 'Failed to convert files' },
      { status: 500 }
    );
  }
}