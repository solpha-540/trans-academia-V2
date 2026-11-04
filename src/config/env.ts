/**
 * Accès centralisé aux variables d'environnement Vite.
 * Les valeurs proviennent de .env.development (dev) ou .env.production (build).
 */

const trimTrailingSlash = (url: string): string => url.replace(/\/+$/, '');

export const FILE_BASE_URL = trimTrailingSlash(import.meta.env.VITE_FILE_URL);
export const API_BASE_URL = trimTrailingSlash(import.meta.env.VITE_API_URL);

/** URL Axios (avec slash final) */
export const axiosBaseURL = `${API_BASE_URL}/`;

/** /app/public/{chemin} */
export const filePublicUrl = (relativePath: string): string => {
  if (!relativePath) return '';
  if (relativePath.startsWith('http')) return relativePath;
  return `${FILE_BASE_URL}/app/public/${relativePath.replace(/^\//, '')}`;
};

/** /app/public + chemin (le chemin peut commencer par /) */
export const filePublicUrlJoin = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${FILE_BASE_URL}/app/public${suffix}`;
};

/** /app/{chemin} */
export const fileAppUrl = (relativePath: string): string => {
  if (!relativePath) return '';
  if (relativePath.startsWith('http')) return relativePath;
  return `${FILE_BASE_URL}/app/${relativePath.replace(/^\//, '')}`;
};

/** /public/{chemin} */
export const filePublicRootUrl = (relativePath: string): string => {
  if (!relativePath) return '';
  if (relativePath.startsWith('http')) return relativePath;
  return `${FILE_BASE_URL}/public/${relativePath.replace(/^\//, '')}`;
};

/** Photos agents (chemins avec ou sans préfixe photos_agents/) */
export const getAgentPhotoUrl = (photoPath: string): string => {
  if (!photoPath) return '';
  if (photoPath.startsWith('http')) return photoPath;
  if (photoPath.startsWith('photos_agents/')) {
    return filePublicUrl(photoPath);
  }
  return filePublicUrl(`photos_agents/${photoPath}`);
};
