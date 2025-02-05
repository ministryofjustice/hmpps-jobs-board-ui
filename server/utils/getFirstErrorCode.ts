interface ErrorDetail {
  field: string
  message: string
  code: string
}

interface ErrorData {
  status: number
  error: string
  message: string
  details?: ErrorDetail[]
  timestamp: string
}

interface ErrorResponse {
  headers: Record<string, string>
  data: ErrorData
}

export default function getFirstErrorCode(errorResponse: ErrorResponse): string | undefined {
  return errorResponse?.data?.details?.[0]?.code
}
