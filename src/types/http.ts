export type ResponseData<T> = {
  code: number;
  message: string;
  result: T;
};
