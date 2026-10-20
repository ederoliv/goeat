import axios from 'axios';
import type { ProblemDetails } from '../types/api';

// Turns an API error into a message for the user (problem details: detail > validation errors > title).
export function getErrorMessage(error: unknown, fallback = 'Algo deu errado. Tente novamente.'): string {
  if (!axios.isAxiosError<ProblemDetails>(error) || !error.response) return fallback;
  const { detail, errors, title } = error.response.data ?? {};
  if (detail) return detail;
  if (errors) {
    const first = Object.values(errors).flat()[0];
    if (first) return first;
  }
  return title ?? fallback;
}
