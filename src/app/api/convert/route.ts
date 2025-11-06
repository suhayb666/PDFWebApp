import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import prisma from '@/lib/db';
import { generateUniqueFilename } from '@/lib/utils';
import { convertImageToPDF } from '@/lib/converters/imageConverter';
import { convertWordToPDF } from '@/lib/converters/wordConverter';
import { convertExcelToPDF } from '@/lib/converters/excelConverter';
import { PDFDocument } from 'pdf-lib';
import { writeFile, unlink, readFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

export async function POST(request: NextRequest) {
  try {
    const { files, merge } = await request.json();

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const convertedFiles = [];
    const tempDir = tmpdir();

    for (const file of files) {
      // Create DB entry
      const conversion = await prisma.conversion.create({
        data: {
          filename: file.filename, // This is the blob URL
          originalName: file.originalName,
          filetype: file.filetype,
          fileSize: file.fileSize,
          pdfFilename: null,
          userEmail: file.userEmail || null,
          uploadTime: new Date(),
          status: 'pending',
        },
      });

      try {
        // Download the file from Blob Storage to temp location
        const response = await fetch(file.filename);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        const tempInputPath = join(tempDir, `input-${Date.now()}-${Math.random()}`);
        await writeFile(tempInputPath, buffer);

        const outputFilename = generateUniqueFilename(
          conversion.originalName.replace(/\.[^/.]+$/, '') + '.pdf'
        );
        const tempOutputPath = join(tempDir, `output-${Date.now()}-${Math.random()}.pdf`);

        // Convert based on file type
        if (conversion.filetype.startsWith('image/')) {
          await convertImageToPDF(tempInputPath, tempOutputPath);
        } else if (conversion.filetype.includes('word')) {
          await convertWordToPDF(tempInputPath, tempOutputPath);
        } else if (
          conversion.filetype.includes('sheet') ||
          conversion.filetype.includes('excel')
        ) {
          await convertExcelToPDF(tempInputPath, tempOutputPath);
        }

        // Upload converted PDF to Blob Storage
        const pdfBuffer = await readFile(tempOutputPath);
        const pdfBlob = await put(outputFilename, pdfBuffer, {
          access: 'public',
          addRandomSuffix: false,
          contentType: 'application/pdf',
        });

        // Clean up temp files
        await unlink(tempInputPath).catch(() => {});
        await unlink(tempOutputPath).catch(() => {});

        // Update database with PDF blob URL
        await prisma.conversion.update({
          where: { id: conversion.id },
          data: {
            status: 'converted',
            pdfFilename: pdfBlob.url,
          },
        });

        convertedFiles.push({
          id: Number(conversion.id),
          originalName: conversion.originalName,
          pdfFilename: pdfBlob.url,
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
        // Download PDF from blob storage
        const response = await fetch(file.pdfFilename);
        const pdfBytes = await response.arrayBuffer();
        const pdf = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedFilename = generateUniqueFilename(`merged-${Date.now()}.pdf`);
      const mergedPdfBytes = await mergedPdf.save();

      // Upload merged PDF to Blob Storage
      const mergedBlob = await put(mergedFilename, Buffer.from(mergedPdfBytes), {
        access: 'public',
        addRandomSuffix: false,
        contentType: 'application/pdf',
      });

      // Create DB record for merged file
      const mergedEntry = await prisma.conversion.create({
        data: {
          originalName: mergedFilename,
          filename: mergedBlob.url,
          pdfFilename: mergedBlob.url,
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
          pdfFilename: mergedBlob.url,
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