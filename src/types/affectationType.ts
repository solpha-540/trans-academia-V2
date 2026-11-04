// =============================================
// Affectation Types - API Request/Response
// =============================================

// Request payload for creating an affectation
export interface AffectationPayload {
  agent_id: number;
  service_id: number;
  fonction_id: number;
  grade_id: number;
  Id_user_created_at: string;
}

// Response data from affectation creation
export interface AffectationResponseData {
  affectation_id: string;
  agent_id: number;
  service_id: number;
  adresse_id: number;
  matricule: string;
}

// API Response structure
export interface AffectationApiResponse {
  code: number;
  message: string;
  data: AffectationResponseData;
}

// Internal response for context/UI
export interface AffectationResponse {
  success: boolean;
  message: string;
  data?: AffectationResponseData;
}

// =============================================
// Fonctions by Service Types
// =============================================

// Service info in fonctions response
export interface ServiceInfo {
  id: number;
  libelle: string;
}

// Fonction item in fonctions response
export interface FonctionItem {
  id: number;
  libelle: string;
}

// Response data for fonctions by service
export interface FonctionsByServiceData {
  service: ServiceInfo;
  fonctions: FonctionItem[];
}

// API Response for fonctions by service
export interface FonctionsByServiceApiResponse {
  code: number;
  message: string;
  data: FonctionsByServiceData;
}

// Internal response for fonctions by service
export interface FonctionsByServiceResponse {
  success: boolean;
  message: string;
  data?: FonctionsByServiceData;
}

// =============================================
// Affectation Entity (for listing/display)
// =============================================

export interface Affectation {
  id: number;
  agent_id: number;
  service_id: number;
  fonction_id: number;
  grade_id: number;
  matricule: string;
  created_at: string;
  last_update: string;
  id_user_created: string;
  // Populated fields
  agentNom?: string;
  agentPrenom?: string;
  serviceLibelle?: string;
  fonctionLibelle?: string;
  gradeLibelle?: string;
}
