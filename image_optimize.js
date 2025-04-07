const fs = require('fs-extra');
const path = require('path');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');

(async () => {
  const srcDir = path.join(__dirname, 'src/images');
  const destDir = path.join(__dirname, 'public/images');
  
  // 画像コピー
  await fs.copy(srcDir, destDir);
  
  // 画像圧縮
  await imagemin([`${destDir}/*.{jpg,png}`], {
    destination: destDir,
    plugins: [
      imageminMozjpeg({ quality: 80 }),
      imageminPngquant({ quality: [0.8, 0.9] })
    ]
  });
})();
