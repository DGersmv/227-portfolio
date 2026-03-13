// /api/company/register.js

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs/promises';
import path from 'path';

// 🔐 Настройки из .env (только серверные, без VITE_)
const VK_REGION = 'ru-msk';
const VK_ENDPOINT = process.env.VK_CLOUD_ENDPOINT || 'https://hb.vkcloud-storage.ru';
const VK_BUCKET = process.env.VK_CLOUD_BUCKET;
const ACCESS_KEY = process.env.VK_CLOUD_ACCESS_KEY;
const SECRET_KEY = process.env.VK_CLOUD_SECRET_KEY;

const s3 = new S3Client({
  region: VK_REGION,
  endpoint: VK_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не поддерживается' });
  }

  const { companyId, companyName, email } = req.body;

  // 🔒 Проверка ID
  if (!companyId || !/^[a-z0-9-_]+$/i.test(companyId)) {
    return res.status(400).json({ error: 'Неверный формат ID компании (только латиница, цифры, тире и подчёркивание)' });
  }

  // 🧪 Проверка остальных данных
  if (!companyName || typeof companyName !== 'string') {
    return res.status(400).json({ error: 'Название компании обязательно' });
  }

  const isValidEmail = (email) =>
    typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Неверный формат email' });
  }

  const basePath = path.join(process.cwd(), 'data', companyId);
  const folders = ['assets', 'projects', 'clients', 'employees'];

  const info = {
    id: companyId,
    name: companyName,
    email,
    createdAt: new Date().toISOString(),
    projects: [],
    clients: [],
    employees: [],
  };

  try {
    // 📁 Локальные папки
    for (const folder of folders) {
      await fs.mkdir(path.join(basePath, folder), { recursive: true });
    }

    // 💾 Локальный info.json
    await fs.writeFile(
      path.join(basePath, 'info.json'),
      JSON.stringify(info, null, 2),
      'utf8'
    );

    // ☁️ Загрузка "папок" в VK Cloud
    for (const folder of folders) {
      const key = `${companyId}/${folder}/`;
      await s3.send(
        new PutObjectCommand({
          Bucket: VK_BUCKET,
          Key: key,
          Body: '',
        })
      );
    }

    // ☁️ Загрузка info.json
    await s3.send(
      new PutObjectCommand({
        Bucket: VK_BUCKET,
        Key: `${companyId}/info.json`,
        Body: JSON.stringify(info),
        ContentType: 'application/json',
      })
    );

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Ошибка при регистрации компании:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
