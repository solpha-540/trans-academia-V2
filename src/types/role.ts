// Role data interfaces (ce que vous avez déjà)
export interface Role {
    id: number;
    libelle: string;
    created_at: string;
    last_update: string;
    id_user_created: string;
}

export interface RolesApiResponse {
    code: number;
    message: string;
    data: Role[];
}

export interface ApiResponse {
    code: number;
    message?: string;
    data?: Role[];
    error?: string;
}

export interface RolePayload {
    id?: number;
    libelle: string;
    code: string;
    id_user_created: string;
}

// Nouvelle interface pour le comptage des utilisateurs par rôle
export interface UserRoleCount {
    role: string;
    nombre_utilisateurs: number;
}

export interface UserRoleCountResponse {
    code: number;
    message: string;
    data: UserRoleCount[];
}
  

