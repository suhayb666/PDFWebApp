import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { join } from 'path';
import { unlink, access, constants } from 'fs/promises';

// This is the cron job endpoint responsible for deleting old files and database records.

export async function GET() {
  // Define the expiration time (1 hour = 60 minutes * 60 seconds * 1000 milliseconds)
  const EXPIRY_TIME_MS = 60 * 60 * 1000;
  const oneHourAgo = new Date(Date.now() - EXPIRY_TIME_MS);

  console.log(`[Cleanup] Starting cleanup job for files uploaded before: ${oneHourAgo.toISOString()}`);

  try {
    // 1. Find all files that are older than the expiry time (1 hour)
    const expiredConversions = await prisma.conversion.findMany({
      where: {
        uploadTime: {
          lt: oneHourAgo, // 'Less than' one hour ago
        },
        // Only target 'converted' or 'failed' files that we can clean up
        status: {
          in: ['converted', 'failed', 'pending']
        }
      },
      select: {
        id: true,
        filename: true,
        pdfFilename: true,
      },
    });

    console.log(`[Cleanup] Found ${expiredConversions.length} expired records to process.`);

    const uploadDir = join(process.cwd(), 'public', 'uploads');
    let filesDeletedCount = 0;

    for (const conversion of expiredConversions) {
      // List of files to attempt to delete (original and converted PDF)
      const filesToDelete = [conversion.filename, conversion.pdfFilename].filter(Boolean) as string[];

      for (const fileName of filesToDelete) {
        if (!fileName) continue;

        const filePath = join(uploadDir, fileName);

        try {
          // Check if the file exists before attempting deletion
          await access(filePath, constants.F_OK);
          await unlink(filePath);
          filesDeletedCount++;
          console.log(`[Cleanup] Successfully deleted physical file: ${fileName}`);
        } catch (error: any) {
          // If the file doesn't exist (ENOENT), it's not an error we care about
          if (error.code !== 'ENOENT') {
            console.error(`[Cleanup] Error deleting physical file ${fileName}:`, error);
          }
        }
      }
    }

    // 2. Delete the records from the database
    const dbDeleteResult = await prisma.conversion.deleteMany({
      where: {
        uploadTime: {
          lt: oneHourAgo,
        },
        status: {
          in: ['converted', 'failed', 'pending']
        }
      }
    });

    console.log(`[Cleanup] Finished cleanup. Records deleted from DB: ${dbDeleteResult.count}. Physical files deleted: ${filesDeletedCount}`);

    return NextResponse.json({
      success: true,
      recordsDeleted: dbDeleteResult.count,
      filesDeleted: filesDeletedCount,
    }, { status: 200 });
  } catch (error) {
    console.error('[Cleanup] Fatal error during cleanup job:', error);
    return NextResponse.json({ error: 'Failed to run cleanup job' }, { status: 500 });
  }
}
