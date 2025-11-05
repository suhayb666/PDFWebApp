import { unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import prisma from './db';

// Get the correct upload directory (writable on Vercel)
export function getTempUploadDir(): string {
  // In production (Vercel), use /tmp which is writable
  // In development, use os.tmpdir() or a local temp folder
  return process.env.NODE_ENV === 'production' 
    ? '/tmp/uploads' 
    : join(tmpdir(), 'uploads');
}

// Auto-delete files after 1 hour
export async function cleanupOldFiles() {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
 
  const oldConversions = await prisma.conversion.findMany({
    where: {
      uploadTime: {
        lt: oneHourAgo,
      },
    },
  });

  const uploadDir = getTempUploadDir();

  for (const conversion of oldConversions) {
    try {
      await unlink(join(uploadDir, conversion.filename));
      if (conversion.pdfFilename) {
        await unlink(join(uploadDir, conversion.pdfFilename));
      }
      await prisma.conversion.delete({
        where: { id: conversion.id },
      });
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
}

// Note: setInterval doesn't work in serverless functions
// You need to set up a Vercel Cron Job to call an API route that triggers cleanupOldFiles()
// Example: Create /api/cron/cleanup/route.ts and configure vercel.json with cron schedule