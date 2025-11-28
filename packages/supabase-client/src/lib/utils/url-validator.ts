/**
 * URL Validator Utility
 *
 * Provides secure URL validation to prevent Open Redirect vulnerabilities.
 * Only allows redirects to whitelisted internal paths.
 */

// Whitelist of allowed redirect paths
const ALLOWED_REDIRECT_PATHS = [
  '/dashboard',
  '/transactions',
  '/profile',
  '/settings',
  '/cards',
  '/categories',
  '/statements',
];

/**
 * Validates if a path is a safe redirect destination.
 *
 * Security checks:
 * 1. Must start with / (relative path)
 * 2. Cannot start with // (protocol-relative URL like //evil.com)
 * 3. Cannot contain : (prevents javascript:, data:, http: schemes)
 * 4. Must be in the whitelist or a subpath of a whitelisted path
 *
 * @param path - The path to validate
 * @returns true if the path is safe for redirection
 */
export function isValidRedirectPath(path: string): boolean {
  // Must start with /
  if (!path.startsWith('/')) {
    return false;
  }

  // Block protocol-relative URLs (//evil.com)
  if (path.startsWith('//')) {
    return false;
  }

  // Block URLs with schemes (javascript:, data:, http:, https:)
  if (path.includes(':')) {
    return false;
  }

  // Check against whitelist
  return ALLOWED_REDIRECT_PATHS.some(
    (allowed) => path === allowed || path.startsWith(allowed + '/')
  );
}

/**
 * Sanitizes a redirect path, returning a safe fallback if invalid.
 *
 * @param path - The path to sanitize
 * @param fallback - The fallback path if validation fails (default: '/dashboard')
 * @returns The original path if valid, otherwise the fallback
 */
export function sanitizeRedirectPath(path: string, fallback = '/dashboard'): string {
  return isValidRedirectPath(path) ? path : fallback;
}
