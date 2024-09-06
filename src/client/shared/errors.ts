export interface FastApiErrorResponse {
  code: string;
  error: string;
  message: string;
  statusCode: number;
}

export const isFastApiErrorResponse = (response: object): response is FastApiErrorResponse =>
  ['code', 'error', 'message', 'statusCode'].every((key) => key in response);
