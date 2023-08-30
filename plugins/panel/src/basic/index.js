let images = [];
for (let i = 1; i <= 12; i++) {
  let img = require(`./img/System-Basic-${i}.png`);
  images.push({
    id: `System-Basic-${i}`,
    type: 'png',
    content: img.default,
  });
}
export default images;
