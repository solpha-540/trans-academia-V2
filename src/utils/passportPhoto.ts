/** Format photo passeport standard : 35 mm × 45 mm */
export const PASSPORT_RATIO = 35 / 45;
export const PASSPORT_WIDTH = 700;
export const PASSPORT_HEIGHT = 900;

export const PASSPORT_ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

export const cropToPassportFormat = async (imageDataUrl: string): Promise<File> => {
  const image = new Image();
  image.src = imageDataUrl;

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error('Impossible de charger l\'image capturée.'));
  });

  const sourceWidth = image.naturalWidth;
  const sourceHeight = image.naturalHeight;
  const sourceRatio = sourceWidth / sourceHeight;

  let cropWidth = sourceWidth;
  let cropHeight = sourceHeight;

  if (sourceRatio > PASSPORT_RATIO) {
    cropWidth = Math.round(sourceHeight * PASSPORT_RATIO);
  } else {
    cropHeight = Math.round(sourceWidth / PASSPORT_RATIO);
  }

  const cropX = Math.round((sourceWidth - cropWidth) / 2);
  const cropY = Math.round((sourceHeight - cropHeight) / 2);

  const canvas = document.createElement('canvas');
  canvas.width = PASSPORT_WIDTH;
  canvas.height = PASSPORT_HEIGHT;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Impossible de traiter la photo.');
  }

  context.drawImage(
    image,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    canvas.width,
    canvas.height
  );

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', 0.95)
  );

  if (!blob) {
    throw new Error('Impossible de générer la photo passeport.');
  }

  return new File([blob], `passport_${Date.now()}.jpg`, { type: 'image/jpeg' });
};

export const validatePhotoFile = (
  file: File,
  maxSizeBytes: number
): string | null => {
  if (!PASSPORT_ACCEPTED_TYPES.includes(file.type)) {
    return 'Format de photo invalide (JPG, PNG uniquement)';
  }
  if (file.size > maxSizeBytes) {
    const maxMo = (maxSizeBytes / (1024 * 1024)).toFixed(0);
    const fileMo = (file.size / (1024 * 1024)).toFixed(2);
    return `La photo ne doit pas dépasser ${maxMo} Mo (fichier : ${fileMo} Mo)`;
  }
  return null;
};
