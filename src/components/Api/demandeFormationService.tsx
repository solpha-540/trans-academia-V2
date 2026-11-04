import api from './axiosConfig';
import { DemandeFormation, DemandeFormationResponse } from '../../types/demandeFormationType';
import { toast } from 'react-toastify';





export const createDemandeFormation = async (demandeData: DemandeFormation): Promise<DemandeFormationResponse> => {
  console.log('=== DÉBUT createDemandeFormation ===');
  console.log('Données envoyées:', demandeData);
  
  try {
    const response = await api.post<DemandeFormationResponse>('formation/create', demandeData);
    
    console.log('Réponse complète de l\'API:', response);
    console.log('response.data:', response.data);
    console.log('response.data.code:', response.data?.code);
    console.log('response.data.message:', response.data?.message);
    
    // CORRECTION : Vérifiez le code au lieu de success
    // Les codes 200, 201, 202 sont des succès
    const isSuccess = response.data && (response.data.code === 200 || response.data.code === 201 || response.data.code === 202);
    
    if (isSuccess) {
      console.log('✅ SUCCÈS - Code:', response.data.code, '- Toast success va être affiché');
      toast.success(response.data.message || 'Demande de formation créée avec succès');
      // Retournez un objet avec success: true
      return {
        success: true,
        message: response.data.message,
        data: response.data.data
      };
    } else {
      console.log('❌ ÉCHEC - Code:', response.data?.code, '- Toast error va être affiché');
      toast.error(response.data?.message || 'Erreur lors de la création de la demande');
      return {
        success: false,
        message: response.data?.message || 'Erreur lors de la création de la demande'
      };
    }
  } catch (error: any) {
    console.log('❌ ERREUR CATCH - Toast error va être affiché');
    console.error('Erreur complète:', error);
    console.log('error.response:', error.response);
    console.log('error.response?.data:', error.response?.data);
    console.log('error.response?.data?.message:', error.response?.data?.message);
    
    if (error.response?.data?.errors) {
      console.log('Erreurs de validation:', error.response.data.errors);
      Object.values(error.response.data.errors).forEach((err: any) => {
        toast.error(err[0] || 'Erreur de validation');
      });
    } else {
      toast.error(error.response?.data?.message || 'Erreur lors de la communication avec le serveur');
    }
    
    return {
      success: false,
      message: error.response?.data?.message || 'Erreur lors de la création de la demande'
    };
  } finally {
    console.log('=== FIN createDemandeFormation ===\n');
  }
};

export const getDemandesFormation = async (): Promise<DemandeFormation[]> => {
  try {
    const response = await api.get('formation');
    return response.data.data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des demandes:', error);
    const status = (error as any)?.response?.status;
    if (status !== 401 && status !== 403) {
      toast.error('Impossible de récupérer la liste des demandes');
    }
    return [];
  }
};

export const getDemandeFormationById = async (id: number): Promise<DemandeFormation | null> => {
  try {
    const response = await api.get(`formation/by_id`, {
      params: { id: id }
    });
    
    if (response.data.code === 200 && response.data.data) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération de la demande:', error);
    toast.error('Impossible de récupérer les détails de la demande');
    return null;
  }
};

export const getDemandesFormationByAgent = async (agentId: number): Promise<DemandeFormation[]> => {
  try {
    const response = await api.get(`formation/agent_id`, {
      params: { agent_id: agentId }
    });
    
    if (response.data.code === 200 && response.data.data) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Erreur lors de la récupération des formations de l\'agent:', error);
    toast.error('Impossible de récupérer les formations de cet agent');
    return [];
  }
};

export const updateDemandeFormation = async (id: number, demandeData: Partial<DemandeFormation>): Promise<DemandeFormationResponse> => {
  try {
    const response = await api.put<DemandeFormationResponse>(`formation/${id}`, demandeData);
    
    if (response.data.success) {
      toast.success('Demande de formation mise à jour avec succès');
      return response.data;
    } else {
      toast.error(response.data.message || 'Erreur lors de la mise à jour');
      return response.data;
    }
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour:', error);
    toast.error('Erreur lors de la mise à jour de la demande');
    return {
      success: false,
      message: error.response?.data?.message || 'Erreur lors de la mise à jour'
    };
  }
};

export const deleteDemandeFormation = async (id: number): Promise<boolean> => {
  try {
    const response = await api.delete(`formation/${id}`);
    if (response.data.success) {
      toast.success('Demande de formation supprimée avec succès');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    toast.error('Erreur lors de la suppression de la demande');
    return false;
  }
};

export const updateFormation = async (id: number, formationData: Partial<DemandeFormation>): Promise<DemandeFormationResponse> => {
  console.log('=== DÉBUT updateFormation ===');
  console.log('ID:', id);
  console.log('Données:', formationData);
  
  try {
    const response = await api.put<DemandeFormationResponse>(`formation/update?id=${id}`, formationData);
    
    console.log('Réponse API updateFormation:', response.data);
    
    if (response.data && response.data.code === 200) {
      console.log('✅ SUCCÈS updateFormation');
      toast.success(response.data.message || 'Formation mise à jour avec succès');
      return {
        success: true,
        message: response.data.message,
        data: response.data.data
      };
    } else {
      console.log('❌ ÉCHEC updateFormation');
      toast.error(response.data?.message || 'Erreur lors de la mise à jour');
      return {
        success: false,
        message: response.data?.message || 'Erreur lors de la mise à jour'
      };
    }
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour:', error);
    toast.error('Erreur lors de la mise à jour de la formation');
    return {
      success: false,
      message: error.response?.data?.message || 'Erreur lors de la mise à jour'
    };
  } finally {
    console.log('=== FIN updateFormation ===\n');
  }
};

export const updateStatut = async (ids: number[], newStatus: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.put('formation/updateStatut', {
      ids: ids,
      statut: newStatus
    });
    
    if (response.data.success) {
      return {
        success: true,
        message: 'Statut mis à jour avec succès'
      };
    } else {
      return {
        success: false,
        message: response.data.message || 'Erreur lors de la mise à jour du statut'
      };
    }
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erreur lors de la mise à jour du statut'
    };
  }
};