import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = 'AIzaSyDgn-0T5Hfzbd7Yav40-k7HD5LCviLsI_k';
const FOLDER_ID = '1A48sDMq7mEuT2eMcaoUPWvDItug41TRX';
const TARGET_DIR = path.join(__dirname, 'public', 'audio');
const INDEX_FILE = path.join(TARGET_DIR, 'index.json');
const ALLOWED_EXTENSIONS = ['.mp3'];

async function fetchAudioFileList() {
  const query = encodeURIComponent(`'${FOLDER_ID}' in parents and mimeType='audio/mpeg'`);
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&key=${API_KEY}&fields=files(id,name)`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Google API error: ${res.statusText}`);
  const data = await res.json();
  return data.files.filter(file => ALLOWED_EXTENSIONS.includes(path.extname(file.name).toLowerCase()));
}

async function downloadFile(id, name) {
  const filePath = path.join(TARGET_DIR, name);
  if (fs.existsSync(filePath)) {
    console.log(`✅ Уже есть: ${name}`);
    return { name, url: `/audio/${name}` };
  }

  const url = `https://www.googleapis.com/drive/v3/files/${id}?alt=media&key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Ошибка загрузки ${name}: ${res.statusText}`);

  const stream = fs.createWriteStream(filePath);
  await new Promise((resolve, reject) => {
    res.body.pipe(stream);
    res.body.on('error', reject);
    stream.on('finish', resolve);
  });

  console.log(`⬇ Загружено: ${name}`);
  return { name, url: `/audio/${name}` };
}

async function cleanObsoleteFiles(validNames) {
  const existing = fs.readdirSync(TARGET_DIR);
  const toDelete = existing.filter(file =>
    ALLOWED_EXTENSIONS.includes(path.extname(file)) &&
    !validNames.includes(file)
  );

  for (const file of toDelete) {
    const fullPath = path.join(TARGET_DIR, file);
    fs.unlinkSync(fullPath);
    console.log(`🗑 Удалено устаревшее: ${file}`);
  }
}

async function main() {
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  const files = await fetchAudioFileList();
  const index = [];

  for (const file of files) {
    const trackInfo = await downloadFile(file.id, file.name);
    index.push(trackInfo);
  }

  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2), 'utf-8');
  console.log('📝 index.json обновлён');

  const validNames = files.map(f => f.name);
  await cleanObsoleteFiles(validNames);
}

main().catch(err => console.error('❌ Ошибка:', err));
