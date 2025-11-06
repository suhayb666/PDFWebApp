import { del } from '@vercel/blob';
import prisma from './db';

// Auto-delete files after 1 hour from Vercel Blob Storage
export async function cleanupOldFiles() {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
 
  console.log(`[Cleanup] Starting cleanup job for files uploaded before: ${oneHourAgo.toISOString()}`);

  const oldConversions = await prisma.conversion.findMany({
    where: {
      uploadTime: {
        lt: oneHourAgo,
      },
      status: {
        in: ['converted', 'failed', 'pending']
      }
    },
  });

  console.log(`[Cleanup] Found ${oldConversions.length} expired records to process.`);

  let filesDeletedCount = 0;

  for (const conversion of oldConversions) {
    try {
      // Delete from Vercel Blob Storage using the stored URL
      if (conversion.filename) {
        try {
          await del(conversion.filename);
          filesDeletedCount++;
          console.log(`[Cleanup] Deleted blob: ${conversion.filename}`);
        } catch (error) {
          console.error(`[Cleanup] Error deleting blob ${conversion.filename}:`, error);
        }
      }
      
      if (conversion.pdfFilename && conversion.pdfFilename !== conversion.filename) {
        try {
          await del(conversion.pdfFilename);
          filesDeletedCount++;
          console.log(`[Cleanup] Deleted blob: ${conversion.pdfFilename}`);
        } catch (error) {
          console.error(`[Cleanup] Error deleting blob ${conversion.pdfFilename}:`, error);
        }
      }
      
      // Delete database record
      await prisma.conversion.delete({
        where: { id: conversion.id },
      });
    } catch (error) {
      console.error('[Cleanup] Error processing conversion:', error);
    }
  }

  console.log(`[Cleanup] Cleanup complete. Files deleted: ${filesDeletedCount}`);
  
  return {
    recordsDeleted: oldConversions.length,
    filesDeleted: filesDeletedCount,
  };
}

// Helper function to generate unique filenames
export function generateUniqueFilename(originalName: string): string {
  const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${Date.now()}-${sanitizedName}`;
}