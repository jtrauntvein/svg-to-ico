/**
 * Converts SVG files to ICO format with support for multiple sizes and compression.
 * @module svg-to-ico
 */
declare module 'svg-to-ico' {
  /**
   * Configuration options for SVG to ICO conversion
   */
  interface SvgToIcoOptions {
    /**
     * Path to the input SVG file
     */
    input_name: string;

    /**
     * Path to the output ICO file
     */
    output_name?: string;

    /**
     * Array of pixel sizes to include in the ICO file (e.g., [16, 32, 64])
     * @optional
     * @default [16, 32, 64]
     */
    sizes?: number[];

    /**
     * PNG compression level (0-9, where 0 is no compression and 9 is maximum)
     * @optional
     * @default 6
     */
    compression_level?: number;
  }

  /**
   * Converts an SVG file to ICO format
   *
   * @param options - Conversion options
   * @returns Promise that resolves when conversion is complete
   *
   * @example
   * ```ts
   * import svg_to_ico from 'svg-to-ico';
   *
   * await svg_to_ico({
   *   input_name: 'icon.svg',
   *   output_name: 'icon.ico',
   *   sizes: [16, 32, 64, 128],
   *   compression_level: 9
   * });
   * ```
   */
  export default function svg_to_ico(options: SvgToIcoOptions): Promise<void>;
}