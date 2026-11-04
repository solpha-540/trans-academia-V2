// src/utils/imageUtils.ts

/**
 * Convertit une image URL en base64
 * @param url - L'URL de l'image à convertir
 * @returns Promise<string> - L'image en format base64
 */
const convertImageToBase64 = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
  
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
  
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Impossible de créer le contexte canvas'));
          return;
        }
  
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
  
      img.onerror = (err) => reject(err);
    });
  };
  
  export default convertImageToBase64;