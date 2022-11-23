/**
 * Build a specific, unsigned ImgProxy URL
 *
 * @param urlTemplate string|null
 * @param width Integer (0 for auto)
 * @param height Integer (0 for auto)
 * @param mode "fit"|"fill"|"auto"
 * @param format "jpeg"|"webp"
 */
export function resolveResizedUrl(
  urlTemplate: string | null | undefined,
  width: number,
  height: number,
  mode: 'fit' | 'fill' | 'auto',
  format: 'jpeg' | 'webp'): string | null {
  if (urlTemplate) {
    return urlTemplate
      .replace('{{width}}', width + '')
      .replace('{{height}}', height + '')
      .replace('{{mode}}', mode)
      .replace('{{format}}', format);
  }
  return null;
}
