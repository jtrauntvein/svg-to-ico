# svg-to-ico .ico file generator
This utility can be used to convert a provided SVG file first into a collection of .PNG files
and then it will combine these into an .ico format (such as is used by favicon.ico).

## CLI Interface
The easiest way to run the utility is to install it globally:

```
npm install -g svg-to-ico
```

Once installed, the utility can be run as follows:

```
svg-to-ico input-file-name [ output-file-name ]
```

If the output file name is not specified, it will default to "favicon.ico" in the current working directory.

## API

To use the API, you can install the package either globally or locally.  The package exposes  a single
async function that accepts the following named parameters:

- input_name (string): Specifies the name of the input SVG file
- output_name (string): Optionally specifies the name of the output .ico file.  If not specified,
   this will default to "favicon.ico" in the current working directory.
- sizes (number[]): Optionally specifies a list of sizes for individual PNG files in the ICO format.  Each size 
   will apply to both the width and the height but the aspect ratio of the original SVG will be preserved.

### Example

```
const svg_to_img = require("svg-to-ico");
svg_to_ico({
   input_name: "koala.svg",
   output_name: "koala.ico",
   sizes: [ 16, 24, 32, 64 ]
}).then(() => {
   console.log("file converted");
}).catch((error) => {
   console.error(`file conversion failed: ${error});
})
```

