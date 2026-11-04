import React, { useState, useEffect } from 'react';
import { filePublicUrl } from '@/config/env';
import { X, Users, Briefcase, CheckCircle, Building2, Award, Loader2 } from 'lucide-react';
import { Agent } from '../../../types/agentType';
import { Service } from '../../../types/serviceType';
import { Grade } from '../../../types/gradeType';
import { FonctionItem } from '../../../types/affectationType';

interface AffectationModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent | null;
  services: Service[];
  grades: Grade[];
  fonctions: FonctionItem[];
  loadingFonctions: boolean;
  onServiceChange: (serviceId: number) => void;
  onConfirm: (agentId: number, serviceId: number, fonctionId: number, gradeId: number) => Promise<void>;
  isLoading: boolean;
  mode: 'affecter' | 'reaffecter';
}

export const AffectationModal: React.FC<AffectationModalProps> = ({
  isOpen,
  onClose,
  agent,
  services,
  grades,
  fonctions,
  loadingFonctions,
  onServiceChange,
  onConfirm,
  isLoading,
  mode
}) => {
  // Service state
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedServiceLabel, setSelectedServiceLabel] = useState('');
  
  // Fonction state
  const [selectedFonctionId, setSelectedFonctionId] = useState<number | null>(null);
  const [fonctionSearchTerm, setFonctionSearchTerm] = useState('');
  const [showFonctionDropdown, setShowFonctionDropdown] = useState(false);
  const [selectedFonctionLabel, setSelectedFonctionLabel] = useState('');
  
  // Grade state
  const [selectedGradeId, setSelectedGradeId] = useState<number | null>(null);
  const [gradeSearchTerm, setGradeSearchTerm] = useState('');
  const [showGradeDropdown, setShowGradeDropdown] = useState(false);
  const [selectedGradeLabel, setSelectedGradeLabel] = useState('');

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedServiceId(null);
      setSearchTerm('');
      setSelectedServiceLabel('');
      setShowDropdown(false);
      // Reset fonction
      setSelectedFonctionId(null);
      setFonctionSearchTerm('');
      setSelectedFonctionLabel('');
      setShowFonctionDropdown(false);
      // Reset grade
      setSelectedGradeId(null);
      setGradeSearchTerm('');
      setSelectedGradeLabel('');
      setShowGradeDropdown(false);
    }
  }, [isOpen]);

  // Reset fonction when service changes
  useEffect(() => {
    setSelectedFonctionId(null);
    setFonctionSearchTerm('');
    setSelectedFonctionLabel('');
    setShowFonctionDropdown(false);
  }, [selectedServiceId]);

  if (!isOpen || !agent) return null;

  const filteredServices = services.filter((service) =>
    service.libelle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFonctions = fonctions.filter((fonction) =>
    fonction.libelle.toLowerCase().includes(fonctionSearchTerm.toLowerCase())
  );

  const filteredGrades = grades.filter((grade) =>
    grade.libelle.toLowerCase().includes(gradeSearchTerm.toLowerCase())
  );

  const handleServiceSelect = (service: Service) => {
    setSelectedServiceId(service.id);
    setSelectedServiceLabel(service.libelle);
    setSearchTerm(service.libelle);
    setShowDropdown(false);
    // Trigger fonction loading
    onServiceChange(service.id);
  };

  const handleFonctionSelect = (fonction: FonctionItem) => {
    setSelectedFonctionId(fonction.id);
    setSelectedFonctionLabel(fonction.libelle);
    setFonctionSearchTerm(fonction.libelle);
    setShowFonctionDropdown(false);
  };

  const handleGradeSelect = (grade: Grade) => {
    setSelectedGradeId(grade.id);
    setSelectedGradeLabel(grade.libelle);
    setGradeSearchTerm(grade.libelle);
    setShowGradeDropdown(false);
  };

  const handleConfirm = async () => {
    if (selectedServiceId && selectedFonctionId && selectedGradeId && agent.agentId) {
      await onConfirm(agent.agentId, selectedServiceId, selectedFonctionId, selectedGradeId);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const isFormValid = selectedServiceId && selectedFonctionId && selectedGradeId;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header avec gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {mode === 'affecter' ? 'Affecter un Agent' : 'Réaffecter un Agent'}
                </h2>
                <p className="text-blue-100 text-sm">
                  {mode === 'affecter' 
                    ? 'Assigner l\'agent à un nouveau service' 
                    : 'Changer le service de l\'agent'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Section Agent sélectionné */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-semibold text-gray-800">Agent sélectionné</h3>
            </div>
            
            {/* Agent Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
              <div className="flex items-start gap-4">
                {/* Photo */}
                <div className="flex-shrink-0">
                  {agent.photo ? (
                    <img
                      src={filePublicUrl(agent.photo)}
                      alt={`${agent.nom} ${agent.prenom}`}
                      className="w-20 h-20 rounded-xl object-cover border-2 border-white shadow-md"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                      {agent.nom?.charAt(0)}{agent.prenom?.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Info Agent */}
                <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-3">
                  <div>
                    <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Nom complet</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {agent.nom} {agent.postNom} {agent.prenom}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Matricule</p>
                    <p className="text-sm font-semibold text-gray-800 font-mono">
                      {agent.matricule || agent.id_generate || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Fonction</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {agent.fonctionLibelle || 'Non définie'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Grade</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {agent.gradeLibelle || 'Non défini'}
                    </p>
                  </div>
                  {agent.serviceLibelle && (
                    <div className="col-span-2">
                      <p className="text-xs font-medium text-orange-600 uppercase tracking-wide">Service actuel</p>
                      <p className="text-sm font-semibold text-orange-700">
                        {agent.serviceLibelle}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section Sélection du service */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-semibold text-gray-800">
                {mode === 'affecter' ? 'Service d\'affectation' : 'Nouveau service'}
                <span className="text-red-500 ml-1">*</span>
              </h3>
            </div>

            {/* Select Service avec recherche */}
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher et sélectionner un service..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                  if (e.target.value !== selectedServiceLabel) {
                    setSelectedServiceId(null);
                  }
                }}
                onFocus={() => setShowDropdown(true)}
                className={`w-full px-4 py-3.5 border-2 rounded-xl text-sm transition-all duration-200 focus:outline-none ${
                  selectedServiceId 
                    ? 'border-green-400 bg-green-50 focus:border-green-500' 
                    : 'border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                }`}
                style={{
                  backgroundImage: selectedServiceId 
                    ? 'none'
                    : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  backgroundSize: '20px',
                  paddingRight: '40px'
                }}
              />
              
              {selectedServiceId && (
                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
              )}

              {/* Dropdown des services */}
              {showDropdown && searchTerm && filteredServices.length > 0 && (
                <div className="absolute z-30 mt-2 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-xl">
                  {filteredServices.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => handleServiceSelect(service)}
                      className={`w-full px-4 py-3 text-left text-sm hover:bg-blue-50 transition-colors flex items-center justify-between ${
                        selectedServiceId === service.id ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      <span className="font-medium">{service.libelle}</span>
                      {selectedServiceId === service.id && (
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {showDropdown && searchTerm && filteredServices.length === 0 && (
                <div className="absolute z-30 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl p-4 text-center text-gray-500 text-sm">
                  Aucun service trouvé pour "{searchTerm}"
                </div>
              )}
            </div>

          </div>

          {/* Section Sélection de la fonction (dépend du service) */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-purple-600" />
              <h3 className="text-base font-semibold text-gray-800">
                Fonction
                <span className="text-red-500 ml-1">*</span>
              </h3>
              {loadingFonctions && (
                <Loader2 className="w-4 h-4 text-purple-500 animate-spin" />
              )}
            </div>

            {/* Select Fonction avec recherche */}
            <div className="relative">
              <input
                type="text"
                placeholder={
                  !selectedServiceId 
                    ? "Sélectionnez d'abord un service..." 
                    : loadingFonctions 
                      ? "Chargement des fonctions..." 
                      : "Rechercher et sélectionner une fonction..."
                }
                value={fonctionSearchTerm}
                onChange={(e) => {
                  setFonctionSearchTerm(e.target.value);
                  setShowFonctionDropdown(true);
                  if (e.target.value !== selectedFonctionLabel) {
                    setSelectedFonctionId(null);
                  }
                }}
                onFocus={() => setShowFonctionDropdown(true)}
                disabled={!selectedServiceId || loadingFonctions}
                className={`w-full px-4 py-3.5 border-2 rounded-xl text-sm transition-all duration-200 focus:outline-none ${
                  !selectedServiceId || loadingFonctions
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                    : selectedFonctionId 
                      ? 'border-green-400 bg-green-50 focus:border-green-500' 
                      : 'border-gray-200 hover:border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10'
                }`}
                style={{
                  backgroundImage: selectedFonctionId || !selectedServiceId || loadingFonctions
                    ? 'none'
                    : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  backgroundSize: '20px',
                  paddingRight: '40px'
                }}
              />
              
              {selectedFonctionId && (
                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
              )}

              {/* Dropdown des fonctions */}
              {showFonctionDropdown && fonctionSearchTerm && filteredFonctions.length > 0 && (
                <div className="absolute z-30 mt-2 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-xl">
                  {filteredFonctions.map((fonction) => (
                    <button
                      key={fonction.id}
                      type="button"
                      onClick={() => handleFonctionSelect(fonction)}
                      className={`w-full px-4 py-3 text-left text-sm hover:bg-purple-50 transition-colors flex items-center justify-between ${
                        selectedFonctionId === fonction.id ? 'bg-purple-100 text-purple-700' : 'text-gray-700'
                      }`}
                    >
                      <span className="font-medium">{fonction.libelle}</span>
                      {selectedFonctionId === fonction.id && (
                        <CheckCircle className="w-4 h-4 text-purple-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {showFonctionDropdown && fonctionSearchTerm && filteredFonctions.length === 0 && selectedServiceId && !loadingFonctions && (
                <div className="absolute z-30 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl p-4 text-center text-gray-500 text-sm">
                  Aucune fonction trouvée pour "{fonctionSearchTerm}"
                </div>
              )}

              {/* Show all fonctions when input is focused but empty */}
              {showFonctionDropdown && !fonctionSearchTerm && fonctions.length > 0 && (
                <div className="absolute z-30 mt-2 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-xl">
                  {fonctions.map((fonction) => (
                    <button
                      key={fonction.id}
                      type="button"
                      onClick={() => handleFonctionSelect(fonction)}
                      className={`w-full px-4 py-3 text-left text-sm hover:bg-purple-50 transition-colors flex items-center justify-between ${
                        selectedFonctionId === fonction.id ? 'bg-purple-100 text-purple-700' : 'text-gray-700'
                      }`}
                    >
                      <span className="font-medium">{fonction.libelle}</span>
                      {selectedFonctionId === fonction.id && (
                        <CheckCircle className="w-4 h-4 text-purple-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Message si aucune fonction disponible */}
            {selectedServiceId && !loadingFonctions && fonctions.length === 0 && (
              <p className="mt-2 text-sm text-amber-600">
                Aucune fonction disponible pour ce service.
              </p>
            )}
          </div>

          {/* Section Sélection du grade */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-semibold text-gray-800">
                Grade
                <span className="text-red-500 ml-1">*</span>
              </h3>
            </div>

            {/* Select Grade avec recherche */}
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher et sélectionner un grade..."
                value={gradeSearchTerm}
                onChange={(e) => {
                  setGradeSearchTerm(e.target.value);
                  setShowGradeDropdown(true);
                  if (e.target.value !== selectedGradeLabel) {
                    setSelectedGradeId(null);
                  }
                }}
                onFocus={() => setShowGradeDropdown(true)}
                className={`w-full px-4 py-3.5 border-2 rounded-xl text-sm transition-all duration-200 focus:outline-none ${
                  selectedGradeId 
                    ? 'border-green-400 bg-green-50 focus:border-green-500' 
                    : 'border-gray-200 hover:border-amber-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10'
                }`}
                style={{
                  backgroundImage: selectedGradeId 
                    ? 'none'
                    : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  backgroundSize: '20px',
                  paddingRight: '40px'
                }}
              />
              
              {selectedGradeId && (
                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
              )}

              {/* Dropdown des grades */}
              {showGradeDropdown && gradeSearchTerm && filteredGrades.length > 0 && (
                <div className="absolute z-30 mt-2 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-xl">
                  {filteredGrades.map((grade) => (
                    <button
                      key={grade.id}
                      type="button"
                      onClick={() => handleGradeSelect(grade)}
                      className={`w-full px-4 py-3 text-left text-sm hover:bg-amber-50 transition-colors flex items-center justify-between ${
                        selectedGradeId === grade.id ? 'bg-amber-100 text-amber-700' : 'text-gray-700'
                      }`}
                    >
                      <span className="font-medium">{grade.libelle}</span>
                      {selectedGradeId === grade.id && (
                        <CheckCircle className="w-4 h-4 text-amber-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {showGradeDropdown && gradeSearchTerm && filteredGrades.length === 0 && (
                <div className="absolute z-30 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl p-4 text-center text-gray-500 text-sm">
                  Aucun grade trouvé pour "{gradeSearchTerm}"
                </div>
              )}

              {/* Show all grades when input is focused but empty */}
              {showGradeDropdown && !gradeSearchTerm && grades.length > 0 && (
                <div className="absolute z-30 mt-2 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-xl">
                  {grades.map((grade) => (
                    <button
                      key={grade.id}
                      type="button"
                      onClick={() => handleGradeSelect(grade)}
                      className={`w-full px-4 py-3 text-left text-sm hover:bg-amber-50 transition-colors flex items-center justify-between ${
                        selectedGradeId === grade.id ? 'bg-amber-100 text-amber-700' : 'text-gray-700'
                      }`}
                    >
                      <span className="font-medium">{grade.libelle}</span>
                      {selectedGradeId === grade.id && (
                        <CheckCircle className="w-4 h-4 text-amber-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Résumé de la sélection */}
          {isFormValid && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-green-800 mb-3">Résumé de l'affectation</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs font-medium text-green-600 uppercase tracking-wide">Service</p>
                  <p className="text-sm font-semibold text-green-800 mt-1">{selectedServiceLabel}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-green-600 uppercase tracking-wide">Fonction</p>
                  <p className="text-sm font-semibold text-green-800 mt-1">{selectedFonctionLabel}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-green-600 uppercase tracking-wide">Grade</p>
                  <p className="text-sm font-semibold text-green-800 mt-1">{selectedGradeLabel}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer avec boutons */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isFormValid || isLoading}
            className={`px-6 py-2.5 text-sm font-medium rounded-xl flex items-center gap-2 transition-all duration-200 ${
              isFormValid && !isLoading
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Traitement...
              </>
            ) : (
              <>
                <Building2 className="w-4 h-4" />
                {mode === 'affecter' ? 'Confirmer l\'affectation' : 'Confirmer la réaffectation'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AffectationModal;
