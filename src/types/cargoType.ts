// types/cargoTypes.ts
export interface LocationCargo {
  id: number
  reference: string
  typeCargo: 'Location' | 'Vrac ville'
  statut: 'En attente' | 'Confirmé' | 'En cours' | 'Terminé'
  poidsTotal: number
  dateLocation: string
  villeDepart: string
  villeDestination: string
  client: string
  telephone?: string
  email?: string
  description?: string
}

export interface BonEntree {
  id: number
  numeroBon: string
  devise: string
  sommeLettres: string
  sommeChiffres: number
  conducteur: string
  controleur: string
  convoyeur: string
  dateCreation: string
  signatureCaisse: string
  idDemande?: number
  client?: string
  trajet?: string
  dateLocation?: string
  formule?: string
  montantTotal: number
}

export interface BonSortie {
  id: number
  numeroBon: string
  motif: string
  montant: number
  beneficiaire: string
  dateCreation: string
  signatureCaisse: string
  idDemande?: number
  client?: string
}