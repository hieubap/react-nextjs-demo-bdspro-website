const fs = require("fs");
const path = require("path");
const readline = require("readline");

const INPUT_PATH = path.join(__dirname, "data/good-labels.json");
const OUTPUT_PATH = path.join(__dirname, "data/good-labels.json");
console.log(INPUT_PATH,'INPUT_PATH');


(async () => {
  const readStream = fs.createReadStream(INPUT_PATH, { encoding: "utf8" });
  const writeStream = fs.createWriteStream(OUTPUT_PATH, { encoding: "utf8" });

  // thêm [ ở đầu
  writeStream.write("[\n");

  const rl = readline.createInterface({
    input: readStream,
    crlfDelay: Infinity,
  });

  let firstLine = true;
  let lineCount = 0;

  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (!firstLine) writeStream.write(",\n"); // thêm dấu , giữa các item
    writeStream.write(trimmed);
    firstLine = false;

    lineCount++;
    if (lineCount % 100000 === 0) {
      process.stdout.write(`\rProcessed: ${lineCount} lines`);
    }
  }

  writeStream.write("\n]\n"); // đóng array
  writeStream.close();
  console.log(`\n✅ Done! Total lines: ${lineCount}`);
})();
