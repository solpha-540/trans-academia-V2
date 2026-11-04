import { Ville } from './villeType';

export interface Commune {
    Id:number;
    id: number;
    labele: string;  // Changé de 'label' à 'labele' pour correspondre au backend
    Id_ville: number;  // Ajout de la propriété Id_venue
    ville_id: number;
    ville?: Ville;
    created_at: string;
    last_update: string;
    Id_user_created_at: string;
    created_by_user: string;  // Ancienne propriété, à conserver pour la rétrocompatibilité
}

export interface CommunePayload {
    labele: string;  // Changé de 'label' à 'labele' pour correspondre au backend
    label?: string;
    ville: number;
    Id_ville?: number;
    created_by_user?: string;
}
