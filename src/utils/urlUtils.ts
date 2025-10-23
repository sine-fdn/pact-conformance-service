/**
 * URL utility functions for normalizing URLs and preventing double slashes
 */

/**
 * Normalizes a URL by removing consecutive slashes (except after the protocol)
 * and ensuring proper URL construction.
 *
 * Examples:
 * - normalizeUrl("https://api.com//v2//footprints") -> "https://api.com/v2/footprints"
 * - normalizeUrl("https://api.com/", "/v2/footprints") -> "https://api.com/v2/footprints"
 * - normalizeUrl("https://api.com", "v2/footprints") -> "https://api.com/v2/footprints"
 *
 * @param parts - URL parts to join and normalize
 * @returns Normalized URL string without consecutive slashes
 */
export const normalizeUrl = (...parts: (string | undefined)[]): string => {
  // Filter out undefined/null parts
  const validParts = parts.filter((part): part is string => part != null && part !== "");

  if (validParts.length === 0) {
    return "";
  }

  // Join all parts with a slash
  const joined = validParts.join("/");

  // Replace consecutive slashes with a single slash, but preserve the protocol's double slash
  // This regex looks for multiple slashes and replaces them with a single slash,
  // but skips the :// pattern used in protocols
  const normalized = joined.replace(/([^:]\/)\/+/g, "$1");

  return normalized;
};

/**
 * Constructs a full URL by joining a base URL with a path/endpoint.
 * Automatically handles trailing/leading slashes to prevent double slashes.
 *
 * Examples:
 * - joinUrl("https://api.com/", "/v2/footprints") -> "https://api.com/v2/footprints"
 * - joinUrl("https://api.com", "v2/footprints") -> "https://api.com/v2/footprints"
 * - joinUrl("https://api.com/", "/.well-known/config") -> "https://api.com/.well-known/config"
 *
 * @param baseUrl - The base URL (may have trailing slash)
 * @param path - The path to append (may have leading slash)
 * @returns Properly joined URL without double slashes
 */
export const joinUrl = (baseUrl: string, path?: string): string => {
  if (!path) {
    return normalizeBaseUrl(baseUrl);
  }

  // Remove trailing slashes from baseUrl
  const cleanBase = baseUrl.replace(/\/+$/, "");

  // Remove leading slashes from path
  const cleanPath = path.replace(/^\/+/, "");

  // Join and normalize
  return normalizeUrl(cleanBase, cleanPath);
};

/**
 * Normalizes a base URL by removing trailing slashes and consecutive slashes.
 *
 * @param baseUrl - The base URL to normalize
 * @returns Normalized base URL
 */
export const normalizeBaseUrl = (baseUrl: string): string => {
  // Remove trailing slashes
  const withoutTrailing = baseUrl.replace(/\/+$/, "");

  // Remove any consecutive slashes (except after protocol)
  return normalizeUrl(withoutTrailing);
};
