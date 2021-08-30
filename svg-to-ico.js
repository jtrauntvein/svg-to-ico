const fsp = require("fs/promises");
const ico_packer = require("ico-packer");
const sharp = require("sharp");

/**
 * @return Returns a promise that performs the conversion operation.
 * 
 * @param {string} config.input_name Specifies the file name and path for the SVG input file.
 * @param {string=favicon.ico} config.output_name Specifies the name and path for the output .ico file.
 * @param {number[]} config.sizes Specifies the array of sizes to include in the packaged .ico file
 */
async function svg_to_ico({
   input_name,
   output_name = "favicon.ico",
   sizes = [ 16, 32, 48, 64, 128, 256 ]
})
{
   return new Promise(function(accept, reject) {
      const output_promises = sizes.map((size) => {
         return new Promise((image_accept, image_reject) => {
            sharp(input_name).
            resize(size, size, {fit:"contain",background:{r:0,g:0,b:0,alpha:0}}).
            png().
            toBuffer().
            then((buffer) => { image_accept(buffer); }).
            catch((error) => { image_reject(error); });
         });
      });
      Promise.all(output_promises).then((buffers) => {
         const output_buffer = ico_packer(buffers);
         fsp.writeFile(output_name, output_buffer).then(() => {
            accept(output_name);
         }).catch((error) => {
            reject(error);
         })
      });
   });
}

module.exports = svg_to_ico;