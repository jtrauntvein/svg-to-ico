const fs = require("fs");

/**
 * @description Combines a collection of PNG formatted buffers into the .ico format and writes this to 
 * the file specified by output_name.
 * 
 * @param {string} output_name Specifies the output path of the .png file to be written
 * @param {Buffer[]} png_buffers Specifies the collection of binary PNG formatted buffers to write.
 * @return {Promise} Returns a promise that, when successfully fulfilled, will have written the output
 * file.
 */
async function png_to_ico(output_name, png_buffers) {
   return new Promise((accept, reject) => {
      // we need to first format the ico file header which will include the bitmap directory
      const file_type_pos = 2; // reserved uint2 before file type
      const image_count_pos = file_type_pos + 2;
      const dir_start = image_count_pos + 2;
      const header_prefix_len = dir_start + 2;
      const image_width_pos = 0;
      const image_height_pos = image_width_pos + 1;
      const colour_palette_size_pos = image_height_pos + 1; 
      const colour_planes_pos = colour_palette_size_pos + 2; // reserved byte after palette size
      const bpx_pos = colour_planes_pos + 2;
      const image_size_pos = bpx_pos + 2;
      const image_start_pos = image_size_pos + 4;
      const dir_entry_len = image_start_pos + 4;
      const header_len = header_prefix_len + dir_entry_len * png_buffers.length;
      const header = new ArrayBuffer(header_len);
      const header_view = new DataView(header, 0, header_len);
      let last_buffer_end = header_len + 1;
      header_view.setUint16(file_type_pos, 1, true);
      header_view.setUint16(image_count_pos, png_buffers.length, true);
      for(let i = 0; i < png_buffers.length; ++i)
      {
         const png_buffer = png_buffers[i];
         const png_size = png_buffer.length;
         const png_pos = last_buffer_end;
         const dir_view = new DataView(header, dir_start + i * dir_entry_len, dir_entry_len);
         last_buffer_end += png_pos + png_size + 1;
         dir_view[image_width_pos] = 0;
         dir_view[image_height_pos] = 0;
         dir_view[colour_palette_size_pos] = 0;
         dir_view.setUint16(bpx_pos, 32, true);
         dir_view.setUint32(image_size_pos, png_size, true);
         dir_view.setUint32(image_start_pos, png_pos, true);
      }

      // we can now attempt to open the output stream and write the header buffer and all png buffers
      // to that stream.
      const output = fs.createWriteStream(output_name);
      const write_promise = async function(buffer) {
         return new Promise((write_accept, write_reject) => { 
            output.write(buffer, (error) => {
               if(error)
                  write_reject(error);
               else
                  write_accept();
            });
         });
      };
      output.on("error", (error) => {
         reject(error);
      });
      output.on("open", () => {
         const write_ops = [ write_promise(Buffer.from(header)) ];
         png_buffers.forEach((buffer) => write_ops.push(write_promise(buffer)));
         Promise.all(write_ops).then(accept).catch((error) => reject(error));
      });
   });
}

module.exports = {
   png_to_ico
};
