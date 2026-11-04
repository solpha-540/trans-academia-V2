import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
  User,
  Phone,
  X,
  Save,
  Calendar,
} from 'lucide-react';
import { getAgents, updateAgentPersonalInfo } from '../../../Api/agentService';
import { createDemande } from '../../../Api/demandeService';
import { Agent } from '../../../../types/agentType';
import { UpdateAgentPersonalInfoData } from '../../../../types/agentType';
import { getUserInfo } from '../../../../utils/auth';

interface PersonalInfoEditFormProps {
  agent: Agent;
  onCancel: () => void;
  onUpdate?: (updatedAgent: Agent) => void;
}

const PersonalInfoEditForm: React.FC<PersonalInfoEditFormProps> = ({ 
  agent, 
  onCancel, 
  onUpdate 
}) => {
  const currentUser = getUserInfo() as Partial<Agent> | null;
  const currentRoleLibelle = (currentUser as any)?.role_libelle as string | undefined;
  const isSensitiveRole = ['Chef suivi carriere', 'Chef Bureau Paie', 'Chef formation']
    .some((r) => (currentRoleLibelle || '').toLowerCase() === r.toLowerCase());

  const [formData, setFormData] = useState<UpdateAgentPersonalInfoData>({
    nom: agent.nom || '',
    post_nom: agent.postNom || '',
    prenom: agent.prenom || '',
    sexe: agent.sexe || '',
    date_naissance: agent.dateNaissance || '',
    telephone_un: agent.contacts?.[0]?.telephone_un?.toString() || '',
    contrat: agent.contrat || '',
    date_embauche: agent.dateEmbauche || '',
    domaine_etude: agent.domaineEtude || '',
    etat_civil: agent.etat_civil || '',
    mail: agent.contacts?.[0]?.mail || '',
    commune: agent.commune || '',
    quartier: agent.quartier || '',
    id_fonction: agent.id_fonction || 0,
    id_grade: agent.id_grade || 0,
    telephone_deux: agent.contacts?.[0]?.telephone_deux?.toString() || '',
    telephone_trois: agent.contacts?.[0]?.telephone_trois?.toString() || '',
    num_parcelle: agent.num_parcelle || '',
    photo: null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [motif, setMotif] = useState('');
  const [description, setDescription] = useState('');

  // Validation des champs
  const validateField = (name: string, value: string | number | File | null | undefined): string => {
    const today = new Date(); // Déclarer today ici
    
    switch (name) {
      case 'nom':
        return !value || (typeof value === 'string' && value.trim().length < 2)
          ? 'Le nom doit contenir au moins 2 caractères' : '';
      case 'post_nom':
        return !value || (typeof value === 'string' && value.trim().length < 2)
          ? 'Le post-nom doit contenir au moins 2 caractères' : '';
      case 'prenom':
        return !value || (typeof value === 'string' && value.trim().length < 2)
          ? 'Le prénom doit contenir au moins 2 caractères' : '';
      case 'sexe':
        return !value || !['M', 'F'].includes(value as string)
          ? 'Veuillez sélectionner votre sexe' : '';
      case 'date_naissance':
        if (!value) return 'La date de naissance est requise';
        const birthDate = new Date(value as string);
        const age = today.getFullYear() - birthDate.getFullYear();
        if (birthDate > today) return 'La date de naissance ne peut pas être dans le futur';
        if (age < 18) return 'Vous devez avoir au moins 18 ans';
        if (age > 100) return 'Veuillez vérifier la date de naissance';
        return '';
      case 'telephone_un':
        if (!value) return 'Le numéro de téléphone est requis';
        const phoneRegex = /^[+]?[\d\s\-()]{9,15}$/;
        return !phoneRegex.test(value as string)
          ? 'Numéro de téléphone invalide (9-15 chiffres)' : '';
      case 'contrat':
        return !value ? 'Le type de contrat est requis' : '';
      case 'date_embauche':
        if (!value) return 'La date d\'embauche est requise';
        const embaucheDate = new Date(value as string);
        if (embaucheDate > today) return 'La date d\'embauche ne peut pas être dans le futur';
        return '';
      case 'domaine_etude':
        return !value || (typeof value === 'string' && value.trim().length < 2)
          ? 'Le domaine d\'étude est requis' : '';
      default:
        return '';
    }
  };

  const handleInputChange = (field: keyof UpdateAgentPersonalInfoData, value: string | number | File | null) => {
    console.log(`🔄 Modification du champ ${field}:`, value);
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Validation en temps réel
    const error = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log('📝 Données du formulaire avant validation:', formData);

    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof UpdateAgentPersonalInfoData]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        if (isSensitiveRole) {
          if (!motif.trim() || !description.trim()) {
            toast.error('Veuillez renseigner le motif et la description de la demande');
            return;
          }

          const agents = await getAgents();
          const drh = (agents as any[]).find((a) => String((a as any)?.role_libelle || '').toLowerCase() === 'drh');
          const drhId = drh?.agentId;

          if (!drhId) {
            toast.error('Impossible de trouver le DRH (role_libelle="DRH")');
            return;
          }

          const changes: Array<{ field: string; oldValue: any; newValue: any }> = [];

          const pushChange = (field: string, oldValue: any, newValue: any) => {
            if (String(oldValue ?? '') !== String(newValue ?? '')) {
              changes.push({ field, oldValue, newValue });
            }
          };

          pushChange('nom', agent.nom, formData.nom);
          pushChange('post_nom', agent.postNom, formData.post_nom);
          pushChange('prenom', agent.prenom, formData.prenom);
          pushChange('sexe', agent.sexe, formData.sexe);
          pushChange('date_naissance', agent.dateNaissance, formData.date_naissance);
          pushChange('telephone_un', agent.contacts?.[0]?.telephone_un?.toString() || '', formData.telephone_un);
          pushChange('contrat', agent.contrat, formData.contrat);
          pushChange('date_embauche', agent.dateEmbauche, formData.date_embauche);
          pushChange('domaine_etude', agent.domaineEtude, formData.domaine_etude);
          pushChange('etat_civil', agent.etat_civil, formData.etat_civil);
          pushChange('mail', agent.contacts?.[0]?.mail || '', formData.mail);
          pushChange('commune', agent.commune, formData.commune);
          pushChange('quartier', agent.quartier, formData.quartier);
          pushChange('telephone_deux', agent.contacts?.[0]?.telephone_deux?.toString() || '', formData.telephone_deux || '');
          pushChange('telephone_trois', agent.contacts?.[0]?.telephone_trois?.toString() || '', formData.telephone_trois || '');
          pushChange('num_parcelle', agent.num_parcelle, formData.num_parcelle || '');

          const messageHtml = `
            <div>
              <p><strong>Type de modification:</strong> Informations personnelles</p>
              <p><strong>Agent concerné:</strong> ${agent.nom} ${agent.postNom} ${agent.prenom} (ID: ${agent.agentId})</p>
              <p><strong>Motif:</strong> ${motif}</p>
              <p><strong>Description:</strong> ${description}</p>
              <hr />
              <p><strong>Champs modifiés:</strong></p>
              <ul>
                ${changes
                  .map(
                    (c) =>
                      `<li><strong>${c.field}</strong>: "${String(c.oldValue ?? '')}" → "${String(c.newValue ?? '')}"</li>`
                  )
                  .join('')}
              </ul>
            </div>
          `;

          await createDemande({
            type_demande: 'Demande de modification agent',
            message: messageHtml,
            id_agent_recepteur: Number(drhId),
          });

          toast.success('Demande envoyée au DRH. La modification sera appliquée après approbation.');
          onCancel();
          return;
        }

        console.log('🚀 Début de la mise à jour des informations personnelles:', {
          agentId: agent.agentId,
          formData: formData
        });
        
        const response = await updateAgentPersonalInfo(agent.agentId, formData);
        
        console.log('✅ Réponse de l\'API:', response);
        toast.success('Informations personnelles mises à jour avec succès');
        
        // Mise à jour des données locales
        if (onUpdate) {
          const updatedAgent = {
            ...agent,
            nom: formData.nom,
            postNom: formData.post_nom,
            prenom: formData.prenom,
            sexe: formData.sexe,
            dateNaissance: formData.date_naissance,
            contrat: formData.contrat,
            dateEmbauche: formData.date_embauche,
            domaineEtude: formData.domaine_etude,
          };
          
          console.log('🔄 Mise à jour de l\'agent local:', updatedAgent);
          onUpdate(updatedAgent);
        }
        
        onCancel();
        
      } catch (error: any) {
        console.error('❌ Erreur lors de la mise à jour des informations personnelles:', error);
        
        console.log('🔍 Détails de l\'erreur:', {
          message: error.message,
          response: error.response?.data
        });
        
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.error || 
                            'Une erreur est survenue lors de la mise à jour des informations personnelles';
        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      console.log('❌ Erreurs de validation:', newErrors);
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    const requiredFields = [
      'nom', 'post_nom', 'prenom', 'sexe', 'date_naissance',
      'telephone_un', 'contrat', 'date_embauche', 'domaine_etude'
    ];

    const hasErrors = Object.values(errors).some(error => error !== '');
    if (hasErrors) {
      console.log('❌ Formulaire invalide - erreurs présentes');
      return false;
    }

    const isValid = requiredFields.every(field => {
      const value = formData[field as keyof UpdateAgentPersonalInfoData];
      if (value === undefined || value === null) return false;
      if (typeof value === 'string' && value.trim() === '') return false;
      return true;
    });

    console.log(`✅ Formulaire ${isValid ? 'valide' : 'invalide'}`);
    return isValid;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Modifier les informations personnelles</h2>
                <p className="text-gray-600 mt-1">
                  {agent.nom} {agent.postNom} {agent.prenom} - {agent.matricule}
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {isSensitiveRole && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800 font-medium">
                Votre rôle nécessite une approbation du DRH. Les modifications seront envoyées sous forme de demande.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motif <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={motif}
                    onChange={(e) => setMotif(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Correction d'une erreur"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Décrivez la modification demandée"
                  />
                </div>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            {/* Personal Identity Section */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-800">Identité Personnelle</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => handleInputChange('nom', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.nom ? 'border-red-300 focus:ring-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Votre nom de famille"
                    required
                  />
                  {errors.nom && <p className="mt-1 text-sm text-red-600">{errors.nom}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Post-nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.post_nom}
                    onChange={(e) => handleInputChange('post_nom', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.post_nom ? 'border-red-300 focus:ring-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Votre post-nom"
                    required
                  />
                  {errors.post_nom && <p className="mt-1 text-sm text-red-600">{errors.post_nom}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.prenom}
                    onChange={(e) => handleInputChange('prenom', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.prenom ? 'border-red-300 focus:ring-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Votre prénom"
                    required
                  />
                  {errors.prenom && <p className="mt-1 text-sm text-red-600">{errors.prenom}</p>}
                </div>
              </div>
            </div>

            {/* Personal Details Section */}
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-green-800">Détails Personnels</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sexe <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.sexe}
                    onChange={(e) => handleInputChange('sexe', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.sexe ? 'border-red-300 focus:ring-red-500' : 'border-gray-200'
                    }`}
                    required
                  >
                    <option value="">Sélectionner</option>
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                  {errors.sexe && <p className="mt-1 text-sm text-red-600">{errors.sexe}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de naissance <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date_naissance}
                    onChange={(e) => handleInputChange('date_naissance', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.date_naissance ? 'border-red-300 focus:ring-red-500' : 'border-gray-200'
                    }`}
                    required
                  />
                  {errors.date_naissance && <p className="mt-1 text-sm text-red-600">{errors.date_naissance}</p>}
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <div className="flex items-center gap-3 mb-6">
                <Phone className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-purple-800">Informations de Contact</h3>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Téléphone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.telephone_un}
                    onChange={(e) => handleInputChange('telephone_un', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.telephone_un ? 'border-red-300 focus:ring-red-500' : 'border-gray-200'
                    }`}
                    placeholder="89X XXX XXX"
                    required
                  />
                  {errors.telephone_un && <p className="mt-1 text-sm text-red-600">{errors.telephone_un}</p>}
                </div>
              </div>  
            </div>

            {/* Professional Information */}
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-orange-600" />
                <h3 className="text-lg font-semibold text-orange-800">Informations Professionnelles</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contrat <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.contrat}
                    onChange={(e) => handleInputChange('contrat', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.contrat ? 'border-red-300 focus:ring-red-500' : 'border-gray-200'
                    }`}
                    required
                  >
                    <option value="">Sélectionner un type de contrat</option>
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                  </select>
                  {errors.contrat && <p className="mt-1 text-sm text-red-600">{errors.contrat}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date d'embauche <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date_embauche}
                    onChange={(e) => handleInputChange('date_embauche', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.date_embauche ? 'border-red-300 focus:ring-red-500' : 'border-gray-200'
                    }`}
                    required
                  />
                  {errors.date_embauche && <p className="mt-1 text-sm text-red-600">{errors.date_embauche}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Domaine d'étude <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.domaine_etude}
                    onChange={(e) => handleInputChange('domaine_etude', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.domaine_etude ? 'border-red-300 focus:ring-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Ex: Informatique, Gestion, etc."
                    required
                  />
                  {errors.domaine_etude && <p className="mt-1 text-sm text-red-600">{errors.domaine_etude}</p>}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 border border-gray-300"
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={!isFormValid() || isSubmitting}
                className={`px-6 py-3 font-medium rounded-lg focus:ring-2 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2 ${
                  isFormValid() && !isSubmitting
                    ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 cursor-pointer' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Enregistrer les modifications
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoEditForm;