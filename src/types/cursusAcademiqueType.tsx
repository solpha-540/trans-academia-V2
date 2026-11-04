// types/cursusAcademiqueType.ts

export interface CursusAcademique {
  id?: number;
  agent_id: number;
  diplome: string;
  institution: string;
  annee_terminale: string;
  domaine_etude: string;
  mention?: string;
  date_obtention: string;
  pays?: string;
  ville?: string;
  description?: string;
}

export interface CursusAcademiqueResponse {
  success: boolean;
  message: string;
  data?: CursusAcademique;
  errors?: any;
}
