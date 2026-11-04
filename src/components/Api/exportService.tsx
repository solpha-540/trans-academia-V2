import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Reservation } from '../../types/reservationType';
import convertImageToBase64 from '../../utils/convertImageToBase64';
import { Agent } from '../../types/agentType';
import { Absence } from '../../types/absenceType';

export interface ExportOptions {
  title?: string;
  includePhoto?: boolean;
  includeLogo?: boolean;
  columns?: string[];
  orientation?: 'portrait' | 'landscape';
  fileName?: string;
}

export interface AdresseExportOptions {
  title?: string;
  includeLogo?: boolean;
  columns?: string[];
  orientation?: 'portrait' | 'landscape';
  fileName?: string;
}

export interface AbsenceExportOptions extends Omit<ExportOptions, 'columns'> {
  columns?: ('Agent' | 'Service' | 'Date' | 'Durée' | 'Motif' | 'Statut')[];
  fileName?: string;
}

// Fonction pour formater les nombres en CDF
const formatNumberToCDF = (amount: number): string => {
  if (!amount && amount !== 0) return '0 CDF';
  return new Intl.NumberFormat('fr-FR').format(Math.round(amount)) + ' CDF';
};

// ========== FONCTIONS POUR L'ÂGE ET L'ANCIENNETÉ ==========
export const calculateAge = (dateNaissance: string): number => {
  if (!dateNaissance) return 0;
  const today = new Date();
  const birthDate = new Date(dateNaissance);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const calculateAnciennete = (dateEmbauche: string): string => {
  if (!dateEmbauche) return 'N/A';
  const today = new Date();
  const hireDate = new Date(dateEmbauche);
  let years = today.getFullYear() - hireDate.getFullYear();
  let months = today.getMonth() - hireDate.getMonth();
  let days = today.getDate() - hireDate.getDate();
  
  if (days < 0) {
    months--;
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += lastMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  
  if (years > 0) {
    return `${years} an${years > 1 ? 's' : ''}${months > 0 ? ` ${months} mois` : ''}`;
  } else if (months > 0) {
    return `${months} mois${days > 0 ? ` ${days} j` : ''}`;
  } else {
    return `${days} jour${days > 1 ? 's' : ''}`;
  }
};
// ========== FIN NOUVELLES FONCTIONS ==========

const AGENT_EXPORT_COLUMN_TITLES: { [key: string]: string } = {
  nom: 'Nom',
  matricule: 'Matricule',
  postNom: 'Post Nom',
  prenom: 'Prénom',
  sexe: 'Sexe',
  age: 'Âge',
  anciennete: 'Ancienneté',
  etatCivil: 'État Civil',
  contrat: 'Contrat',
  dateNaissance: 'Date Naissance',
  dateEmbauche: 'Date Embauche',
  telephone_un: 'Téléphone 1',
  telephone_deux: 'Téléphone 2',
  telephone_trois: 'Téléphone 3',
  mail: 'Mail',
  email: 'Email',
  fonctionLibelle: 'Fonction',
  gradeLibelle: 'Grade',
  role_libelle: 'Rôle',
  salaireNetAPayer: 'Salaire Net',
  salaire_total: 'Salaire Total',
  salaire_base: 'Salaire Base',
  serviceLibelle: 'Service',
  directionLibelle: 'Direction',
  domaineEtude: 'Domaine Étude',
  avenue: 'Avenue',
  quartier: 'Quartier',
  numero: 'Numéro',
  statut: 'Statut',
};

const formatAgentExportDate = (dateString: string): string => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString('fr-FR');
  } catch {
    return dateString;
  }
};

const getAgentExportCellValue = (agent: Agent, col: string): string => {
  if (col === 'anciennete') {
    return calculateAnciennete(agent.dateEmbauche);
  }

  if (col === 'age') {
    const age = calculateAge(agent.dateNaissance);
    return age > 0 ? age.toString() : 'N/A';
  }

  const rawValue: unknown = (agent as unknown as Record<string, unknown>)[col];

  if (rawValue === null || rawValue === undefined) return '';

  if (col === 'dateEmbauche' || col === 'dateNaissance' || col === 'agentLastUpdate' || col === 'agentCreatedAt') {
    return formatAgentExportDate(String(rawValue));
  }

  if (col === 'sexe') {
    const s = String(rawValue).toUpperCase();
    if (s === 'M') return 'M';
    if (s === 'F') return 'F';
    return String(rawValue);
  }

  if (col === 'compte') {
    if (typeof rawValue === 'object' && rawValue !== null) {
      const compte = rawValue as { numero_compte?: string };
      return compte?.numero_compte ? String(compte.numero_compte) : '';
    }
    return String(rawValue);
  }

  if (typeof rawValue === 'number') return String(rawValue);
  if (typeof rawValue === 'object') return '';
  return String(rawValue);
};

// Fonction pour exporter les réservations
export const exportReservationsToPDF = (
  reservations: Reservation[],
  options: Partial<ExportOptions> = {}
): void => {
  const {
    title = 'Liste des Réservations',
    columns = ['nomComplet', 'telephone', 'typeBus', 'dateDepart', 'heureDepart', 'status'],
    orientation = 'portrait'
  } = options;

  const doc = new jsPDF({ orientation, unit: 'mm' });

  doc.setFontSize(16);
  doc.text(title, 14, 15);
  doc.setFontSize(10);
  doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 14, 22);

  const columnTitles: { [key: string]: string } = {
    nomComplet: 'Nom Complet',
    telephone: 'Téléphone',
    typeBus: 'Type Bus',
    dateDepart: 'Date Départ',
    heureDepart: 'Heure Départ',
    catering: 'Catering',
    note: 'Note',
    status: 'Statut'
  };

  const tableColumn = columns.map(col => columnTitles[col] || col);

  const formatDate = (d: string) => {
    if (!d) return 'N/A';
    return new Date(d).toLocaleDateString('fr-FR');
  };

  const tableRows = reservations.map(reservation => {
    return columns.map(col => {
      let value: any = 'N/A';
      
      switch (col) {
        case 'nomComplet':
          value = reservation.client?.nom_complet || 'N/A';
          break;
        case 'telephone':
          value = reservation.client?.telephone || 'N/A';
          break;
        case 'typeBus':
          value = reservation.bus?.type || 'N/A';
          break;
        case 'dateDepart':
          value = formatDate(reservation.date_depart);
          break;
        case 'heureDepart':
          value = reservation.heure_depart || 'N/A';
          break;
        case 'catering':
          value = reservation.is_collation === 1 ? 'Oui' : 'Non';
          break;
        case 'note':
          value = reservation.note || 'N/A';
          break;
        case 'status':
          value = reservation.status || 'N/A';
          break;
        default:
          value = 'N/A';
      }
      
      return String(value);
    });
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 30,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [66, 139, 202] }
  });

  doc.save(`${title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
};

// Fonction pour exporter les agents
export const exportAgentsToPDF = async (agents: Agent[], options: Partial<ExportOptions> = {}): Promise<void> => {
  const {
    title = 'Liste des Agents',
    columns = ['nom', 'postNom', 'prenom', 'matricule', 'fonctionLibelle', 'telephone_un', 'sexe', 'dateEmbauche', 'age', 'anciennete'],
    orientation = 'portrait',
    includeLogo = true,
    fileName
  } = options;

  const doc = new jsPDF({ orientation, unit: 'mm' });

  const logoWidth = 15;
  const logoHeight = 15;
  const logoX = 16;
  const logoY = 10;

  let startY = 30;

  if (includeLogo) {
    try {
      const logoUrl = '/assets/images/brand-logos/1.png';
      const logoBase64 = await convertImageToBase64(logoUrl);
      doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);
      const textX = logoX + logoWidth + 5;
      doc.setFontSize(16);
      doc.text(title, textX, logoY + 5);
      doc.setFontSize(10);
      doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, textX, logoY + 10);
      startY = logoY + logoHeight + 10;
    } catch (error) {
      console.warn('⚠️ Impossible de charger le logo, PDF sans logo.', error);
      doc.setFontSize(16);
      doc.text(title, 14, 20);
      doc.setFontSize(10);
      doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 14, 27);
    }
  } else {
    doc.setFontSize(16);
    doc.text(title, 14, 20);
    doc.setFontSize(10);
    doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 14, 27);
  }

  const tableColumn = columns.map(col => AGENT_EXPORT_COLUMN_TITLES[col] || col);

  const tableRows = agents.map((agent) => {
    return columns.map((col) => getAgentExportCellValue(agent, col));
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: startY,
    styles: { 
      fontSize: 8,
      cellPadding: 2
    },
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
      fontStyle: 'bold'
    },
    margin: { left: 14, right: 14 }
  });

  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Page ${i} sur ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  const defaultFileName = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}`;
  doc.save(`${fileName || defaultFileName}.pdf`);
};

export const exportAgentsToXLSX = (
  agents: Agent[],
  options: Partial<ExportOptions> = {}
): void => {
  const {
    title = 'Liste des Agents',
    columns = ['nom', 'postNom', 'prenom', 'matricule', 'fonctionLibelle', 'telephone_un', 'sexe', 'dateEmbauche', 'age', 'anciennete'],
    fileName,
  } = options;

  const headers = columns.map((col) => AGENT_EXPORT_COLUMN_TITLES[col] || col);
  const rows = agents.map((agent) => columns.map((col) => getAgentExportCellValue(agent, col)));

  const worksheet = XLSX.utils.aoa_to_sheet([
    [title],
    [`Généré le: ${new Date().toLocaleDateString('fr-FR')}`],
    [],
    headers,
    ...rows,
  ]);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Agents');

  const defaultFileName = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}`;
  XLSX.writeFile(workbook, `${fileName || defaultFileName}.xlsx`);
};

// Fonction pour exporter les adresses des agents
export const exportAdressesToPDF = async (
  adresses: any[],
  options: Partial<AdresseExportOptions> = {}
): Promise<void> => {
  const {
    title = 'Liste des adresses des agents',
    columns = ['nomComplet', 'sexe', 'mail', 'adresseComplete', 'localiteComplete'],
    orientation = 'portrait',
    includeLogo = true,
    fileName = `adresses-agents-${new Date().toISOString().split('T')[0]}`
  } = options;

  const doc = new jsPDF({ orientation, unit: 'mm' });

  const logoWidth = 15;
  const logoHeight = 15;
  const logoX = 16;
  const logoY = 10;

  let startY = 30;

  if (includeLogo) {
    try {
      const logoUrl = '/assets/images/brand-logos/1.png';
      const logoBase64 = await convertImageToBase64(logoUrl);
      doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);
      const textX = logoX + logoWidth + 5;
      doc.setFontSize(16);
      doc.text(title, textX, logoY + 5);
      doc.setFontSize(10);
      doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, textX, logoY + 10);
      startY = logoY + logoHeight + 10;
    } catch (error) {
      console.warn('⚠️ Impossible de charger le logo, PDF sans logo.', error);
      doc.setFontSize(16);
      doc.text(title, 14, 20);
      doc.setFontSize(10);
      doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 14, 27);
    }
  } else {
    doc.setFontSize(16);
    doc.text(title, 14, 20);
    doc.setFontSize(10);
    doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 14, 27);
  }

  const columnTitles: { [key: string]: string } = {
    nomComplet: 'Nom complet',
    sexe: 'Sexe',
    mail: 'Email',
    adresseComplete: 'Adresse',
    avenue: 'Avenue',
    quartier: 'Quartier',
    num_parcelle: 'Numéro parcelle',
    localiteComplete: 'Localité',
    commune: 'Commune',
    ville: 'Ville',
    province: 'Province',
  };

  const tableColumn = columns.map(col => columnTitles[col] || col);

  const getFormattedAdresse = (adresse: any): string => {
    const parts = [];
    if (adresse.avenue && adresse.avenue !== 'null') parts.push(`Avenue ${adresse.avenue}`);
    if (adresse.quartier && adresse.quartier !== 'null') parts.push(`Quartier ${adresse.quartier}`);
    if (adresse.num_parcelle && adresse.num_parcelle !== 'null') parts.push(`Parcelle ${adresse.num_parcelle}`);
    return parts.length > 0 ? parts.join(', ') : 'Adresse non spécifiée';
  };

  const getFormattedLocalite = (adresse: any): string => {
    const parts = [];
    if (adresse.commune && adresse.commune !== 'null') parts.push(adresse.commune);
    if (adresse.ville && adresse.ville !== 'null') parts.push(adresse.ville);
    if (adresse.province && adresse.province !== 'null') parts.push(adresse.province);
    return parts.length > 0 ? parts.join(', ') : 'Localité non spécifiée';
  };

  const tableRows = adresses.map(adresse => {
    const formattedAdresse = {
      nomComplet: `${adresse.nom || ''} ${adresse.post_nom || ''} ${adresse.prenom || ''}`.trim(),
      sexe: adresse.sexe === 'M' ? 'Masculin' : adresse.sexe === 'F' ? 'Féminin' : 'Non spécifié',
      telephone: adresse.telephone_un || 'Non spécifié',
      adresseComplete: getFormattedAdresse(adresse),
      avenue: adresse.avenue || 'Non spécifié',
      quartier: adresse.quartier || 'Non spécifié',
      num_parcelle: adresse.num_parcelle || 'Non spécifié',
      localiteComplete: getFormattedLocalite(adresse),
      commune: adresse.commune || 'Non spécifié',
      ville: adresse.ville || 'Non spécifié',
      province: adresse.province || 'Non spécifié',
      agent_id: adresse.agent_id || ''
    };

    return columns.map(col => {
      const value = formattedAdresse[col as keyof typeof formattedAdresse] || '';
      return String(value);
    });
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: startY,
    styles: { 
      fontSize: 8,
      cellPadding: 2,
      overflow: 'linebreak'
    },
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
      fontStyle: 'bold'
    },
    margin: { left: 14, right: 14 },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 'auto' },
      3: { cellWidth: 'auto' },
      4: { cellWidth: 'auto' }
    }
  });

  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Page ${i} sur ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  doc.save(`${fileName}.pdf`);
};

// Fonction pour générer la confirmation de réservation
export const generateAutoReservationPDF = (
  reservationData: any,
  tarifInfo: any,
  totalPrice: number,
  agentName: string = 'Administrateur'
): void => {
  try {
    console.log('Début génération PDF avec:', { reservationData, tarifInfo, totalPrice, agentName });
    
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm' });
    const pageWidth = doc.internal.pageSize.width;
    
    doc.setFontSize(24);
    doc.setTextColor(40, 40, 40);
    doc.text('Réservation Confirmée', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text('Merci pour votre confiance!', pageWidth / 2, 30, { align: 'center' });
    
    doc.setFontSize(11);
    doc.text('Votre demande est en cours de traitement. Le service de location', pageWidth / 2, 38, { align: 'center' });
    doc.text('reviendra vers vous dans les prochaines heures pour finaliser les détails.', pageWidth / 2, 42, { align: 'center' });
    
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 48, 190, 48);
    
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text('Modalités de Paiement', 20, 58);
    
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text('Les paiements se font par virement bancaire (au moins 48 heures avant la date de location)', 20, 66);
    
    doc.setFontSize(10);
    doc.text('RAWBANK USD : 05100-00001-00922741004-87', 20, 74);
    doc.text('RAWBANK CDF : 05100-00001-00922741003-90', 20, 80);
    
    doc.setFontSize(14);
    doc.setTextColor(255, 140, 0);
    doc.text('EN ATTENTE', 20, 92);
    
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    const now = new Date();
    doc.text(`Date de réservation: ${now.toLocaleDateString('fr-FR')} à ${now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`, 20, 98);
    
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text('Informations du Client', 20, 110);
    
    autoTable(doc, {
      body: [
        ['Nom complet', reservationData.nom_complet || ''],
        ['Téléphone', reservationData.telephone || ''],
        ['Email', reservationData.email || ''],
        ['Sexe', reservationData.sexe === 'M' ? 'Masculin' : 'Féminin']
      ],
      startY: 115,
      theme: 'grid',
      styles: { 
        fontSize: 11,
        cellPadding: 4
      },
      columnStyles: {
        0: { cellWidth: 40, fontStyle: 'bold' },
        1: { cellWidth: 'auto' }
      },
      margin: { left: 20 }
    });
    
    let yPos = (doc as any).lastAutoTable?.finalY + 15 || 130;
    
    doc.setFontSize(16);
    doc.text('Détails du Bus', 20, yPos);
    yPos += 10;
    
    if (tarifInfo?.bus) {
      autoTable(doc, {
        body: [
          ['Type de bus', tarifInfo.bus.type || ''],
          ['Catégorie', tarifInfo.bus.categorie || ''],
          ['Capacité', `${tarifInfo.bus.capacite || 0} places`],
          ['Nombre de bus', `${reservationData.nombre_bus || 1}`],
          ['Statut', 'Disponible']
        ],
        startY: yPos,
        theme: 'grid',
        styles: { 
          fontSize: 11,
          cellPadding: 4
        },
        columnStyles: {
          0: { cellWidth: 40, fontStyle: 'bold' },
          1: { cellWidth: 'auto' }
        },
        margin: { left: 20 }
      });
      
      yPos = (doc as any).lastAutoTable?.finalY + 15 || yPos + 40;
    } else {
      doc.setFontSize(11);
      doc.text('Type de bus: Non spécifié', 20, yPos);
      yPos += 8;
      doc.text(`Nombre de bus: ${reservationData.nombre_bus || 1}`, 20, yPos);
      yPos += 8;
      doc.text('Statut: Disponible', 20, yPos);
      yPos += 15;
    }
    
    doc.setFontSize(16);
    doc.text('Informations du Voyage', 20, yPos);
    yPos += 10;
    
    const destinationName = tarifInfo?.destination?.nom || '- (KINSHASA)';
    
    autoTable(doc, {
      body: [
        ['Destination / Zone', destinationName],
        ['Date de départ', reservationData.date_depart || ''],
        ['Heure de départ', reservationData.heure_depart || '12:00']
      ],
      startY: yPos,
      theme: 'grid',
      styles: { 
        fontSize: 11,
        cellPadding: 4
      },
      columnStyles: {
        0: { cellWidth: 40, fontStyle: 'bold' },
        1: { cellWidth: 'auto' }
      },
      margin: { left: 20 }
    });
    
    yPos = (doc as any).lastAutoTable?.finalY + 15 || yPos + 40;
    
    doc.setFontSize(16);
    doc.text('Détails Tarifaires', 20, yPos);
    yPos += 10;
    
    const prixUnitaire = tarifInfo?.prix || 0;
    const cautionPourcentage = 0.10;
    const caution = prixUnitaire * cautionPourcentage * (reservationData.nombre_bus || 1);
    const collation = reservationData.prix_collation || 0;
    const sousTotal = prixUnitaire * (reservationData.nombre_bus || 1);
    
    autoTable(doc, {
      body: [
        ['Durée', tarifInfo?.duree || '12h journée entière'],
        ['Prix unitaire', formatNumberToCDF(prixUnitaire)],
        [`Caution (${cautionPourcentage * 100}%)`, formatNumberToCDF(caution)],
        ['Collation', formatNumberToCDF(collation)]
      ],
      startY: yPos,
      theme: 'grid',
      styles: { 
        fontSize: 11,
        cellPadding: 4
      },
      columnStyles: {
        0: { cellWidth: 40, fontStyle: 'bold' },
        1: { cellWidth: 'auto', halign: 'right' }
      },
      margin: { left: 20 }
    });
    
    doc.addPage();
    
    doc.setFontSize(16);
    doc.text('Sous-total', 20, 30);
    doc.setFontSize(14);
    doc.text(formatNumberToCDF(sousTotal), 180, 30, { align: 'right' });
    
    doc.setFontSize(18);
    doc.setTextColor(0, 100, 0);
    doc.text('TOTAL À PAYER', 20, 50);
    const totalAPayer = sousTotal + caution + collation;
    doc.text(formatNumberToCDF(totalAPayer), 180, 50, { align: 'right' });
    
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text('📌 Modalités de Paiement & Conditions Générales', 20, 70);
    
    doc.setFontSize(12);
    doc.text('❶ Notes Importantes', 20, 80);
    doc.setFontSize(10);
    doc.text('- Le client est prié de signaler son lieu d\'embarquement et l\'heure du début de la', 25, 87);
    doc.text('  course, moment à partir duquel le compte à rebours est lancé une fois le bus', 25, 91);
    doc.text('  arrivé au lieu indiqué.', 25, 95);
    doc.text('- La location réservée ne peut nullement faire l\'objet d\'annulation ou de report.', 25, 101);
    
    doc.setFontSize(12);
    doc.text('❷ Politique d\'Annulation', 20, 113);
    doc.setFontSize(10);
    doc.text('En cas d\'annulation, le client est prié de nous en informer dans les 48 heures :', 25, 120);
    doc.text('- Toute réservation confirmée est définitive et ne peut donc pas être reportée', 30, 125);
    doc.text('- Annulation signalée dans les 48 heures : frais de retenue de 20%', 30, 130);
    doc.text('- Annulation le jour de la location : frais de retenue de 30%', 30, 135);
    
    doc.setFontSize(12);
    doc.text('❸ Caution', 20, 147);
    doc.setFontSize(10);
    doc.text('Lors de la réservation, il est nécessaire de verser une caution remboursable équivalente', 25, 154);
    doc.text('à 10% du montant total de la location, conformément aux conditions.', 25, 158);
    
    doc.setFontSize(12);
    doc.text('❹ Dépassement Horaire', 20, 170);
    doc.setFontSize(10);
    doc.text('Tout dépassement d\'heure constaté entraîne des pénalités :', 25, 177);
    doc.text('- CDF 75 000 à 125 000 pour les bus standards', 30, 182);
    doc.text('- CDF 100 000 à 150 000 pour les autocars', 30, 187);
    
    doc.setFontSize(12);
    doc.text('❺ Tarification', 20, 199);
    doc.setFontSize(10);
    doc.text('- Tarification demi-journée : 6 heures', 25, 205);
    doc.text('- Tarification journée pleine : 12 heures', 25, 210);
    
    doc.setFontSize(14);
    doc.text('📌 Circulation & Sécurité', 20, 225);
    doc.setFontSize(10);
    doc.text('Le bus circule uniquement sur les artères principales et sa sécurisation est à la', 25, 232);
    doc.text('charge du client.', 25, 236);
    
    doc.setFontSize(11);
    doc.setTextColor(66, 139, 202);
    doc.text('Contact', 20, 250);
    doc.setFontSize(10);
    doc.text('+243 852 872128 contact@trans-academia.cd ❤ 177 nguma macampagne, Kinshasa', 25, 256);
    
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Créé par: ${agentName}`, 20, 280);
    doc.text(`ID Réservation: ${reservationData.id || 'N/A'}`, 20, 285);
    doc.text(`Date: ${now.toLocaleDateString('fr-FR')}`, 20, 290);
    
    const fileName = `Confirmation_Reservation_${reservationData.nom_complet?.replace(/\s+/g, '_') || 'Client'}_${Date.now()}.pdf`;
    console.log('Téléchargement du fichier:', fileName);
    doc.save(fileName);
    
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    try {
      const fallbackDoc = new jsPDF();
      fallbackDoc.setFontSize(16);
      fallbackDoc.text('CONFIRMATION DE RÉSERVATION', 20, 20);
      fallbackDoc.setFontSize(12);
      fallbackDoc.text(`Client: ${reservationData.nom_complet || 'Non spécifié'}`, 20, 30);
      fallbackDoc.text(`Destination: ${tarifInfo?.destination?.nom || 'Non spécifié'}`, 20, 40);
      fallbackDoc.text(`Date: ${reservationData.date_depart || 'Non spécifié'}`, 20, 50);
      fallbackDoc.text(`Créé par: ${agentName}`, 20, 60);
      fallbackDoc.text(`Date de génération: ${new Date().toLocaleDateString('fr-FR')}`, 20, 70);
      fallbackDoc.save(`Reservation_Erreur_${Date.now()}.pdf`);
    } catch (fallbackError) {
      console.error('Même le PDF de secours a échoué:', fallbackError);
    }
  }
};

export const printReservations = (reservations: Reservation[], columns: string[] = []): void => {
  const defaultColumns = ['nomComplet', 'telephone', 'typeBus', 'dateDepart', 'heureDepart', 'status'];
  const selectedColumns = columns.length > 0 ? columns : defaultColumns;

  const columnTitles: { [key: string]: string } = {
    nomComplet: 'Nom Complet',
    telephone: 'Téléphone',
    typeBus: 'Type Bus',
    dateDepart: 'Date Départ',
    heureDepart: 'Heure Départ',
    status: 'Statut'
  };

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Veuillez autoriser les pop-ups pour imprimer');
    return;
  }

  const reservationsConfirmees = reservations.filter(res => res.status === 'confirmed' ).length;
  const reservationsAvecCatering = reservations.filter(res => res.is_collation === 1).length;

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Non spécifié';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const formatStatus = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'confirmed': 'Confirmée',
      'confirmée': 'Confirmée',
      'pending': 'En attente',
      'processing': 'En traitement',
      'canceled': 'Annulée',
      'annulée': 'Annulée'
    };
    return statusMap[status] || status;
  };

  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Liste des Réservations</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
        .header h1 { margin: 0; color: #2c3e50; }
        .header p { margin: 5px 0 0 0; color: #666; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 8px; }
        .stat-item { text-align: center; padding: 10px; }
        .stat-value { font-size: 18px; font-weight: bold; color: #428bca; display: block; }
        .stat-label { font-size: 12px; color: #666; margin-top: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 11px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #428bca; color: white; font-weight: bold; text-align: center; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .status-confirmee { background-color: #d4edda; color: #155724; padding: 4px 8px; border-radius: 4px; font-weight: bold; }
        .status-attente { background-color: #fff3cd; color: #856404; padding: 4px 8px; border-radius: 4px; font-weight: bold; }
        .status-annulee { background-color: #f8d7da; color: #721c24; padding: 4px 8px; border-radius: 4px; font-weight: bold; }
        .catering-oui { color: #28a745; font-weight: bold; }
        .catering-non { color: #6c757d; }
        .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #666; border-top: 1px solid #ddd; padding-top: 10px; }
        @media print { body { margin: 10px; } .no-print { display: none; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Liste des Réservations</h1>
        <p>Généré le: ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
      </div>
      
      <div class="stats">
        <div class="stat-item">
          <span class="stat-value">${reservations.length}</span>
          <span class="stat-label">Total Réservations</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${reservationsConfirmees}</span>
          <span class="stat-label">Réservations Confirmées</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${reservationsAvecCatering}</span>
          <span class="stat-label">Avec Catering</span>
        </div>
      </div>
      
      <table>
        <thead>
          <tr>
            ${selectedColumns.map(col => `<th>${columnTitles[col] || col}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
  `;

  reservations.forEach(reservation => {
    htmlContent += '<tr>';
    selectedColumns.forEach(col => {
      let value = 'N/A';
      let cellClass = '';
      
      switch (col) {
        case 'nomComplet':
          value = reservation.client?.nom_complet || 'N/A';
          break;
        case 'telephone':
          value = reservation.client?.telephone || 'N/A';
          break;
        case 'typeBus':
          value = reservation.bus?.type || 'N/A';
          break;
        case 'dateDepart':
          value = formatDate(reservation.date_depart);
          break;
        case 'heureDepart':
          value = reservation.heure_depart || 'N/A';
          break;
        case 'status':
          value = formatStatus(reservation.status || 'N/A');
          cellClass = `status-${(reservation.status || '').replace(' ', '-')}`;
          break;
        case 'catering':
          value = reservation.is_collation === 1 ? 'Oui' : 'Non';
          cellClass = value === 'Oui' ? 'catering-oui' : 'catering-non';
          break;
        case 'note':
          value = reservation.note || '-';
          break;
        default:
          value = 'N/A';
      }
      
      htmlContent += `<td class="${cellClass}">${value}</td>`;
    });
    htmlContent += '</tr>';
  });

  htmlContent += `
        </tbody>
      </table>
      
      <div class="footer">
        <p>Document généré automatiquement par le système de gestion des réservations</p>
        <p>Total: ${reservations.length} réservation(s)</p>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();

  printWindow.onload = function() {
    printWindow.print();
  };
};

export const exportAbsencesToPDF = (
  absences: Absence[],
  options: Partial<AbsenceExportOptions> = {}
): void => {
  const {
    title = 'Liste des Absences',
    columns = ['Agent', 'Service', 'Date', 'Durée', 'Motif', 'Statut'],
    orientation = 'portrait',
    includeLogo = true,
  } = options;
  
  const fileName = options.fileName || `absences_${new Date().toISOString().split('T')[0]}.pdf`;

  const doc = new jsPDF({ orientation, unit: 'mm' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;
  const tableStartY = 50;

  if (includeLogo) {
    // Logique pour ajouter un logo si nécessaire
  }

  doc.setFontSize(18);
  doc.setTextColor(33, 33, 33);
  doc.text(title, pageWidth / 2, 30, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(
    `Édité le: ${new Date().toLocaleDateString('fr-FR')}`,
    pageWidth - margin,
    40,
    { align: 'right' }
  );

  const tableColumn = columns;
  const tableRows: (string | number)[][] = [];

  absences.forEach(absence => {
    const absenceData = [
      absence.nom_complet || '',
      absence.service || '',
      new Date(absence.date_debut).toLocaleDateString('fr-FR') || '',
      `${absence.heure_debut} - ${absence.heure_fin}`,
      absence.motif || '',
      absence.statut || ''
    ];
    tableRows.push(absenceData);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: tableStartY,
    margin: { top: 10 },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 10
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
      overflow: 'linebreak'
    },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 40 },
      2: { cellWidth: 30 },
      3: { cellWidth: 30 },
      4: { cellWidth: 30 },
      5: { cellWidth: 30 }
    }
  });

  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      `Page ${i} sur ${pageCount}`,
      pageWidth - margin,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'right' }
    );
  }

  doc.save(fileName);
};

interface PrintAdressesOptions {
  province?: string;
  ville?: string;
  commune?: string;
  searchTerm?: string;
}

export const printAdresses = (
  adresses: any[], 
  columns: string[] = [],
  _options: PrintAdressesOptions = {}
): void => {
  const defaultColumns = ['nomComplet', 'adresseComplete', 'localiteComplete'];
  const selectedColumns = columns.length > 0 ? columns : defaultColumns;

  const columnTitles: { [key: string]: string } = {
    nomComplet: 'Nom complet',
    sexe: 'Sexe',
    mail: 'Email',
    adresseComplete: 'Adresse',
    avenue: 'Avenue',
    quartier: 'Quartier',
    num_parcelle: 'Numéro parcelle',
    localiteComplete: 'Localité',
    commune: 'Commune',
    ville: 'Ville',
    province: 'Province',
  };

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Veuillez autoriser les pop-ups pour imprimer');
    return;
  }

  const totalAdresses = adresses.length;
  const provincesUniques = [...new Set(adresses.map(a => a.province).filter(Boolean))].length;
  const villesUniques = [...new Set(adresses.map(a => a.ville).filter(Boolean))].length;
  const communesUniques = [...new Set(adresses.map(a => a.commune).filter(Boolean))].length;

  const getFormattedAdresse = (adresse: any): string => {
    const parts = [];
    if (adresse.avenue && adresse.avenue !== 'null') parts.push(`Avenue ${adresse.avenue}`);
    if (adresse.quartier && adresse.quartier !== 'null') parts.push(`Quartier ${adresse.quartier}`);
    if (adresse.num_parcelle && adresse.num_parcelle !== 'null') parts.push(`Parcelle ${adresse.num_parcelle}`);
    return parts.length > 0 ? parts.join(', ') : 'Adresse non spécifiée';
  };

  const getFormattedLocalite = (adresse: any): string => {
    const parts = [];
    if (adresse.commune && adresse.commune !== 'null') parts.push(adresse.commune);
    if (adresse.ville && adresse.ville !== 'null') parts.push(adresse.ville);
    if (adresse.province && adresse.province !== 'null') parts.push(adresse.province);
    return parts.length > 0 ? parts.join(', ') : 'Localité non spécifiée';
  };

  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Liste des adresses des agents</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
        .header h1 { margin: 0; color: #2c3e50; }
        .header p { margin: 5px 0 0 0; color: #666; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 8px; }
        .stat-item { text-align: center; padding: 10px; }
        .stat-value { font-size: 18px; font-weight: bold; color: #428bca; display: block; }
        .stat-label { font-size: 12px; color: #666; margin-top: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 11px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #428bca; color: white; font-weight: bold; text-align: center; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .adresse-cell { max-width: 250px; word-wrap: break-word; }
        .localite-cell { max-width: 150px; word-wrap: break-word; }
        .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #666; border-top: 1px solid #ddd; padding-top: 10px; }
        @media print { body { margin: 10px; } .no-print { display: none; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Liste des adresses des agents</h1>
        <p>Généré le: ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
      </div>
  `;

  htmlContent += `
    <div class="stats">
      <div class="stat-item">
        <span class="stat-value">${totalAdresses}</span>
        <span class="stat-label">Total adresses</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${provincesUniques}</span>
        <span class="stat-label">Provinces</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${villesUniques}</span>
        <span class="stat-label">Villes</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${communesUniques}</span>
        <span class="stat-label">Communes</span>
      </div>
    </div>
    
    <table>
      <thead>
        <tr>
          ${selectedColumns.map(col => `<th>${columnTitles[col] || col}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
  `;

  adresses.forEach(adresse => {
    htmlContent += '<tr>';
    
    selectedColumns.forEach(col => {
      let value = '';
      let cellClass = '';
      
      switch (col) {
        case 'nomComplet':
          value = `${adresse.nom || ''} ${adresse.post_nom || ''} ${adresse.prenom || ''}`.trim() || 'Nom inconnu';
          break;
        case 'sexe':
          value = adresse.sexe === 'M' ? 'Masculin' : adresse.sexe === 'F' ? 'Féminin' : 'Non spécifié';
          break;
        case 'mail':
          value = adresse.mail || 'Non spécifié';
          break;
        case 'adresseComplete':
          value = getFormattedAdresse(adresse);
          cellClass = 'adresse-cell';
          break;
        case 'localiteComplete':
          value = getFormattedLocalite(adresse);
          cellClass = 'localite-cell';
          break;
        case 'avenue':
          value = adresse.avenue || 'Non spécifié';
          break;
        case 'quartier':
          value = adresse.quartier || 'Non spécifié';
          break;
        case 'num_parcelle':
          value = adresse.num_parcelle || 'Non spécifié';
          break;
        case 'commune':
          value = adresse.commune || 'Non spécifié';
          break;
        case 'ville':
          value = adresse.ville || 'Non spécifié';
          break;
        case 'province':
          value = adresse.province || 'Non spécifié';
          break;
        case 'agent_id':
          value = adresse.agent_id || '';
          break;
        default:
          value = adresse[col] || '';
      }
      
      htmlContent += `<td class="${cellClass}">${value}</td>`;
    });
    
    htmlContent += '</tr>';
  });

  htmlContent += `
        </tbody>
      </table>
      
      <div class="footer">
        <p>Document généré automatiquement par le système de gestion des agents</p>
        <p>Total: ${totalAdresses} adresse(s)</p>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();

  printWindow.onload = function() {
    printWindow.print();
  };
};

// Fonction pour exporter les demandes de formation en PDF (CORRIGÉE - utilisation correcte des paramètres)
export const exportDemandesToPDF = (
  demandes: any[],
  options: Partial<ExportOptions> = {}
): void => {
  const {
    title = 'Liste des Demandes de Formation',
    columns = ['agent_id', 'nom_centre', 'nombre_personnes', 'date_debut', 'date_fin', 'montant', 'statut'],
    orientation = 'landscape'
  } = options;

  const doc = new jsPDF({ orientation, unit: 'mm' });

  doc.setFontSize(16);
  doc.text(title, 14, 15);
  doc.setFontSize(10);
  doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 14, 22);

  const columnTitles: { [key: string]: string } = {
    agent_id: 'Agent ID',
    nom_centre: 'Centre de formation',
    nombre_personnes: 'Nb. Personnes',
    date_debut: 'Date début',
    date_fin: 'Date fin',
    montant: 'Montant (CDF)',
    description: 'Description',
    statut: 'Statut',
    created_at: 'Date création'
  };

  const tableColumn = columns.map(col => columnTitles[col] || col);

  const formatDate = (d: string) => {
    if (!d) return 'N/A';
    return new Date(d).toLocaleDateString('fr-FR');
  };

  const formatMontant = (montant: string | number) => {
    const amount = typeof montant === 'string' ? parseFloat(montant) : montant;
    return Math.round(amount).toString() + ' CDF';
  };

  const formatStatut = (statut: string) => {
    const statutMap: { [key: string]: string } = {
      'en_attente': 'En attente',
      'approuvee': 'Approuvée',
      'rejetee': 'Rejetée',
      'en_cours': 'En cours',
      'terminee': 'Terminée'
    };
    return statutMap[statut?.toLowerCase()] || statut || 'N/A';
  };

  const tableRows = demandes.map(demande => {
    return columns.map(col => {
      let value: any = 'N/A';
      
      switch (col) {
        case 'agent_id':
          value = demande.agent_id || 'N/A';
          break;
        case 'nom_centre':
          value = demande.nom_centre || 'N/A';
          break;
        case 'nombre_personnes':
          value = demande.nombre_personnes || 'N/A';
          break;
        case 'date_debut':
          value = formatDate(demande.date_debut);
          break;
        case 'date_fin':
          value = formatDate(demande.date_fin);
          break;
        case 'montant':
          value = formatMontant(demande.montant);
          break;
        case 'description':
          value = demande.description || 'N/A';
          break;
        case 'statut':
          value = formatStatut(demande.statut);
          break;
        case 'created_at':
          value = formatDate(demande.created_at);
          break;
        default:
          value = demande[col] || 'N/A';
      }
      
      return String(value);
    });
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 30,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [66, 139, 202] }
  });

  doc.save(`${title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
};

interface AgentFormationGroup {
  agentId: number;
  agentName: string;
  agentMatricule: string;
  agentFonction: string;
  agentService: string;
  formations: any[];
  formationIds: number[];
  totalMontant: number;
  formationCount: number;
  dernierStatut: string;
  derniereDate: string;
}

export const exportGroupedDemandesToPDF = async (
  groupes: AgentFormationGroup[],
  options: Partial<ExportOptions> = {}
): Promise<void> => {
  const {
    title = 'Liste des Demandes de Formation par Agent',
    columns = ['agentName', 'formationCount', 'totalMontant', 'dernierStatut'],
    orientation = 'landscape',
    includeLogo = true
  } = options;

  const doc = new jsPDF({ orientation, unit: 'mm' });

  const logoWidth = 15;
  const logoHeight = 15;
  const logoX = 16;
  const logoY = 10;

  let startY = 30;

  if (includeLogo) {
    try {
      const logoUrl = '/assets/images/brand-logos/1.png';
      const logoBase64 = await convertImageToBase64(logoUrl);
      doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);
      const textX = logoX + logoWidth + 5;
      doc.setFontSize(16);
      doc.text(title, textX, logoY + 5);
      doc.setFontSize(10);
      doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, textX, logoY + 10);
      startY = logoY + logoHeight + 10;
    } catch (error) {
      console.warn('⚠️ Impossible de charger le logo, PDF sans logo.', error);
      doc.setFontSize(16);
      doc.text(title, 14, 20);
      doc.setFontSize(10);
      doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 14, 27);
    }
  } else {
    doc.setFontSize(16);
    doc.text(title, 14, 20);
    doc.setFontSize(10);
    doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 14, 27);
  }

  const columnTitles: { [key: string]: string } = {
    agentName: 'Agent',
    agentMatricule: 'Matricule',
    agentFonction: 'Fonction',
    agentService: 'Service',
    formationCount: 'Nb Formations',
    totalMontant: 'Montant total',
    dernierStatut: 'Dernier statut',
    derniereDate: 'Dernière date'
  };

  const tableColumn = columns.map(col => columnTitles[col] || col);

  const formatDate = (d: string) => {
    if (!d) return 'N/A';
    return new Date(d).toLocaleDateString('fr-FR');
  };

  const formatMontant = (montant: number) => {
    const rounded = Math.round(montant);
    return rounded.toString() + ' CDF';
  };

  const formatStatut = (statut: string) => {
    const statutMap: { [key: string]: string } = {
      'en_attente': 'En attente',
      'approuvee': 'Approuvée',
      'rejetee': 'Rejetée',
      'en_cours': 'En cours',
      'terminee': 'Terminée'
    };
    return statutMap[statut?.toLowerCase()] || statut || 'N/A';
  };

  const tableRows = groupes.map(groupe => {
    return columns.map(col => {
      let value: any = 'N/A';
      
      switch (col) {
        case 'agentName':
          value = groupe.agentName || 'N/A';
          break;
        case 'agentMatricule':
          value = groupe.agentMatricule || 'N/A';
          break;
        case 'agentFonction':
          value = groupe.agentFonction || 'N/A';
          break;
        case 'agentService':
          value = groupe.agentService || 'N/A';
          break;
        case 'formationCount':
          value = groupe.formationCount || 0;
          break;
        case 'totalMontant':
          value = formatMontant(groupe.totalMontant);
          break;
        case 'dernierStatut':
          value = formatStatut(groupe.dernierStatut);
          break;
        case 'derniereDate':
          value = formatDate(groupe.derniereDate);
          break;
        default:
          value = (groupe as any)[col] || 'N/A';
      }
      
      return String(value);
    });
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: startY,
    styles: { 
      fontSize: 9,
      cellPadding: 2
    },
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
      fontStyle: 'bold'
    },
    margin: { left: 14, right: 14 }
  });

  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Page ${i} sur ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  const fileName = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
};

// Fonction d'impression des agents avec âge et ancienneté
export const printAgentsWithDetails = (agents: Agent[], columns: string[] = []): void => {
  const defaultColumns = ['nom', 'postNom', 'prenom', 'matricule', 'fonctionLibelle', 'age', 'anciennete', 'telephone_un'];
  const selectedColumns = columns.length > 0 ? columns : defaultColumns;

  const columnTitles: { [key: string]: string } = {
    nom: 'Nom',
    postNom: 'Post Nom',
    prenom: 'Prénom',
    matricule: 'Matricule',
    fonctionLibelle: 'Fonction',
    age: 'Âge',
    anciennete: 'Ancienneté',
    telephone_un: 'Téléphone',
    sexe: 'Sexe',
    dateEmbauche: 'Date Embauche',
    serviceLibelle: 'Service',
    directionLibelle: 'Direction'
  };

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Veuillez autoriser les pop-ups pour imprimer');
    return;
  }

  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Liste des Agents</title>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { text-align: center; color: #2c3e50; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #428bca; color: white; }
        .footer { text-align: center; margin-top: 30px; font-size: 10px; color: #666; }
      </style>
    </head>
    <body>
      <h1>Liste des Agents</h1>
      <p>Généré le: ${new Date().toLocaleDateString('fr-FR')}</p>
      <p>Total: ${agents.length} agent(s)</p>
      <table>
        <thead>
          <tr>${selectedColumns.map(col => `<th>${columnTitles[col] || col}</th>`).join('')}</tr>
        </thead>
        <tbody>
  `;

  agents.forEach(agent => {
    htmlContent += '<tr>';
    selectedColumns.forEach(col => {
      let value = '';
      if (col === 'age') {
        value = calculateAge(agent.dateNaissance).toString() || 'N/A';
      } else if (col === 'anciennete') {
        value = calculateAnciennete(agent.dateEmbauche);
      } else {
        value = (agent as any)[col] || 'N/A';
      }
      htmlContent += `<td>${value}</td>`;
    });
    htmlContent += '</tr>';
  });

  htmlContent += `
        </tbody>
      </table>
      <div class="footer">
        <p>Document généré le ${new Date().toLocaleString('fr-FR')}</p>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.onload = () => printWindow.print();
};