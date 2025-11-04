import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs'; // Note: existsSync is not async but that's fine for simple checks
import { getTempUploadDir } from '@/lib/utils'; // <--- ADDED: Import utility

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    // CRITICAL FIX: Use the Vercel-writable temporary directory
    const uploadDir = getTempUploadDir();
    
    // Create uploads directory if it doesn't exist (safe in /tmp)
    // We use mkdir from fs/promises to ensure it's async and robust
    await mkdir(uploadDir, { recursive: true });

    const uploadedFiles = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Sanitize filename to avoid issues with special characters
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const uniqueName = `${Date.now()}-${sanitizedName}`;
      const filepath = join(uploadDir, uniqueName);

      // Write file to the temporary directory
      await writeFile(filepath, buffer);

      uploadedFiles.push({
        filename: uniqueName,
        originalName: file.name,
        filetype: file.type,
        fileSize: file.size,
      });
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}
