import { CompteBancaire, UpdateCompteBancairePayload } from '../../types/compeBanquaireType';
import api from './axiosConfig';


// Mettre à jour un compte bancaire existant
export const updateCompteBancaire = async (id: number, payload: UpdateCompteBancairePayload): Promise<CompteBancaire> => {
  try {
    const response = await api.put(`/agent/UpdateSalaire?salaire_id=${id}`, payload);
    return response.data.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du compte bancaire :', error);
    throw error;
  }
};
