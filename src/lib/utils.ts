import { unlink } from 'fs/promises';
import { join } from 'path';
import prisma from './db';

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

  const uploadDir = join(process.cwd(), 'public', 'uploads');

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

// Run cleanup every hour
setInterval(cleanupOldFiles, 60 * 60 * 1000);