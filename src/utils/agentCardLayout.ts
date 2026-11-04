export const AGENT_CARD_SPECIMEN_PATH = '/assets/images/brand-logos/CARTE_portrait_R.jpeg';
export const AGENT_CARD_SPECIMEN_VERSO_PATH = '/assets/images/brand-logos/CARTE_portrait_V.jpeg';

/** Positions calibrées sur le spécimen portrait 1797×2886 px (valeurs après les deux-points). */
export const AGENT_CARD_LAYOUT = {
  photo: { top: 21.7, left: 29.4, width: 38.2, height: 29.9 },
  fields: {
    nom: { top: 55.5, left: 33.4 },
    postNom: { top: 59.7, left: 33.4 },
    prenom: { top: 63.7, left: 33.4 },
    matricule: { top: 67.7, left: 33.4 },
    fonction: { top: 71.7, left: 33.4 },
  },
  /** Taille police preview = % de la largeur carte (équivalent ~1.35vw) */
  fontSizePercent: 1.35,
  /** Impression : dimensions carte CR80 portrait + police en pt (taille physique réelle). */
  print: {
    widthMm: 54,
    heightMm: 85.6,
    fontSizePt: 6,
    fonctionFontSizePt: 5.5,
  },
} as const;

/** Zone réservée au QR code sur le spécimen verso 1797×2886 px. */
export const AGENT_CARD_VERSO_LAYOUT = {
  qrCode: { top: 21.4, left: 30.5, width: 38 },
} as const;

export interface AgentCardFieldData {
  nom?: string | null;
  postNom?: string | null;
  prenom?: string | null;
  matricule?: string | null;
  fonctionLibelle?: string | null;
  photo?: string | null;
}

const toUpper = (value?: string | null, fallback = ''): string =>
  (value || fallback).toUpperCase();

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const buildAgentCardPrintHtml = ({
  agent,
  photoUrl,
  specimenImage,
  versoImage,
  qrCodeSvg,
}: {
  agent: AgentCardFieldData;
  photoUrl: string;
  specimenImage: string;
  versoImage?: string;
  qrCodeSvg?: string;
  specimenWidth: number;
  specimenHeight: number;
}): string => {
  const { photo, fields, print } = AGENT_CARD_LAYOUT;
  const { widthMm, heightMm, fontSizePt, fonctionFontSizePt } = print;

  const fieldCss = (key: keyof typeof fields) =>
    `top:${fields[key].top}%;left:${fields[key].left}%;`;

  const nom = escapeHtml(toUpper(agent.nom));
  const postNom = escapeHtml(toUpper(agent.postNom));
  const prenom = escapeHtml(toUpper(agent.prenom));
  const matricule = escapeHtml(toUpper(agent.matricule, 'NON ATTRIBUÉ'));
  const fonction = escapeHtml(toUpper(agent.fonctionLibelle, 'NON SPÉCIFIÉE'));

  const versoCard = versoImage && qrCodeSvg
    ? `<div class="card-wrapper verso-card">
        <img src="${versoImage}" class="specimen-img" alt="Verso de la carte agent" />
        <div class="qr-code-area">${qrCodeSvg}</div>
      </div>`
    : '';

  return `<!DOCTYPE html>
<html>
<head>
  <title>Carte Agent - ${escapeHtml(agent.nom ?? '')} ${escapeHtml(agent.prenom ?? '')}</title>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { size: ${widthMm}mm ${heightMm}mm; margin: 0; }
    html, body {
      margin: 0; padding: 0;
      width: ${widthMm}mm;
      min-height: ${heightMm}mm;
      background: white;
    }
    @media print {
      html, body {
        width: ${widthMm}mm;
        min-height: ${heightMm}mm;
        height: auto;
        margin: 0; padding: 0; overflow: visible;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }
    .card-wrapper {
      position: relative;
      width: ${widthMm}mm;
      height: ${heightMm}mm;
      overflow: hidden;
      background: #fff;
    }
    .specimen-img {
      width: 100%;
      height: 100%;
      display: block;
    }
    .recto-card { page-break-after: always; break-after: page; }
    .verso-card { page-break-before: always; break-before: page; }
    .qr-code-area {
      position: absolute;
      top: ${AGENT_CARD_VERSO_LAYOUT.qrCode.top}%;
      left: ${AGENT_CARD_VERSO_LAYOUT.qrCode.left}%;
      width: ${AGENT_CARD_VERSO_LAYOUT.qrCode.width}%;
      aspect-ratio: 1;
      padding: 2%;
      background: #fff;
      z-index: 10;
    }
    .qr-code-area svg { display: block; width: 100%; height: 100%; }
    .overlay-layer {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      pointer-events: none;
    }
    .agent-photo-area {
      position: absolute;
      top: ${photo.top}%; left: ${photo.left}%;
      width: ${photo.width}%; height: ${photo.height}%;
      overflow: hidden; background: #f5f5f5; z-index: 5;
    }
    .agent-photo { width: 100%; height: 100%; object-fit: cover; }
    .field-value {
      position: absolute;
      font-size: ${fontSizePt}pt;
      font-weight: 700;
      color: #111;
      font-family: Arial, 'Segoe UI', sans-serif;
      letter-spacing: 0.02em;
      line-height: 1;
      transform: translateY(-0.12em);
      z-index: 10;
      white-space: nowrap;
    }
    .nom-element { ${fieldCss('nom')} }
    .postnom-element { ${fieldCss('postNom')} }
    .prenom-element { ${fieldCss('prenom')} }
    .matricule-element { ${fieldCss('matricule')} }
    .fonction-element {
      ${fieldCss('fonction')}
      font-size: ${fonctionFontSizePt}pt;
      text-transform: uppercase;
      max-width: 62%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1;
    }
    @media print {
      .field-value, .agent-photo-area {
        break-inside: avoid;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .field-value { font-size: ${fontSizePt}pt !important; }
      .fonction-element { font-size: ${fonctionFontSizePt}pt !important; }
    }
  </style>
</head>
<body>
  <div class="card-wrapper recto-card">
    <img src="${specimenImage}" class="specimen-img" alt="Carte Agent" />
    <div class="overlay-layer">
      <div class="agent-photo-area">
        ${agent.photo
          ? `<img src="${photoUrl}" class="agent-photo" alt="Photo agent" />`
          : '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#e8e8e8;color:#666;font-size:12px;">PHOTO</div>'}
      </div>
      <div class="field-value nom-element">${nom}</div>
      <div class="field-value postnom-element">${postNom}</div>
      <div class="field-value prenom-element">${prenom}</div>
      <div class="field-value matricule-element">${matricule}</div>
      <div class="field-value fonction-element">${fonction}</div>
    </div>
  </div>
  ${versoCard}
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
        setTimeout(function() { window.close(); }, 500);
      }, 400);
    };
  </script>
</body>
</html>`;
};
