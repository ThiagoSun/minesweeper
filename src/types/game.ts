import { ResponseData } from '@/types/http';

export type MatrixType = Array<Array<string>>;

interface GenerateResult {
  matrix: MatrixType;
}

export type MinefieldGenerateResponse = ResponseData<GenerateResult>;

export type MinefieldGenerateRequest = {
  row: number;
  col: number;
};
