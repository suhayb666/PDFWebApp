import { unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os'; // <--- NEW: Needed for Vercel's writable path
import prisma from './db';

/**
 * Returns the correct temporary directory for file operations.
 * On Vercel, this correctly resolves to '/tmp'.
 * @param pathSegments - additional sub-paths to join
 */
export const getTempUploadDir = (...pathSegments: string[]) => {
  // Use the OS-defined temporary directory
  const baseDir = tmpdir();
  // Join all segments, ensuring we create a specific folder for our app's uploads within /tmp
  return join(baseDir, 'pdf-app-uploads', ...pathSegments);
};


// The cleanup function is called by the Vercel Cron Job endpoint (/api/cleanup/route.ts)
// The setInterval has been removed as it is incompatible with Serverless Functions.
export async function cleanupOldFiles() {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  
  const oldConversions = await prisma.conversion.findMany({
    where: {
      uploadTime: {
        lt: oneHourAgo,
      },
    },
  });

  // CRITICAL FIX: Use the writable temporary directory
  const uploadDir = getTempUploadDir();

  for (const conversion of oldConversions) {
    try {
      // Delete original file
      await unlink(join(uploadDir, conversion.filename));
      
      // Delete converted PDF file
      if (conversion.pdfFilename) {
        await unlink(join(uploadDir, conversion.pdfFilename));
      }
      
      // Delete database record
      await prisma.conversion.delete({
        where: { id: conversion.id },
      });
    } catch (error) {
      // Ignore ENOENT errors (file already gone) to prevent cleanup failure
      if (error instanceof Error && 'code' in error && error.code !== 'ENOENT') {
         console.error('Cleanup error:', error);
      }
    }
  }
}
