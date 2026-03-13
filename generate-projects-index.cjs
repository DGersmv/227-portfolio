const fs = require('fs');
const path = require('path');

const projectsDir = path.join(__dirname, 'public', 'projects');

function generateIndexForFolder(folderPath) {
  const files = fs.readdirSync(folderPath).filter(file =>
    /\.(jpg|jpeg|png|webp|mp4|webm)$/i.test(file)
  );

  // Читаем существующий индекс
  const indexFilePath = path.join(folderPath, 'index.json');
  let index = [];
  
  if (fs.existsSync(indexFilePath)) {
    const existingIndex = fs.readFileSync(indexFilePath, 'utf-8');
    index = JSON.parse(existingIndex);
  }

  // Создаём новый список элементов
  const newItems = files.map(file => {
    const existingItem = index.find(item => item.file === file);

    // Если файл уже есть в индексе, обновляем его
    if (existingItem) {
      // Обновляем только подписи, если они пустые
      existingItem.captionRu = existingItem.captionRu || file; // Заполняем по умолчанию имя файла, если нет подписи
      existingItem.captionEn = existingItem.captionEn || file; // Заполняем по умолчанию имя файла, если нет подписи
      return existingItem; // Возвращаем обновлённую запись
    }

    // Если файла нет в индексе, создаём новую запись с пустыми подписями
    return {
      type: /\.(mp4|webm)$/i.test(file) ? 'video' : 'image',
      file,
      captionRu: file, // Заполняем по умолчанию имя файла
      captionEn: file  // Заполняем по умолчанию имя файла
    };
  });

  // Убираем файлы, которые есть в индексе, но нет в папке
  index = index.filter(item => files.includes(item.file));

  // Объединяем старые и новые элементы
  index = [...index, ...newItems];

  // Убираем дубли: создаём уникальные записи по всем полям
  const uniqueIndex = Array.from(new Map(index.map(item => [JSON.stringify(item), item])).values());

  // Записываем обратно обновлённый индекс
  fs.writeFileSync(indexFilePath, JSON.stringify(uniqueIndex, null, 2), 'utf-8');
  console.log(`✅ index.json обновлён для ${path.basename(folderPath)}: ${uniqueIndex.length} элементов`);
}

function processAllFolders() {
  const folders = fs.readdirSync(projectsDir).filter(name =>
    fs.statSync(path.join(projectsDir, name)).isDirectory()
  );

  folders.forEach(folder => {
    const folderPath = path.join(projectsDir, folder);
    generateIndexForFolder(folderPath);
  });

  console.log('🎉 Все index.json обновлены!');
}

processAllFolders();
