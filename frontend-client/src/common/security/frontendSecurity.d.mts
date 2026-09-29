export function canAccessCandidateArea(session: {
  user?: { role?: string }
} | null | undefined): boolean

export function isCandidateRole(role: string | undefined): boolean

export function requiresCandidateRole(pathname: string): boolean

export function getRequestErrorMessage(
  error: unknown,
  messages: { forbidden: string; fallback: string },
): string
