const fs = require("fs");
const path = require("path");

const audioDir = path.join(__dirname, "public", "audio");
const outputFile = path.join(audioDir, "index.json");

const files = fs.readdirSync(audioDir).filter(file => file.endsWith(".mp3"));

const index = files.map(file => ({
  name: file,
  url: `/audio/${file}`
}));

fs.writeFileSync(outputFile, JSON.stringify(index, null, 2), "utf8");
console.log(`📝 index.json создан: ${index.length} файлов`);
