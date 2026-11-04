import React, { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Camera, Upload, X } from 'lucide-react';
import { cropToPassportFormat, validatePhotoFile } from '../../utils/passportPhoto';

interface PassportPhotoPickerProps {
  previewUrl: string | null;
  onPhotoSelect: (file: File) => void;
  onPhotoRemove: () => void;
  onError?: (message: string) => void;
  error?: string;
  uploadInputId?: string;
  maxSizeBytes?: number;
  showGuidelines?: boolean;
}

export const PassportPhotoPicker: React.FC<PassportPhotoPickerProps> = ({
  previewUrl,
  onPhotoSelect,
  onPhotoRemove,
  onError,
  error,
  uploadInputId = 'photo-upload',
  maxSizeBytes = 2 * 1024 * 1024,
  showGuidelines = true,
}) => {
  const webcamRef = useRef<Webcam>(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validatePhotoFile(file, maxSizeBytes);
    if (validationError) {
      onError?.(validationError);
      event.target.value = '';
      return;
    }

    onPhotoSelect(file);
    event.target.value = '';
  };

  const handleCapture = useCallback(async () => {
    if (!webcamRef.current) {
      onError?.('Webcam indisponible. Veuillez réessayer.');
      return;
    }

    const screenshot = webcamRef.current.getScreenshot();
    if (!screenshot) {
      onError?.('Capture impossible. Vérifiez la permission caméra puis réessayez.');
      return;
    }

    setIsCapturing(true);
    try {
      const file = await cropToPassportFormat(screenshot);
      const validationError = validatePhotoFile(file, maxSizeBytes);
      if (validationError) {
        onError?.(validationError);
        return;
      }
      onPhotoSelect(file);
      setShowWebcam(false);
    } catch (captureError) {
      console.error('Erreur lors de la capture webcam:', captureError);
      onError?.('Erreur lors de la capture photo passeport. Veuillez réessayer.');
    } finally {
      setIsCapturing(false);
    }
  }, [maxSizeBytes, onError, onPhotoSelect]);

  const maxSizeMo = (maxSizeBytes / (1024 * 1024)).toFixed(0);

  return (
    <div className="space-y-4">
      {showGuidelines && (
        <div className="rounded-lg border border-indigo-100 bg-indigo-50/60 p-3 text-xs text-gray-600">
          <p className="font-medium text-indigo-800 mb-1">Normes photo passeport (35 × 45 mm)</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>Visage centré, regard face caméra</li>
            <li>Fond uni et clair, sans accessoire couvrant le visage</li>
            <li>Format JPG ou PNG, max {maxSizeMo} Mo</li>
          </ul>
        </div>
      )}

      {previewUrl ? (
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-[140px] aspect-[35/45] overflow-hidden rounded-md border-4 border-indigo-300 shadow-lg bg-white">
              <img
                src={previewUrl}
                alt="Prévisualisation photo passeport"
                className="h-full w-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={onPhotoRemove}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
              title="Supprimer la photo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-600">Photo sélectionnée — format passeport</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 border-2 border-dashed border-indigo-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors duration-200">
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleUpload}
              className="hidden"
              id={uploadInputId}
            />
            <label htmlFor={uploadInputId} className="cursor-pointer block">
              <Upload className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
              <span className="text-indigo-600 font-medium hover:text-indigo-700">
                Télécharger depuis vos fichiers
              </span>
            </label>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-indigo-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors duration-200">
            {showWebcam ? (
              <>
                <div className="relative mb-4 w-full max-w-[280px] aspect-[35/45] overflow-hidden rounded-md border-2 border-white shadow-lg bg-black">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/png"
                    videoConstraints={{ facingMode: 'user' }}
                    className="h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 border-2 border-indigo-400" />
                  <div className="pointer-events-none absolute inset-x-[15%] top-[8%] bottom-[35%] border border-dashed border-white/70 rounded-full" />
                </div>
                <p className="mb-3 text-xs text-gray-600">
                  Placez le visage au centre du cadre (format photo passeport 35×45)
                </p>
                <button
                  type="button"
                  onClick={handleCapture}
                  disabled={isCapturing}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg mb-2 w-[200px] hover:bg-indigo-700 disabled:opacity-60"
                >
                  {isCapturing ? 'Traitement...' : 'Capturer'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowWebcam(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setShowWebcam(true)}
                className="flex flex-col items-center justify-center h-full w-full"
              >
                <Camera className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
                <span className="text-indigo-600 font-medium hover:text-indigo-700">
                  Prendre une photo (webcam)
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="text-center">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};
