import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { generateUniqueFilename } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const uploadedFiles = [];

    for (const file of files) {
      // Generate unique filename
      const uniqueName = generateUniqueFilename(file.name);

      // Upload to Vercel Blob Storage
      const blob = await put(uniqueName, file, {
        access: 'public',
        addRandomSuffix: false,
      });

      uploadedFiles.push({
        filename: blob.url, // Store the blob URL as filename
        originalName: file.name,
        filetype: file.type,
        fileSize: file.size,
        blobUrl: blob.url, // Full URL for access
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