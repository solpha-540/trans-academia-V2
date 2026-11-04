// Option type definitions

export interface Option {
  id?: number;
  libelle: string;
  id_sous_cat: number;
  id_sub_sous_cat?: number;
  valeur: number;
  created_at?: string;
  updated_at?: string;
}

// Payload for creating/updating option
export interface OptionPayload {
  libelle: string;
  id_sous_cat: number;
  id_sub_sous_cat?: number;
  valeur: number;
}

// Subcategory interface for multilevel select
export interface SubCategory {
  id: number;
  libelle: string;
  id_categorie: number;
  created_at?: string;
  updated_at?: string;
}

// Sub-Subcategory interface for three-level multilevel select
export interface SubSubCategory {
  id: number;
  libelle: string;
  id_sous_categorie: number;
  created_at?: string;
  updated_at?: string;
}