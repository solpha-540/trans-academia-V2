// components/Api/cursusAcademiqueService.ts

import api from './axiosConfig';
import { CursusAcademique, CursusAcademiqueResponse } from '../../types/cursusAcademiqueType';
import { toast } from 'react-toastify';

export const createCursusAcademique = async (cursusData: CursusAcademique): Promise<CursusAcademiqueResponse> => {
  try {
    const response = await api.post<CursusAcademiqueResponse>('cursus-academique/create', cursusData);
    
    if (response.data.success) {
      toast.success('Cursus académique enregistré avec succès');
      return response.data;
    } else {
      toast.error(response.data.message || 'Erreur lors de l\'enregistrement du cursus');
      return response.data;
    }
  } catch (error: any) {
    console.error('Erreur lors de l\'enregistrement du cursus académique:', error);
    
    if (error.response?.data?.errors) {
      // Afficher les erreurs de validation
      Object.values(error.response.data.errors).forEach((err: any) => {
        toast.error(err[0] || 'Erreur de validation');
      });
    } else {
      toast.error(error.response?.data?.message || 'Erreur lors de la communication avec le serveur');
    }
    
    return {
      success: false,
      message: error.response?.data?.message || 'Erreur lors de l\'enregistrement du cursus',
      errors: error.response?.data?.errors
    };
  }
};

export const getCursusAcademiqueByAgent = async (agentId: number): Promise<CursusAcademique[]> => {
  try {
    const response = await api.get(`cursus-academique/agent/${agentId}`);
    return response.data.data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des cursus:', error);
    toast.error('Impossible de récupérer la liste des cursus académiques');
    return [];
  }
};

export const getCursusAcademiqueById = async (id: number): Promise<CursusAcademique | null> => {
  try {
    const response = await api.get(`cursus-academique/${id}`);
    return response.data.data || null;
  } catch (error) {
    console.error('Erreur lors de la récupération du cursus:', error);
    toast.error('Impossible de récupérer les détails du cursus académique');
    return null;
  }
};

export const updateCursusAcademique = async (id: number, cursusData: Partial<CursusAcademique>): Promise<CursusAcademiqueResponse> => {
  try {
    const response = await api.put<CursusAcademiqueResponse>(`cursus-academique/${id}`, cursusData);
    
    if (response.data.success) {
      toast.success('Cursus académique mis à jour avec succès');
      return response.data;
    } else {
      toast.error(response.data.message || 'Erreur lors de la mise à jour');
      return response.data;
    }
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour:', error);
    toast.error('Erreur lors de la mise à jour du cursus académique');
    return {
      success: false,
      message: error.response?.data?.message || 'Erreur lors de la mise à jour'
    };
  }
};

export const deleteCursusAcademique = async (id: number): Promise<boolean> => {
  try {
    const response = await api.delete(`cursus-academique/${id}`);
    if (response.data.success) {
      toast.success('Cursus académique supprimé avec succès');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    toast.error('Erreur lors de la suppression du cursus académique');
    return false;
  }
};

export const getAllCursusAcademique = async (): Promise<CursusAcademique[]> => {
  try {
    const response = await api.get('cursus-academique/list');
    return response.data.data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération de tous les cursus:', error);
    toast.error('Impossible de récupérer la liste des cursus académiques');
    return [];
  }
};
