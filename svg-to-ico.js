const sharp = require("sharp");
const { png_to_ico } = require("./png-to-ico.js");

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
            png({ compressionLevel: 0 }).
            toBuffer().
            then((buffer) => { image_accept(buffer); }).
            catch((error) => { image_reject(error); });
         });
      });
      Promise.all(output_promises).then((buffers) => {
         png_to_ico(output_name, buffers).then(() => {
            accept(output_name);
         }).catch((error) => {
            reject(error)
         });
      });
   });
}

module.exports = svg_to_ico;