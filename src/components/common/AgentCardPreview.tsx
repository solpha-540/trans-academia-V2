import React from 'react';
import QRCode from 'react-qr-code';
import { AGENT_CARD_LAYOUT } from '../../utils/agentCardLayout';
import { AGENT_CARD_VERSO_LAYOUT } from '../../utils/agentCardLayout';
import { renderToStaticMarkup } from 'react-dom/server';

interface AgentCardPreviewProps {
  specimenImage: string;
  photoUrl?: string;
  nom?: string | null;
  postNom?: string | null;
  prenom?: string | null;
  matricule?: string | null;
  fonctionLibelle?: string | null;
  hasPhoto?: boolean;
}

const fieldClass =
  'absolute z-20 font-bold text-[#111] tracking-wide leading-none text-[clamp(9px,1.35vw,19px)]';

export const AgentCardPreview: React.FC<AgentCardPreviewProps> = ({
  specimenImage,
  photoUrl,
  nom,
  postNom,
  prenom,
  matricule,
  fonctionLibelle,
  hasPhoto = false,
}) => {
  const { photo, fields } = AGENT_CARD_LAYOUT;

  const fieldStyle = (key: keyof typeof fields): React.CSSProperties => ({
    top: `${fields[key].top}%`,
    left: `${fields[key].left}%`,
    transform: 'translateY(-0.12em)',
  });

  return (
    <div className="relative max-w-lg mx-auto bg-white shadow-xl overflow-hidden rounded-lg">
      <img src={specimenImage} alt="Spécimen de carte" className="w-full h-auto" />
      <div
        className="absolute overflow-hidden bg-white"
        style={{
          top: `${photo.top}%`,
          left: `${photo.left}%`,
          width: `${photo.width}%`,
          height: `${photo.height}%`,
        }}
      >
        {hasPhoto && photoUrl ? (
          <img
            src={photoUrl}
            alt={`Photo de ${prenom ?? ''} ${nom ?? ''}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 text-xs">
            PHOTO
          </div>
        )}
      </div>
      <div className={`${fieldClass} whitespace-nowrap`} style={fieldStyle('nom')}>{(nom || '').toUpperCase()}</div>
      <div className={`${fieldClass} whitespace-nowrap`} style={fieldStyle('postNom')}>{(postNom || '').toUpperCase()}</div>
      <div className={`${fieldClass} whitespace-nowrap`} style={fieldStyle('prenom')}>{(prenom || '').toUpperCase()}</div>
      <div className={`${fieldClass} whitespace-nowrap`} style={fieldStyle('matricule')}>{(matricule || 'NON ATTRIBUÉ').toUpperCase()}</div>
      <div className={`${fieldClass} max-w-[62%] uppercase`} style={fieldStyle('fonction')}>
        {(fonctionLibelle || 'NON SPÉCIFIÉE').toUpperCase()}
      </div>
    </div>
  );
};

interface AgentCardBackPreviewProps {
  specimenImage: string;
  codeGenerateTac?: string | null;
}

export const createAgentCardQrCodeSvg = (codeGenerateTac?: string | null): string =>
  renderToStaticMarkup(
    <QRCode
      value={codeGenerateTac?.trim() || 'CODE TAC NON ATTRIBUE'}
      level="M"
      size={256}
      bgColor="#FFFFFF"
      fgColor="#000000"
    />,
  );

export const AgentCardBackPreview: React.FC<AgentCardBackPreviewProps> = ({
  specimenImage,
  codeGenerateTac,
}) => {
  const { qrCode } = AGENT_CARD_VERSO_LAYOUT;
  const qrCodeValue = codeGenerateTac?.trim() || 'CODE TAC NON ATTRIBUE';

  return (
    <div className="relative max-w-lg mx-auto bg-white shadow-xl overflow-hidden rounded-lg">
      <img src={specimenImage} alt="Verso de la carte agent" className="w-full h-auto" />
      <div
        className="absolute z-20 bg-white p-[2%]"
        style={{
          top: `${qrCode.top}%`,
          left: `${qrCode.left}%`,
          width: `${qrCode.width}%`,
          aspectRatio: '1',
        }}
      >
        <QRCode value={qrCodeValue} level="M" className="w-full h-full" />
      </div>
    </div>
  );
};
