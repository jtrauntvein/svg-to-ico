const tmp = require("tmp");
const fs = require("fs");
const path = require("path");
const svg2img = require("svg2img");
const png_to_ico = require("png-to-ico");


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
   sizes = [ 16, 32, 48, 64, 128 ]
})
{
   return new Promise((accept, reject) => {
      const scratch_dir = tmp.dirSync().name;
      const do_close = (error) => { 
         fs.rm(scratch_dir, { recursive: true }, () => {
            if(error)
               reject(error);
            else
               accept(output_name);
         });
      };
      const png_files = sizes.map((size) => {
         const png_name = path.join(scratch_dir, `ico${size}.png`);
         return {
            name: png_name,
            converter: new Promise((svg_accept, svg_reject) => {
               svg2img(input_name, { 
                  format: "png", 
                  preserveAspectRatio: true,
                  width: size,
                  height: size 
               },
               (svg_error, buffer) => {
                  if(svg_error)
                     svg_reject(svg_error);
                  else
                  {
                     fs.writeFileSync(png_name, buffer);
                     svg_accept(png_name);
                  }
               })
            })
         };
      });
      const png_promises = png_files.map((file) => { return file.converter; });
      Promise.all(png_promises).then(() => {
         const png_names = png_files.map((file) => { return file.name; });
         png_to_ico(png_names).then((ico_buff) => {
            fs.writeFile(output_name, ico_buff, (file_error) => {
               if(file_error)
                  do_close(file_error);
               else
                  do_close();
            })
         }).catch((error) => {
            do_close(error);
         })
      }).catch((error) => {
         do_close(error);
      });
   });
}

module.exports = svg_to_ico;