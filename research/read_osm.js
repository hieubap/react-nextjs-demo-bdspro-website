const fs = require("fs");
const { parse } = require("osm-pbf");
const path = require("path");
// const ReadableStream = require("stream").Readable;

// 1. Đọc file dưới dạng Buffer
const filePath = path.join(__dirname, "data/vietnam.osm.pbf");

// ⚡ Chuyển Node stream sang Web stream
const nodeStream = fs.createReadStream(filePath);
const webStream = new ReadableStream({
  start(controller) {
    nodeStream.on("data", (chunk) => controller.enqueue(new Uint8Array(chunk)));
    nodeStream.on("end", () => controller.close());
    nodeStream.on("error", (err) => controller.error(err));
  },
});

async function parseOsmPbf() {
  let count = 0;
  let printed = 0;
  const maxPrint = 10;

  for await (const item of parse(webStream)) {
    const type = item.type; // "node" | "way" | "relation"
    const tags = item.tags || {};

    // In ra 10 item đầu tiên
    if (printed < maxPrint) {
      console.log(`\ntags: ${JSON.stringify(item)}`);
      printed++;
    }

    // Cập nhật tiến trình
    count++;
    if ((count & 100) === 0) {
      process.stdout.write(
        `\r⏳ Processed: ${count} | last type: ${type} | last tag: ${
          tags.highway || "-"
        }`
      );
    }
  }

  console.log(`\n✅ Done! Total items: ${count}`);
}

parseOsmPbf().catch(console.error);
