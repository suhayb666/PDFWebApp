import { NextRequest, NextResponse } from 'next/server';
import { cleanupOldFiles } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    // Optional: Verify the request is from Vercel Cron (more secure)
    // Uncomment these lines after setting CRON_SECRET in Vercel env vars
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    console.log('[Cron] Cleanup job triggered');
    
    const result = await cleanupOldFiles();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cleanup completed',
      ...result
    });
  } catch (error) {
    console.error('[Cron] Cleanup error:', error);
    return NextResponse.json(
      { error: 'Cleanup failed' },
      { status: 500 }
    );
  }
}

// Allow manual triggering via POST as well
export async function POST(request: NextRequest) {
  return GET(request);
}