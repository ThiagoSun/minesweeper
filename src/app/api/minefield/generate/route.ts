import { NextRequest, NextResponse } from 'next/server';
import { generateMatrix } from '@/utils/game-server';
import {
  MinefieldGenerateResponse,
  MinefieldGenerateRequest,
} from '@/types/game';
import { checkIsOutsideGrid } from '@/utils/game';

/**
 * POST request handler for generating a minefield matrix.
 *
 * @param request - The incoming Next.js request object.
 * @returns A Promise that resolves to a Next.js response object with the minefield matrix.
 */
export async function POST(
  request: NextRequest,
): Promise<NextResponse<MinefieldGenerateResponse>> {
  const req: MinefieldGenerateRequest = await request.json();

  if (!checkIsOutsideGrid(req.row, req.col)) {
    const matrix = generateMatrix(req.row, req.col);
    return NextResponse.json({
      code: 0,
      message: '',
      result: {
        matrix,
      },
    });
  } else {
    return NextResponse.json({
      code: 10001,
      message: 'Wrong coordinates',
      result: {
        matrix: [],
      },
    });
  }
}
