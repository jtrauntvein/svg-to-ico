declare module 'svg-to-ico' {
  export default function svg_to_ico (options: {
    input_name: string,
    output_name: string,
    sizes?: number[],
    compression_level?: number,
  }): Promise<void>;
}