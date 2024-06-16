import { NextRequest, NextResponse } from 'next/server';
import { generateMatrix } from '@/utils/game';
import {
  MinefieldGenerateResponse,
  MinefieldGenerateRequest,
} from '@/types/game';

export async function POST(
  request: NextRequest,
): Promise<NextResponse<MinefieldGenerateResponse>> {
  const req: MinefieldGenerateRequest = await request.json();
  const matrix = generateMatrix(req.row, req.col);

  return NextResponse.json({
    code: 0,
    message: '',
    result: {
      matrix,
    },
  });
}
