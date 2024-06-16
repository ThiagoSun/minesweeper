import { ResponseData } from '@/types/http';

export type CellType = string;

export type MatrixType = Array<Array<CellType>>;

interface GenerateResult {
  matrix: MatrixType;
}

export type MinefieldGenerateResponse = ResponseData<GenerateResult>;

export type MinefieldGenerateRequest = {
  row: number;
  col: number;
};
