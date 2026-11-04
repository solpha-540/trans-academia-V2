export interface Direction {
    id: number;
    // Some endpoints return `libele` (single l), others `libelle` (double l).
    libele?: string;
    libelle?: string;
    created_at: string;
    last_update: string;
    id_user_created: string;
  }


 