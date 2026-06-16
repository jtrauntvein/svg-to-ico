const fs = require("fs");
const { Resvg } = require("@resvg/resvg-js");
const { xml2js } = require("xml-js");
const { encode } = require("ico-endec");

/**
 * @return Returns a promise that performs the conversion operation.
 * 
 * @param {string} config.input_name Specifies the file name and path for the SVG input file
 * @param {string} config.output_name Specifies the name and path for the output .ico file
 * @param {number[]} config.sizes Specifies the array of sizes to include in the packaged .ico file
 */
async function svg_to_ico({
   input_name,
   output_name = "favicon.ico",
   sizes = [ 16, 32, 48, 64, 128, 256 ]
}) {
   // read the input file and extract its width and height, we need to choose the fit mode based on which of these
   // is larger.
   const input = await fs.promises.readFile(input_name);
   const input_json = xml2js(input);
   const image_json = input_json.elements.find((element) => element.name === 'svg');
   const input_width = Number.parseFloat(image_json.attributes.height);
   const input_height = Number.parseFloat(image_json.attributes.width);
   const mode = (input_width > input_height ? "height" : "width");

   // we will parse the svg into multiple size images fit to each given size
   const buffers = [];
   for(let size of sizes) {
      const options = {
         fitTo: {
            mode,
            value: size
         }
      };
      const resvg = new Resvg(input, options);
      const rendered = resvg.render();
      const buffer = rendered.asPng();
      buffers.push(buffer);
   }

   // we can now encode these buffers into ico
   const ico_buffer = encode(buffers);
   await fs.promises.writeFile(output_name, ico_buffer);
}

module.exports = svg_to_ico;
