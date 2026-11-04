import { AptitudePhysique } from "./aptitudePhysiqueType";
import { Conjoint } from "./conjointType";
import { Contact } from "./contactType";
import { Cursus } from "./cursusType";
import { DossierProfessionnel } from "./dossierProfessionnalType";
import { Enfant } from "./enfantType";
import { Formation } from "./formationType";
import { Prime } from "./primeType";
import { Reclamation } from "./reclamations";
import { SecuriteSociale } from "./securiteSocialType";

export type StatutAutorisation = "valide" | "rejetee" ;

export interface ValidationAgentRequest {
  id_op_agents: number[];  // Changé de id_op_agent à id_op_agents
}

export interface ValidationAgentResult {
  id_op_agent: number;
  status: 'success' | 'failed';
  data: {
    agentId: number;
    agent_matricule: string;
    agent_nom: string;
    agent_post_nom: string;
    agent_prenom: string;
    nomCompletAgent: string;
  };
  error?: string;
}

export interface ValidationAgentResponse {
  code: number;
  message: string;
  summary: {
    total: number;
    success: number;
    failed: number;
  };
  results: ValidationAgentResult[];
}

export interface Agent {
  agentId: number;
  nom: string;
  matricule: string;
  contrat: string;
  postNom: string;
  prenom: string;
  sexe: string;
  numParcelle: string;
  age: number;
  etatCivil: string;
  commune: string;
  id_fonction: number;
  etat_civil: string;
  id_grade: number;
  num_parcelle: string;
  avenue: string;
  quartier: string;
  numero: string;
  dateNaissance: string;
  dateEmbauche: string;
  statut: number;
  agentLastUpdate?: string; // date mise à jour, si tu l’as
  contacts: Contact[];
  domaineEtude: string;
  telephone: number;
  telephone_un: number;
  telephone_deux: number;
  telephone_trois: number;

  mail: string;
  email:string;

  compte: {
    id: number;
    numero_compte: string;
    nom_banque: string;
  };
  photo: string;
  fonctionLibelle: string;
  gradeLibelle: string;
  role_libelle: string;
  id_generate:string;
  salaireNetAPayer: string;
  salaire_total: string;
  salaire_base: string;
  serviceLibelle: string;
  directionLibelle: string;
  reclamations: Reclamation[];
  securite_sociale:SecuriteSociale[];
  formations: Formation[];
  primes: Prime[];
  cursus_academique: Cursus[];
  dossier?: DossierProfessionnel[];
  enfants?: Enfant[];
  conjoints?: Conjoint[];
  aptitude_physique?: AptitudePhysique[];
  autorisations?: Autorisation[]; // Ajout du champ autorisations
  photoEntreprise?: string;
  codeGenerateTac?: string;
  gradeSalaire?: string;
  numeroCompte?: string;
  nomBanque?: string;
  agentCreatedAt?: string;
}


export interface UpdateAgentPersonalInfoData {
  nom: string;
  post_nom: string;
  prenom: string;
  sexe: string;
  date_naissance: string;
  etat_civil: string;
  telephone_un: string;
  telephone_deux?: string;
  telephone_trois?: string;
  mail: string;
  commune: string;
  quartier: string;
  avenue?: string;
  num_parcelle?: string;
  id_fonction: number;
  id_grade: number;
  contrat: string;
  date_embauche: string;
  domaine_etude: string;
  photo?: File | null;
}





export interface Autorisation {
  id: number;
  id_op_agent: string;
  statut: StatutAutorisation;
}

export interface HistoriqueModification {
  id: number;
  id_op_agent_autorise: string;
  id_op_agent_modifie: number;
  table_modifie: string;
  id_ligne_modifie: number;
  nom_autoriser: string;
  postnom_autoriser: string;
  prenom_autoriser: string;
  created_at: string;
  updated_at: string;
  id_user_created: string;
}


export interface HistoriqueResponse {
  code: number;
  message: string;
  data: HistoriqueModification[];
}


export interface Specimen {
  id: number;
  libelle: string;
  photo: string; // URL de la photo
  status: string;
  created_at: string;
  updated_at: string;
  id_user_created: string;
}

export interface SpecimenResponse {
  code: number;
  message: string;
  data: Specimen;
}


