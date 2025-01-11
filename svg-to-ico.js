const fs = require("fs");
const sharp = require("sharp");
const { encode } = require("ico-endec");

/**
 * @return Returns a promise that performs the conversion operation.
 * 
 * @param {string} config.input_name Specifies the file name and path for the SVG input file
 * @param {string} config.output_name Specifies the name and path for the output .ico file
 * @param {number[]} config.sizes Specifies the array of sizes to include in the packaged .ico file
 * @param {number} config.compression_level Specifies the compression level (0-9) to use with PNG conversions
 */
async function svg_to_ico({
   input_name,
   output_name = "favicon.ico",
   sizes = [ 16, 32, 48, 64, 128, 256 ],
   compression_level = 1,
})
{
   if (!Number.isInteger(compression_level) || compression_level < 0 || compression_level > 9) {
      throw new Error(`invalid compression_level '${compression_level}'`);
   }
   return new Promise(function(accept, reject) {
      const output_promises = sizes.map((size) => {
         return new Promise((image_accept, image_reject) => {
            sharp(input_name).
            resize(size, size, {fit:"contain",background:{r:0,g:0,b:0,alpha:0}}).
            png({ compressionLevel: compression_level }).
            toBuffer().
            then((buffer) => { image_accept(buffer); }).
            catch((error) => { image_reject(error); });
         });
      });
      Promise.all(output_promises).then((buffers) => {
         const ico_buffer = encode(buffers);
         fs.promises.writeFile(output_name, ico_buffer)
            .then(() => accept())
            .catch((error) => reject(error));
      });
   });
}

module.exports = svg_to_ico;
