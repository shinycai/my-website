import * as sass from "sass";
import fs from "fs";
import path from "path";
import { readdir } from "fs/promises";
import { fileURLToPath } from "url";

import postcss from "postcss";
import syntax from "postcss-scss";
import autoprefixer from "autoprefixer";
import stripInlineComments from "postcss-strip-inline-comments";

// console.log(autoprefixer().info());

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ignoredFiles = [];

const compileAndSave = async (sassFile) => {
  const dest = sassFile.replace(path.extname(sassFile), ".css");
  const { css } = sass.compile(sassFile);
  postcss([autoprefixer, stripInlineComments])
    .process(css, { parser: syntax, from: dest })
    .then((result) => {
      fs.writeFile(dest, result.css, () => true);
    });
};

const processFiles = async (parent) => {
  const files = await readdir(parent, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory()) {
      await processFiles(path.join(parent, file.name));
    }
    if (path.extname(file.name) === ".scss") {
      if (!ignoredFiles.includes(file.name)) {
        await compileAndSave(path.join(parent, file.name));
      } else {
        console.log(`${file.name} has been explicitly ignored for compilation`);
      }
    }
  }
};

// Program execution process
for (const folder of ["styles", "blocks"]) {
  try {
    await processFiles(path.join(__dirname, folder));
  } catch (err) {
    console.error(err);
  }
}

let fsTimeout;
// only watch adding codes not deleting
fs.watch(
  ".",
  {
    // recursive: true, // use in windows
  },
  (eventType, fileName) => {
    clearTimeout(fsTimeout);

    fsTimeout = setTimeout(() => {
      fsTimeout = null;
      if (path.extname(fileName) === ".scss" && eventType === "change") {
        if (!ignoredFiles.includes(fileName)) {
          compileAndSave(path.join(__dirname, fileName));
        } else {
          console.log(
            `${fileName} has been explicitly ignored for compilation`
          );
        }
      }
    }, 1000); // give 1 seconds for multiple events
  }
);
