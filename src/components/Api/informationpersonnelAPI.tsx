import { AxiosError } from 'axios';
import { InformationPersonnelData, ApiResponse } from '../../types/form';
import api from './axiosConfig';
import { getIdUserCreated } from '../../utils/auth';

const id_user_created: string | null = getIdUserCreated();

// Function to save photo to local assets directory
const savePhotoToAssets = async (photo: File, agentId: string): Promise<string> => {
  try {
    // Validate inputs
    if (!photo || !agentId) {
      throw new Error('Photo and agent ID are required');
    }

    // Generate unique filename with timestamp and agent ID
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileExtension = photo.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `profile_${agentId}_${timestamp}.${fileExtension}`;
    
    // Create consistent file paths
    const relativePath = `/assets/images/profile/${fileName}`;
    const fullPath = `src/assets/images/profile/${fileName}`;
    
    // In a browser environment, we simulate file saving
    // In a real application, this would be handled by the backend
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const result = event.target?.result;
          if (!result) {
            throw new Error('Failed to read file content');
          }

          // Log file information for debugging
          console.log(`Photo processing completed:`);
          console.log(`- File name: ${fileName}`);
          console.log(`- Full path: ${fullPath}`);
          console.log(`- Relative path: ${relativePath}`);
          console.log(`- File size: ${photo.size} bytes`);
          console.log(`- File type: ${photo.type}`);
          
          // In a real implementation, you would save the file here
          // For now, we'll store the file data in localStorage as a demo
          try {
            const fileData = {
              fileName,
              relativePath,
              fullPath,
              size: photo.size,
              type: photo.type,
              data: result,
              timestamp: new Date().toISOString(),
              agentId
            };
            
            // Store in localStorage (in real app, this would be actual file system)
            localStorage.setItem(`photo_${agentId}`, JSON.stringify(fileData));
            console.log(`Photo data stored for agent ${agentId}`);
            
          } catch (storageError) {
            console.warn('Could not store photo data in localStorage:', storageError);
            // Continue anyway as this is just for demo purposes
          }
          
          // Return the relative path for use in the application
          resolve(relativePath);
          
        } catch (error) {
          console.error('Error processing photo:', error);
          reject(new Error(`Failed to process photo: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      };
      
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        reject(new Error('Failed to read photo file'));
      };
      
      // Read the file as data URL
      reader.readAsDataURL(photo);
    });
    
  } catch (error) {
    console.error('Error in savePhotoToAssets:', error);
    throw new Error(`Failed to save photo: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const submitInformationPersonnel = async (formData: InformationPersonnelData): Promise<ApiResponse> => {
  try {
    // Create FormData for multipart/form-data submission (required for file upload)
    const apiFormData = new FormData();
    
    // Personal Identity Fields
    apiFormData.append('nom', formData.nom);
    apiFormData.append('post_nom', formData.post_nom);
    apiFormData.append('prenom', formData.prenom);
    
    // Personal Details Fields
    apiFormData.append('sexe', formData.sexe);
    apiFormData.append('date_naissance', formData.date_naissance);
    apiFormData.append('etat_civil', formData.etat_civil);
    
    // Contact Information Fields
    apiFormData.append('telephone', formData.telephone);
    apiFormData.append('telephone_un', formData.telephone_un);
    apiFormData.append('telephone_deux', formData.telephone_deux || '');
    apiFormData.append('mail', formData.mail);
    
    // Address Information Fields
    apiFormData.append('commune', formData.commune);
    apiFormData.append('quartier', formData.quartier);
    apiFormData.append('avenue', formData.avenue || '');
    apiFormData.append('num_parcelle', formData.num_parcelle || '');
    
    // Photo Upload (if provided)
    if (formData.photo) {
      apiFormData.append('photo', formData.photo);
    }

    // Agent Information Fields
    apiFormData.append('id_fonction', formData.id_fonction);
    apiFormData.append('id_grade', formData.id_grade);
    apiFormData.append('date_embauche', formData.date_embauche);
    apiFormData.append('domaine_etude', formData.domaine_etude);
    apiFormData.append('contrat', formData.contrat);

    apiFormData.append('id_user_created', `${id_user_created}`);
  

    // Log the form data for debugging
    console.log('Submitting Information Personnel Data:');
    for (let [key, value] of apiFormData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }

    // Make API call to create agent using the shared axios instance
    const response = await api.post(
      'agent/registerAgent', // relative to baseURL
      apiFormData,
      {
        headers: {
          // No need to set Authorization here; handled by interceptor
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        timeout: 30000 // 30 second timeout
      }
    );

    // Access response data directly (axios parses JSON automatically)
    const result = response.data;
    console.log('API Response:', result);

    // Handle successful response
    if (result.success) {
      let photoPath = null;
      
      // Save photo to assets directory if provided and validation 
      // passed
      if (formData.photo) {
        try {
          const agentId = result.data?.agent?.id || result.data?.id || 'unknown';
          photoPath = await savePhotoToAssets(formData.photo, agentId);
          console.log(`Photo successfully processed for storage at: ${photoPath}`);
        } catch (photoError) {
          console.error('Failed to save photo to assets directory:', photoError);
          // Don't fail the entire operation if photo saving fails
          // Just log the error and continue
        }
      }

      return {
        success: true,
        message: result.message || 'Agent créé avec succès',
        data: {
          agent: {
            id: result.data?.agent?.id || result.data?.id,
            nom: result.data?.agent?.nom || formData.nom,
            prenom: result.data?.agent?.prenom || formData.prenom,
            email: result.data?.agent?.mail || formData.mail,
            telephone: result.data?.agent?.telephone || formData.telephone_un,
            photoPath: photoPath // Include photo path in response
          },
          ...result.data
        }
      };
    } else {
      // Handle API errors
      throw new Error(result.message || result.error || 'Erreur lors de la création de l\'agent');
    }
  } catch (error) {
    console.error('Information Personnel API Error:', error);
    
    // Handle axios-specific errors
    if (error instanceof AxiosError) {
      // Network error
      if (!error.response) {
        return {
          success: false,
          message: 'Erreur de connexion au serveur. Vérifiez votre connexion internet.'
        };
      }
      
      // HTTP error response
      const status = error.response.status;
      const responseData = error.response.data;
      
      switch (status) {
        case 400:
          return {
            success: false,
            message: responseData?.message || 'Données invalides. Vérifiez les informations saisies.'
          };
        case 401:
          return {
            success: false,
            message: 'Session expirée. Veuillez vous reconnecter.'
          };
        case 403:
          return {
            success: false,
            message: 'Accès non autorisé.'
          };
        case 409:
          return {
            success: false,
            message: responseData?.message || 'Un agent avec ces informations existe déjà.'
          };
        case 422:
          return {
            success: false,
            message: responseData?.message || 'Erreur de validation des données.'
          };
        case 500:
          return {
            success: false,
            message: 'Erreur serveur. Veuillez réessayer plus tard.'
          };
        default:
          return {
            success: false,
            message: responseData?.message || `Erreur HTTP ${status}`
          };
      }
    }
    
    // Handle other types of errors
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message
      };
    }
    
    return {
      success: false,
      message: 'Une erreur inattendue s\'est produite. Veuillez réessayer.'
    };
  }
};

// Helper function to validate form data before submission
export const validateInformationPersonnelData = (formData: InformationPersonnelData): string[] => {
  const errors: string[] = [];
  
  // Required field validation
  const requiredFields = [
    { field: 'nom', name: 'Nom' },
    { field: 'post_nom', name: 'Post-nom' },
    { field: 'prenom', name: 'Prénom' },
    { field: 'sexe', name: 'Sexe' },
    { field: 'date_naissance', name: 'Date de naissance' },
    { field: 'etat_civil', name: 'État civil' },
    { field: 'telephone', name: 'Téléphone' },
    { field: 'mail', name: 'Email' },
    { field: 'quartier', name: 'Quartier' },
  ];
  
  requiredFields.forEach(({ field, name }) => {
    const value = formData[field as keyof InformationPersonnelData];
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      errors.push(`${name} est requis`);
    }
  });
  
  // Email format validation
  if (formData.mail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.mail)) {
    errors.push('Format d\'email invalide');
  }
  
  // Phone number validation
  if (formData.telephone_un && !/^[+]?[\d\s\-()]{9,15}$/.test(formData.telephone_un)) {
    errors.push('Format de téléphone invalide');
  }
  
  
  
  // Age validation
  if (formData.date_naissance) {
    const birthDate = new Date(formData.date_naissance);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    
    if (birthDate > today) {
      errors.push('La date de naissance ne peut pas être dans le futur');
    } else if (age < 18) {
      errors.push('L\'âge minimum requis est de 18 ans');
    } else if (age > 100) {
      errors.push('Veuillez vérifier la date de naissance');
    }
  }
  
  // Photo validation
  if (formData.photo) {
    if (formData.photo.size > 5 * 1024 * 1024) {
      errors.push('La photo ne doit pas dépasser 5MB');
    }
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(formData.photo.type)) {
      errors.push('Format de photo invalide (JPG, PNG uniquement)');
    }
  }
  
  return errors;
};

// Helper function to format form data for display
export const formatAgentData = (formData: InformationPersonnelData) => {
  return {
    identite: `${formData.prenom} ${formData.post_nom} ${formData.nom}`,
    contact: `${formData.mail} | ${formData.telephone_un}`,
    adresse: `${formData.quartier}, ${formData.commune}`,
    details: `${formData.sexe === 'M' ? 'Masculin' : 'Féminin'} | ${formData.etat_civil}`
  };
};