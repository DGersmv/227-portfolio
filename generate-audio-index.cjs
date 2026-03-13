// generate-audio-index.js

const fs = require('fs');
const path = require('path');

const AUDIO_DIR = path.join(__dirname, 'public', 'audio');
const OUTPUT_FILE = path.join(AUDIO_DIR, 'index.json');

function generateIndex() {
  const files = fs.readdirSync(AUDIO_DIR)
    .filter(file => file.toLowerCase().endsWith('.mp3'))
    .map(file => ({
      name: file,
      url: `/audio/${file}`
    }));

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(files, null, 2), 'utf-8');
  console.log(`✅ index.json обновлён: ${files.length} треков`);
}

generateIndex();
