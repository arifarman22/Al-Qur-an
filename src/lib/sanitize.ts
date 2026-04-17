const DANGEROUS_TAGS = /<\s*\/?\s*(script|iframe|object|embed|form|input|link|style|meta|base|svg|math|template|applet)[^>]*>/gi;
const EVENT_HANDLERS = /\s*on\w+\s*=\s*["'][^"']*["']/gi;
const JAVASCRIPT_URLS = /javascript\s*:/gi;
const DATA_URLS = /data\s*:\s*text\/html/gi;

export function sanitize(input: string): string {
  return input
    .replace(DANGEROUS_TAGS, "")
    .replace(EVENT_HANDLERS, "")
    .replace(JAVASCRIPT_URLS, "")
    .replace(DATA_URLS, "");
}
