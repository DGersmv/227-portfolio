import React, { useEffect, useState } from 'react';

const API_KEY = 'AIzaSyDgn-0T5Hfzbd7Yav40-k7HD5LCviLsI_k';
const FOLDER_ID = '1A48sDMq7mEuT2eMcaoUPWvDItug41TRX';

export default function GoogleDriveAudioList() {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      const url = `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents+and+mimeType='audio/mpeg'&key=${API_KEY}&fields=files(id,name)`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        const audioFiles = data.files.map(file => ({
          name: file.name,
          url: `https://docs.google.com/uc?export=download&id=${file.id}`,
        }));
        setTracks(audioFiles);
      } catch (err) {
        console.error('Ошибка загрузки файлов с Google Drive:', err);
      }
    };

    fetchFiles();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white mb-4">🎵 Музыка из Google Drive</h2>
      {tracks.length === 0 ? (
        <p className="text-gray-400">Загрузка аудиофайлов...</p>
      ) : (
        tracks.map((track, idx) => (
          <div key={idx} className="bg-gray-800 p-4 rounded shadow">
            <p className="text-white mb-2">{track.name}</p>
            <audio controls src={track.url} className="w-full" />
          </div>
        ))
      )}
    </div>
  );
}
