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
    const { files, merge } = await request.json();

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const convertedFiles = [];

    for (const file of files) {
      // Create DB entry WITHOUT specifying id (let Prisma auto-generate)
      const conversion = await prisma.conversion.create({
        data: {
          filename: file.filename,
          originalName: file.originalName,
          filetype: file.filetype,
          fileSize: file.fileSize,
          pdfFilename: null,
          userEmail: file.userEmail || null,
          uploadTime: new Date(),
          status: 'pending',
        },
      });

      const inputPath = join(uploadDir, conversion.filename);
      const outputFilename = conversion.filename.replace(/\.[^/.]+$/, '') + '.pdf';
      const outputPath = join(uploadDir, outputFilename);

      try {
        // Convert based on file type
        if (conversion.filetype.startsWith('image/')) {
          await convertImageToPDF(inputPath, outputPath);
        } else if (conversion.filetype.includes('word')) {
          await convertWordToPDF(inputPath, outputPath);
        } else if (
          conversion.filetype.includes('sheet') ||
          conversion.filetype.includes('excel')
        ) {
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
          id: Number(conversion.id), // Convert BigInt to number for JSON
          originalName: conversion.originalName,
          pdfFilename: outputFilename,
          fileSize: conversion.fileSize,
          downloadUrl: `/api/download/${conversion.id}`,
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

      // Create a new DB record for merged file
      const mergedEntry = await prisma.conversion.create({
        data: {
          originalName: mergedFilename,
          filename: mergedFilename,
          pdfFilename: mergedFilename,
          filetype: 'application/pdf',
          fileSize: mergedPdfBytes.length,
          status: 'converted',
        },
      });

      return NextResponse.json({
        success: true,
        merged: true,
        files: [{
          id: Number(mergedEntry.id),
          originalName: mergedFilename,
          pdfFilename: mergedFilename,
          fileSize: mergedPdfBytes.length,
          downloadUrl: `/api/download/${mergedEntry.id}`,
        }],
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