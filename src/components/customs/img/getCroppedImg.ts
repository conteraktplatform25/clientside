import { Area } from 'react-easy-crop';

// ---------- Helper: createImage ----------
async function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (err) => reject(err));
    img.setAttribute('crossOrigin', 'anonymous');
    img.src = url;
  });
}

// ---------- Helper: getCroppedCanvas ----------
function getCroppedCanvas(image: HTMLImageElement, pixelCrop: Area) {
  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // draw the image to the canvas
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas;
}

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = getCroppedCanvas(image, pixelCrop);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error('Canvas is empty'));
        resolve(blob);
      },
      'image/webp',
      0.92
    );
  });
}
