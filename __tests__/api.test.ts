import { POST } from '@/app/api/minefield/generate/route'; // Replace with your actual file path
import { NextRequest } from 'next/server';
import { MinefieldGenerateRequest } from '@/types/game';

describe('POST /api/minefield/generate', () => {
  it('should return an error message when coordinates are non-numeric', async () => {
    const request: NextRequest = {
      method: 'POST',
      json: async () =>
        ({
          row: 10,
          col: 10,
        }) as MinefieldGenerateRequest,
    } as NextRequest;

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.code).toBe(10001);
    expect(json.message).toBe('Wrong coordinates');
    expect(json.result.matrix.length).toBe(0);
  });

  it('should return a minefield matrix when coordinates are valid', async () => {
    const request: NextRequest = {
      method: 'POST',
      json: async () =>
        ({
          row: 8,
          col: 8,
        }) as MinefieldGenerateRequest,
    } as NextRequest;

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.code).toBe(0);
    expect(json.message).toBe('');
    expect(json.result.matrix.length).toBe(10);
    expect(json.result.matrix[0].length).toBe(10);
  });
});
