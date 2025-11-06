import { NextRequest, NextResponse } from 'next/server';
import { cleanupOldFiles } from '@/lib/utils';

// ✅ Runs manually (POST) or on Vercel Cron every 3 days
export async function GET(request: NextRequest) {
  try {
    console.log('[Cron] Cleanup job triggered');

    const result = await cleanupOldFiles();

    return NextResponse.json({
      success: true,
      message: 'Cleanup completed successfully',
      ...result,
    });
  } catch (error) {
    console.error('[Cron] Cleanup error:', error);
    return NextResponse.json(
      { error: 'Cleanup failed', details: String(error) },
      { status: 500 }
    );
  }
}

// Allow manual trigger via POST
export async function POST(request: NextRequest) {
  return GET(request);
}
