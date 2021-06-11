const fs = require("fs");
const path = require("path");
const svgexport = require("svgexport");
const png_to_ico = require("png-to-ico");
const { v4: uuidv4 } = require("uuid");

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
   return new Promise((accept, reject) => {
      const scratch_dir = path.join(process.cwd(), uuidv4());
      fs.mkdirSync(scratch_dir);
      const do_close = (error) => { 
         fs.rm(scratch_dir, { recursive: true }, () => {
            if(error)
               reject(error);
            else
               accept(output_name);
         });
      };
      const png_names = sizes.map((size) => { return path.join(scratch_dir, `ico${size}.png`); });
      const png_files = png_names.map((png_name, index) => {
         return {
            "input": input_name,
            "output": `${png_name}  png ${sizes[index]}:`
         };
      });
      svgexport.render(png_files, () => {
         png_to_ico(png_names).then((ico_buff) => {
            fs.writeFile(output_name, ico_buff, (file_error) => {
               if(file_error)
                  do_close(file_error);
               else
                  do_close();
            });
         }).catch((error) => {
            do_close(error);
         });
      }).catch((error) => {
         do_close(error);
      });
   });
}

module.exports = svg_to_ico;