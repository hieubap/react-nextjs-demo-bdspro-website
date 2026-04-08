import fs from "fs";
import path from "path";
import { Parser } from "osm-pbf";

const filePath = path.join(__dirname, "data/vietnam.osm.pbf");

// ⚡ Tạo parser
const parser = new Parser();

let count = 0;

fs.createReadStream(filePath)
  .pipe(parser)
  .on("data", (item) => {
    // nodes, ways, relations đều có tags
    if (item.tags?.highway) {
      console.log("🛣️ Highway:", item.tags.highway);
    }

    count++;
    if ((count & 16383) === 0) process.stdout.write(`\r⏳ Processed: ${count}`);
  })
  .on("end", () => console.log(`\n✅ Done, total items: ${count}`))
  .on("error", (err) => console.error("❌ Error:", err));