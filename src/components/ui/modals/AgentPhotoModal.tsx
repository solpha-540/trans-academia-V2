import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { PassportPhotoPicker } from '../../common/PassportPhotoPicker';
import { getAgentPhotoUrl } from '@/config/env';

interface AgentPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentId: number;
  agentName: string;
  currentPhoto?: string;
  onPhotoUpdate: (agentId: number, photoFile: File) => Promise<{ success: boolean; message: string }>;
}

export const AgentPhotoModal: React.FC<AgentPhotoModalProps> = ({
  isOpen,
  onClose,
  agentId,
  agentName,
  currentPhoto,
  onPhotoUpdate
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  const MAX_FILE_SIZE = 2 * 1024 * 1024;

  const revokePreviewUrl = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      setPreview(null);
      setError(null);
      revokePreviewUrl();
    }
    return () => revokePreviewUrl();
  }, [isOpen]);

  const handlePhotoSelect = (file: File) => {
    revokePreviewUrl();
    const objectUrl = URL.createObjectURL(file);
    previewUrlRef.current = objectUrl;
    setSelectedFile(file);
    setPreview(objectUrl);
    setError(null);
  };

  const handlePhotoRemove = () => {
    revokePreviewUrl();
    setSelectedFile(null);
    setPreview(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Veuillez sélectionner une photo');
      return;
    }

    setLoading(true);
    try {
      const result = await onPhotoUpdate(agentId, selectedFile);

      if (result.success) {
        toast.success('Photo mise à jour avec succès');
        handleClose();
      } else {
        toast.error(result.message);
        setError(result.message);
      }
    } catch {
      toast.error('Erreur lors de la mise à jour de la photo');
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    revokePreviewUrl();
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Modifier la photo de {agentName}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {currentPhoto && !preview && (
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-500 mb-2">Photo actuelle</p>
              <div className="w-[120px] aspect-[35/45] overflow-hidden rounded-md border-2 border-gray-200 bg-gray-50">
                <img
                  src={getAgentPhotoUrl(currentPhoto)}
                  alt={`Photo actuelle de ${agentName}`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/default-avatar.png';
                  }}
                />
              </div>
            </div>
          )}

          {selectedFile && !error && (
            <div className="text-center text-sm text-green-600 bg-green-50 p-2 rounded-lg">
              Nouveau fichier : {selectedFile.name}
              <br />
              Taille : {(selectedFile.size / (1024 * 1024)).toFixed(2)} Mo
            </div>
          )}

          <PassportPhotoPicker
            previewUrl={preview}
            onPhotoSelect={handlePhotoSelect}
            onPhotoRemove={handlePhotoRemove}
            onError={setError}
            error={error || undefined}
            uploadInputId="agent-photo-input"
            maxSizeBytes={MAX_FILE_SIZE}
          />

          <div className="flex space-x-3 pt-2">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || !!error || loading}
              className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                !selectedFile || !!error || loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {loading ? 'Mise à jour...' : 'Mettre à jour'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
