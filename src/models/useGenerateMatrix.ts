/**
 * The Hook of fetching api, store result data in react state
 */

import { useCallback, useState } from 'react';
import {
  MinefieldGenerateResponse,
  MatrixType,
  MinefieldGenerateRequest,
} from '@/types/game';

type QueryType = (
  params: MinefieldGenerateRequest,
) => Promise<MatrixType | null>;

interface HookData {
  data: MatrixType;
  loading: boolean;
  queryData: QueryType;
}

export const useGenerateMatrix = (): HookData => {
  const [data, setData] = useState<MatrixType>(null);
  const [loading, setLoading] = useState(false);

  const queryData: QueryType = useCallback(async ({ row, col }) => {
    try {
      setLoading(true);
      const res = await fetch('/api/minefield/generate', {
        method: 'POST',
        body: JSON.stringify({
          row,
          col,
        }),
      });
      if (res?.ok && res?.status === 200) {
        const resData: MinefieldGenerateResponse = await res.json();
        const data = resData?.result?.matrix || null;
        setData(data);
        return data;
      } else {
        return null;
      }
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    queryData,
  };
};
