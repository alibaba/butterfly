import path from 'path';

/**
 * 通过unpkg加载远端图片
 * @param {String} url
 */
const loadImg = (url) => {
  var img = new Image();
  img.crossOrigin = 'Anonymous';

  return new Promise((resolve) => {
    img.onload = function () {
      const extname = (path.extname(url) || '.png').replace('.', '');
      const canvas = document.createElement('CANVAS');
      const ctx = canvas.getContext('2d');
      canvas.height = this.height;
      canvas.width = this.width;
      ctx.drawImage(this, 0, 0);
      const dataURL = canvas.toDataURL(`image/${extname}`);

      resolve(dataURL);
    };

    img.src = `https://unpkg.zhimg.com/${url}`;
  });
};

export default loadImg;
