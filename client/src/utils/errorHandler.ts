import { AxiosError } from 'axios';

export function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const axiosError = error as AxiosError<any>;
    return (
      axiosError.response?.data?.error ||
      axiosError.message ||
      'An unknown error occurred.'
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred.';
} 