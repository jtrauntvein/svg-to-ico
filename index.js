#!/usr/bin/env node
const svg_to_ico = require("./svg-to-ico");
const path = require("path");

async function do_convert()
{
   return new Promise((accept, reject) => {
      try
      {
         // check the command line arguments
         if(process.argv.length < 3)
            throw new Error("requires the input file name.");
         
         // parse the command line arguments.
         const input_name = process.argv[2];
         let output_name = path.join(process.cwd(), "favicon.ico");
         svg_to_ico({ input_name: input_name, output_name: output_name }).then(() => {
            accept();
         }).catch((error) => {
            reject(error);
         });
      }
      catch(error)
      { reject(error); }
   });
}

do_convert().then(() => {
   process.exit(0);
}).catch((error) => {
   console.error(`conversion error: ${error}`);
   process.exit(1);
});