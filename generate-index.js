const fs = require("fs");
const path = require("path");

const folderPath = path.join(__dirname, "public", "architecture", "images");

if (!fs.existsSync(folderPath)) {
    console.error(`❌ Папка ${folderPath} не найдена!`);
    process.exit(1);
}

const categories = [
    { name: "bath", prefix: "bath_" },
    { name: "houses", prefix: "house_" },
    { name: "other", prefix: "other_" }
];



categories.forEach(({ name, prefix }) => {
    const files = fs.readdirSync(folderPath)
        .filter(file =>
            file.toLowerCase().startsWith(prefix.toLowerCase()) &&
            (file.endsWith(".jpg") || file.endsWith(".png"))
        )
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    const outputPath = path.join(folderPath, `${name}.index.json`);
    fs.writeFileSync(outputPath, JSON.stringify(files, null, 2), "utf-8");
    const allFiles = fs.readdirSync(folderPath);
    console.log(`📁 ВСЕ ФАЙЛЫ в ${name}:`, allFiles);


    console.log(`✅ ${name}.index.json создан (${files.length} файлов)`);
});
