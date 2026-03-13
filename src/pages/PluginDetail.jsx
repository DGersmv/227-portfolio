import React, { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import VideoPlayer from '../components/VideoPlayer';
import PurchasePanel from '../components/PurchasePanel';
import { fetchProduct } from '../api/plugins';

const pluginData = {
  'DWG-mesh': {
    ru: {
      platform: 'Archicad',
      title: 'DWG-mesh',
      description: 'DWG-mesh — это аддон для Graphisoft Archicad 27–29 для Windows, который автоматически создаёт Topo Mesh по отметкам высот, импортированным из DWG.',
      buy: 'Купить',
      back: '← К расширениям',
      intro1: 'DWG-mesh — это аддон для Graphisoft Archicad 27–29 для Windows, который автоматически создаёт Topo Mesh по отметкам высот, импортированным из DWG.',
      intro2: 'Плагин анализирует текстовые отметки высоты на выбранном слое и генерирует корректную поверхность Mesh.',
      capabilities: 'Возможности',
      cap1: 'Автоматическое построение Topo Mesh',
      cap2: 'Чтение отметок высот из DWG',
      cap3: 'Поддержка форматов:',
      cap4: '14.200',
      cap5: '14,200',
      cap6: 'Настройка радиуса поиска текста',
      cap7: 'Автоматическое определение границы Mesh',
      cap8: 'Выбор:',
      cap9: 'слоя источника',
      cap10: 'слоя Mesh',
      cap11: 'выбора этажа для размещения 3D Сетки',
      howTitle: 'Как это работает',
      how1: 'Импортируйте DWG с отметками высот.',
      how2: 'Убедитесь, что отметки представлены текстовыми элементами.',
      how3: 'Откройте панель DWG-mesh.',
      how4: 'Выберите слой с отметками.',
      how5: 'Нажмите Создать Topo Mesh.',
      how6: 'Плагин:',
      how7: 'находит текстовые отметки',
      how8: 'преобразует их в координаты высоты',
      how9: 'создаёт Archicad Mesh',
      interfaceTitle: 'Интерфейс',
      interfaceIntro: 'Панель содержит настройки:',
      tableParam: 'Параметр',
      tableDesc: 'Описание',
      t1param: 'Слой с отметками',
      t1desc: 'слой, где находятся текстовые высоты',
      t2param: 'Радиус поиска',
      t2desc: 'радиус поиска текста возле точки',
      t3param: 'Разделитель',
      t3desc: 'точка или запятая',
      t4param: 'Этаж',
      t4desc: 'Выбор этажа для размещения 3D Сетки',
      t5param: 'Слой Mesh',
      t5desc: 'куда будет создан Mesh',
      installTitle: 'Установка',
      install1: 'После оплаты архив dwg-mesh.zip придёт на вашу почту.',
      install2: 'Распакуйте архив',
      install3: 'Поместите нужный файл в папку Archicad/Add-Ons:',
      install4a: 'DWG-mesh_AC27.apx — для Archicad 27 (Windows)',
      install4b: 'DWG-mesh_AC28.apx — для Archicad 28 (Windows)',
      install4c: 'DWG-mesh_AC29.apx — для Archicad 29 (Windows)',
      install7: 'Перезапустите Archicad.',
      install8: 'После этого панель появится в меню аддонов.',
      install9: 'Плагин совместим с Archicad 27–29, только Windows.',
      galleryTitle: 'Галерея',
      videoTitle: 'Инструкция',
      close: 'Закрыть'
    },
    en: {
      platform: 'Archicad',
      title: 'DWG-mesh',
      description: 'DWG-mesh is an add-on for Graphisoft Archicad 27–29 for Windows that automatically creates Topo Mesh from elevation points imported from DWG.',
      buy: 'Buy',
      back: '← Back to extensions',
      intro1: 'DWG-mesh is an add-on for Graphisoft Archicad 27–29 for Windows that automatically creates Topo Mesh from elevation points imported from DWG.',
      intro2: 'The plugin analyzes text elevation marks on the selected layer and generates a correct Mesh surface.',
      capabilities: 'Capabilities',
      cap1: 'Automatic Topo Mesh creation',
      cap2: 'Reading elevation marks from DWG',
      cap3: 'Format support:',
      cap4: '14.200',
      cap5: '14,200',
      cap6: 'Text search radius setting',
      cap7: 'Automatic Mesh boundary detection',
      cap8: 'Selection of:',
      cap9: 'source layer',
      cap10: 'Mesh layer',
      cap11: 'story for 3D Mesh placement',
      howTitle: 'How it works',
      how1: 'Import DWG with elevation marks.',
      how2: 'Ensure marks are represented as text elements.',
      how3: 'Open the DWG-mesh panel.',
      how4: 'Select the layer with marks.',
      how5: 'Click Create Topo Mesh.',
      how6: 'The plugin:',
      how7: 'finds text elevation marks',
      how8: 'converts them to elevation coordinates',
      how9: 'creates Archicad Mesh',
      interfaceTitle: 'Interface',
      interfaceIntro: 'The panel contains settings:',
      tableParam: 'Parameter',
      tableDesc: 'Description',
      t1param: 'Layer with marks',
      t1desc: 'layer containing text elevations',
      t2param: 'Search radius',
      t2desc: 'text search radius around the point',
      t3param: 'Separator',
      t3desc: 'period or comma',
      t4param: 'Story',
      t4desc: 'Select story for 3D Mesh placement',
      t5param: 'Mesh layer',
      t5desc: 'target layer for Mesh creation',
      installTitle: 'Installation',
      install1: 'After payment, the dwg-mesh.zip archive will be sent to your email.',
      install2: 'Extract the archive',
      install3: 'Place the appropriate file in Archicad/Add-Ons folder:',
      install4a: 'DWG-mesh_AC27.apx — for Archicad 27 (Windows)',
      install4b: 'DWG-mesh_AC28.apx — for Archicad 28 (Windows)',
      install4c: 'DWG-mesh_AC29.apx — for Archicad 29 (Windows)',
      install7: 'Restart Archicad.',
      install8: 'The panel will then appear in the add-ons menu.',
      install9: 'Plugin compatible with Archicad 27–29, Windows only.',
      galleryTitle: 'Gallery',
      videoTitle: 'Instruction',
      close: 'Close'
    }
  }
};

const DWG_MESH_PHOTOS = ['11.PNG', '22.PNG', '33.PNG'];
const DWG_MESH_VIDEO = '/plugins/archicad/DWG-mesh/photo/instr_DWG-mesh.mp4';
const DWG_MESH_POSTER = '/plugins/archicad/DWG-mesh/photo/33.PNG';
// Для выбора качества: при появлении разных файлов (1080p, 720p, 480p) замените на актуальные URL
const DWG_MESH_VIDEO_SOURCES = [
  { url: DWG_MESH_VIDEO, size: 1080 },
  { url: DWG_MESH_VIDEO, size: 720 },
  { url: DWG_MESH_VIDEO, size: 480 },
];

export default function PluginDetail({ lang = 'ru' }) {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const paymentStatus = searchParams.get('payment');
  const data = pluginData[slug]?.[lang] || pluginData[slug]?.ru;
  const [product, setProduct] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxVideo, setLightboxVideo] = useState(false);
  const [showPurchasePanel, setShowPurchasePanel] = useState(false);

  useEffect(() => {
    if (slug === 'DWG-mesh') fetchProduct('dwg-mesh').then(setProduct);
  }, [slug]);

  useEffect(() => {
    if (paymentStatus === 'success') {
      if (window.self !== window.top) {
        window.top.location.href = window.location.href;
        return;
      }
      setShowPurchasePanel(true);
    }
  }, [paymentStatus]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setLightboxImage(null);
        setLightboxVideo(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen text-white px-4 py-12 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">{lang === 'ru' ? 'Плагин не найден' : 'Plugin not found'}</p>
          <Link to="/plugins" className="text-purple-400 hover:underline">← {lang === 'ru' ? 'К расширениям' : 'Back to extensions'}</Link>
        </div>
      </div>
    );
  }

  const clearPaymentParam = () => setSearchParams({}, { replace: true });

  return (
    <div className="min-h-screen text-white px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        {paymentStatus === 'success' && (
          <div className="mb-6 p-4 rounded-lg bg-green-900/50 border border-green-600/50 text-green-300 flex items-center justify-between gap-4">
            <p>{lang === 'ru' ? 'Оплата прошла успешно. Ссылка на архив dwg-mesh.zip отправлена на вашу почту.' : 'Payment successful. Download link for dwg-mesh.zip has been sent to your email.'}</p>
            <button onClick={clearPaymentParam} className="text-green-400 hover:text-white shrink-0" aria-label="Close">✕</button>
          </div>
        )}
        {paymentStatus === 'fail' && (
          <div className="mb-6 p-4 rounded-lg bg-red-900/50 border border-red-600/50 text-red-300 flex items-center justify-between gap-4">
            <p>{lang === 'ru' ? 'Оплата не завершена. Вы можете повторить попытку.' : 'Payment was not completed. You can try again.'}</p>
            <button onClick={clearPaymentParam} className="text-red-400 hover:text-white shrink-0" aria-label="Close">✕</button>
          </div>
        )}
        <Link
          to="/plugins"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          {data.back}
        </Link>

        <div className="bg-gray-800/80 backdrop-blur-md rounded-xl overflow-hidden border border-gray-700/50">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2">
              <img
                src="/plugins/archicad/DWG-mesh/photo/33.PNG"
                alt={data.title}
                className="w-full h-48 md:h-64 object-cover"
              />
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-between">
              <div>
                <span className="text-xs font-medium text-purple-400 uppercase tracking-wide">{data.platform}</span>
                <h1 className="text-2xl font-bold text-white mt-1 mb-3">{data.title}</h1>
                <p className="text-gray-400 text-sm">{data.intro1}</p>
                <p className="text-gray-400 text-sm mt-2">{data.intro2}</p>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-700/50 flex items-center justify-between gap-4">
                <span className="text-xl font-semibold text-white">
                  {product ? `${Number(product.price_rub).toLocaleString('ru-RU')} ₽` : '—'}
                </span>
                <button
                  onClick={() => setShowPurchasePanel(true)}
                  className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition"
                >
                  {data.buy}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gray-800/80 backdrop-blur-md rounded-xl p-6 md:p-8 border border-gray-700/50 space-y-8">
          {slug === 'DWG-mesh' && (
            <section>
              <h2 className="text-lg font-semibold text-white mb-4">{data.videoTitle}</h2>
              <button
                type="button"
                onClick={() => setLightboxVideo(true)}
                className="block w-full text-left rounded-lg overflow-hidden border border-gray-600/50 hover:border-purple-500/50 transition-all cursor-pointer group"
              >
                <VideoPlayer
                  src={DWG_MESH_VIDEO}
                  poster={DWG_MESH_POSTER}
                  sources={DWG_MESH_VIDEO_SOURCES}
                  lang={lang}
                  className="[--plyr-color-main:theme(colors.purple.500)] pointer-events-none"
                />
              </button>
            </section>
          )}

          {slug === 'DWG-mesh' && (
            <section>
              <h2 className="text-lg font-semibold text-white mb-4">{data.galleryTitle}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {DWG_MESH_PHOTOS.map((file) => (
                  <button
                    key={file}
                    type="button"
                    onClick={() => setLightboxImage(file)}
                    className="block w-full text-left rounded-lg overflow-hidden border border-gray-600/50 hover:border-purple-500/50 transition-colors cursor-pointer"
                  >
                    <img
                      src={`/plugins/archicad/DWG-mesh/photo/${file}`}
                      alt={`${data.title} - ${file}`}
                      className="w-full h-40 object-cover"
                    />
                  </button>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">{data.capabilities}</h2>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>• {data.cap1}</li>
              <li>• {data.cap2}</li>
              <li>• {data.cap3}</li>
              <li className="pl-4 font-mono text-gray-300">{data.cap4}</li>
              <li className="pl-4 font-mono text-gray-300">{data.cap5}</li>
              <li>• {data.cap6}</li>
              <li>• {data.cap7}</li>
              <li>• {data.cap8}</li>
              <li className="pl-4">{data.cap9}</li>
              <li className="pl-4">{data.cap10}</li>
              <li className="pl-4">{data.cap11}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">{data.howTitle}</h2>
            <ol className="space-y-2 text-gray-400 text-sm list-decimal list-inside">
              <li>{data.how1}</li>
              <li>{data.how2}</li>
              <li>{data.how3}</li>
              <li>{data.how4}</li>
              <li>{data.how5}</li>
            </ol>
            <p className="text-gray-400 text-sm mt-3">{data.how6}</p>
            <ul className="space-y-1 text-gray-400 text-sm mt-2 pl-4">
              <li>• {data.how7}</li>
              <li>• {data.how8}</li>
              <li>• {data.how9}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">{data.interfaceTitle}</h2>
            <p className="text-gray-400 text-sm mb-4">{data.interfaceIntro}</p>
            <div className="overflow-x-auto rounded-lg border border-gray-600/50">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-700/50">
                    <th className="text-left py-3 px-4 font-medium text-white">{data.tableParam}</th>
                    <th className="text-left py-3 px-4 font-medium text-white">{data.tableDesc}</th>
                  </tr>
                </thead>
                <tbody className="text-gray-400">
                  <tr className="border-t border-gray-600/50"><td className="py-2 px-4">{data.t1param}</td><td className="py-2 px-4">{data.t1desc}</td></tr>
                  <tr className="border-t border-gray-600/50"><td className="py-2 px-4">{data.t2param}</td><td className="py-2 px-4">{data.t2desc}</td></tr>
                  <tr className="border-t border-gray-600/50"><td className="py-2 px-4">{data.t3param}</td><td className="py-2 px-4">{data.t3desc}</td></tr>
                  <tr className="border-t border-gray-600/50"><td className="py-2 px-4">{data.t4param}</td><td className="py-2 px-4">{data.t4desc}</td></tr>
                  <tr className="border-t border-gray-600/50"><td className="py-2 px-4">{data.t5param}</td><td className="py-2 px-4">{data.t5desc}</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">{data.installTitle}</h2>
            <ol className="space-y-2 text-gray-400 text-sm list-decimal list-inside">
              <li>{data.install1}</li>
              <li>{data.install2}</li>
              <li>
                {data.install3}
                <ul className="mt-2 ml-4 space-y-1 list-disc list-inside">
                  <li>{data.install4a}</li>
                  <li>{data.install4b}</li>
                  <li>{data.install4c}</li>
                </ul>
              </li>
              <li>{data.install7}</li>
              <li>{data.install8}</li>
              <li className="text-amber-300/90">{data.install9}</li>
            </ol>
          </section>
        </div>

        <AnimatePresence>
          {lightboxVideo && slug === 'DWG-mesh' && (
            <motion.div
              className="fixed inset-0 z-[300] bg-black/95 flex items-center justify-center p-4 cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxVideo(false)}
            >
              <button
                type="button"
                onClick={() => setLightboxVideo(false)}
                className="absolute top-4 right-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl transition-colors"
                aria-label={data.close}
              >
                ✕
              </button>
              <motion.div
                className="max-w-4xl w-full max-h-[90vh] cursor-default"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
              >
                <VideoPlayer
                  src={DWG_MESH_VIDEO}
                  poster={DWG_MESH_POSTER}
                  sources={DWG_MESH_VIDEO_SOURCES}
                  lang={lang}
                  autoplay
                  className="[--plyr-color-main:theme(colors.purple.500)]"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {lightboxImage && (
            <motion.div
              className="fixed inset-0 z-[300] bg-black/95 flex items-center justify-center p-4 cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxImage(null)}
            >
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl transition-colors"
                aria-label={data.close}
              >
                ✕
              </button>
              <motion.img
                src={`/plugins/archicad/DWG-mesh/photo/${lightboxImage}`}
                alt=""
                className="max-h-[90vh] max-w-full object-contain cursor-default"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showPurchasePanel && (
            <PurchasePanel
              lang={lang}
              onClose={() => {
                setShowPurchasePanel(false);
                if (paymentStatus === 'success') clearPaymentParam();
              }}
              initialPaymentSuccess={paymentStatus === 'success'}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
