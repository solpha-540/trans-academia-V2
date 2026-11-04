import { FC } from 'react';
import { X } from 'lucide-react';
import { Agent } from '../../types/agentType';

interface ProfilePictureModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent;
}

const ProfilePictureModal: FC<ProfilePictureModalProps> = ({ isOpen, onClose, agent }) => {
  if (!isOpen) return null;
  
  const imageUrl = agent.photo || '/default-avatar.png';
  const altText = `${agent.prenom} ${agent.nom}`;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="relative max-w-4xl w-full max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <button 
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-8 h-8" />
        </button>
        <div className="bg-white rounded-lg overflow-hidden">
          <img 
            src={imageUrl} 
            alt={altText}
            className="w-full h-auto max-h-[80vh] object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/default-avatar.png';
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureModal;
