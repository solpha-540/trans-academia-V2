// Prime type definitions

export interface Prime {
  id?: number;
  primeLibelle: string;
  montant: number;
  typePrime: string;
  type_prime:string;
  libele:string;
  id_user_created: string;
  created_at?: string;
  updated_at?: string;
}

// Payload for creating/updating prime
export interface PrimePayload {
  libele: string;
  montant: number;
  type_prime: string;

}

export interface PrimePayload {
  libele: string;
  montant: number;
  type_prime: string;
  id_user_created: string;
}