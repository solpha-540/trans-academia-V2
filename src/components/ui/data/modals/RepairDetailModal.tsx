// src/components/ui/modals/RepairDetailModal.tsx
import React, { useEffect, useState } from 'react';
import { useBusContext } from '../../../../contexts/busContext';
import { filePublicUrl, filePublicUrlJoin, filePublicRootUrl } from '@/config/env';

interface RepairDetailModalProps {
  busId: number | null;
  onClose: () => void;
  onValidated: () => void;
}

export const RepairDetailModal: React.FC<RepairDetailModalProps> = ({ 
  busId, 
  onClose,
  onValidated 
}) => {
  const { getBusForOperation, updateBusStatus } = useBusContext();
  const [bus, setBus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Sécurité');
  const [activePhotoIndex, setActivePhotoIndex] = useState<{[key: string]: number}>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (busId) {
      const fetchBus = async () => {
        setLoading(true);
        try {
          const busData = await getBusForOperation(busId);
          setBus(busData);
          
          // Initialiser l'index des photos pour chaque catégorie
          if (busData?.signalement?.details) {
            const initialPhotoIndex: {[key: string]: number} = {};
            busData.signalement.details.forEach((detail: any) => {
              initialPhotoIndex[detail.categorie] = 0;
            });
            setActivePhotoIndex(initialPhotoIndex);
          }
        } catch (error) {
          console.error('Erreur lors du chargement des détails du bus', error);
        } finally {
          setLoading(false);
        }
      };
      fetchBus();
    }
  }, [busId]);

  const handleValidate = async () => {
    if (!busId) return;
    
    try {
      setLoading(true);
      
      // Utiliser 'VALIDE' au lieu de 'VALIDATED' pour correspondre à l'API
      await updateBusStatus(busId, 'VALIDE');
      
      // Mettre à jour localement les données
      setBus((prev: any) => prev ? {
        ...prev,
        disponibilite: 1, // Marquer comme disponible
        status: 'VALIDE',
        signalement: prev.signalement ? {
          ...prev.signalement,
          status_bus: 'VALIDE'
        } : undefined
      } : prev);

      // Afficher le message de succès
      setSuccessMessage('Le bus a été validé et marqué comme disponible.');

      // Laisser le temps à l'utilisateur de lire le message puis fermer le modal
      setTimeout(() => {
        onValidated();
      }, 1500);
    } catch (error) {
      console.error('Erreur lors de la validation', error);
      // Afficher un message d'erreur à l'utilisateur si nécessaire
    } finally {
      setLoading(false);
    }
  };

  const handleNextPhoto = (category: string) => {
    const categoryPhotos = bus?.signalement?.details.find((d: any) => d.categorie === category)?.photos;
    if (!categoryPhotos) return;
    
    const photoCount = Object.keys(categoryPhotos).length;
    setActivePhotoIndex(prev => ({
      ...prev,
      [category]: (prev[category] + 1) % photoCount
    }));
  };

  const handlePrevPhoto = (category: string) => {
    const categoryPhotos = bus?.signalement?.details.find((d: any) => d.categorie === category)?.photos;
    if (!categoryPhotos) return;
    
    const photoCount = Object.keys(categoryPhotos).length;
    setActivePhotoIndex(prev => ({
      ...prev,
      [category]: (prev[category] - 1 + photoCount) % photoCount
    }));
  };

  const getCurrentPhoto = (category: string) => {
    const categoryDetails = bus?.signalement?.details.find((d: any) => d.categorie === category);
    if (!categoryDetails || !categoryDetails.photos) return null;
    
    const photoKeys = Object.keys(categoryDetails.photos);
    const currentIndex = activePhotoIndex[category] || 0;
    
    if (photoKeys.length === 0) return null;
    
    return categoryDetails.photos[photoKeys[currentIndex]];
  };

  if (!busId) {
    return null;
  }

  if (loading && !bus) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Détails du signalement</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        {bus && (
          <div className="space-y-6">
            {/* Informations générales du bus */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Numéro de bus</p>
                <p className="font-medium text-lg">{bus.signalement?.numero_bus || bus.num_bus}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Marque</p>
                <p className="font-medium">{bus.signalement?.marque_bus || bus.marque}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Modèle</p>
                <p className="font-medium">{bus.signalement?.modele_bus || bus.modele}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Carburant</p>
                <p className="font-medium">{bus.signalement?.carburant || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Heure service</p>
                <p className="font-medium">{bus.signalement?.heure_service || 'N/A'}</p>
              </div>
            </div>

            {/* Afficher les informations de l'agent seulement si le signalement existe */}
            {bus.signalement?.agent && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-2">Agent</p>
                <div className="flex items-center">
                  <img 
                    src={filePublicUrl(bus.signalement.agent.photo)} 
                    alt={bus.signalement.agent.nom}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48';
                    }}
                  />
                  <div>
                    <p className="font-medium">
                      {bus.signalement.agent.prenom} {bus.signalement.agent.nom}
                    </p>
                    <p className="text-sm text-gray-500">{bus.signalement.agent.role}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation par catégories - seulement si des détails existent */}
            {bus.signalement?.details && bus.signalement.details.length > 0 && (
              <>
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8 overflow-x-auto">
                    {bus.signalement.details.map((detail: any) => (
                      <button
                        key={detail.categorie}
                        onClick={() => setActiveCategory(detail.categorie)}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                          activeCategory === detail.categorie
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {detail.categorie}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Détails de la catégorie active */}
                {bus.signalement.details
                  .filter((detail: any) => detail.categorie === activeCategory)
                  .map((detail: any) => (
                    <div key={detail.categorie} className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{detail.categorie}</h4>
                          <div className="flex items-center mt-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              detail.cotation === 'Mauvais' 
                                ? 'bg-red-100 text-red-800'
                                : detail.cotation === 'Bon'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {detail.cotation}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700">{detail.commentaire}</p>

                      {/* Galerie de photos */}
                      {detail.photos && Object.keys(detail.photos).length > 0 && (
                        <div className="relative">
                          <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4 h-64">
                            <img 
                              src={filePublicUrlJoin(getCurrentPhoto(detail.categorie))} 
                              alt={`${detail.categorie} - Photo ${activePhotoIndex[detail.categorie] + 1}`}
                              className="max-h-56 max-w-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+non+disponible';
                              }}
                            />
                          </div>
                          
                          {Object.keys(detail.photos).length > 1 && (
                            <>
                              <button
                                onClick={() => handlePrevPhoto(detail.categorie)}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                              >
                                ‹
                              </button>
                              <button
                                onClick={() => handleNextPhoto(detail.categorie)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                              >
                                ›
                              </button>
                              <div className="text-center mt-2 text-sm text-gray-500">
                                Photo {activePhotoIndex[detail.categorie] + 1} sur {Object.keys(detail.photos).length}
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
              </>
            )}

            {/* Résultat mécanique */}
            {bus.resultat_mecanique && bus.resultat_mecanique.length > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Résultat mécanique</h4>
                {bus.resultat_mecanique.map((res: any, i: number) => (
                  <div key={i} className="mb-4 last:mb-0">
                    <div className="flex items-center mb-3">
                      <img 
                        src={filePublicRootUrl(res.photo)} 
                        alt={`Mécanicien ${res.prenom} ${res.nom}`}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40';
                        }}
                      />
                      <div>
                        <p className="font-medium">{res.prenom} {res.nom}</p>
                        <p className="text-sm text-gray-500">{new Date(res.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700">{res.commentaire}</p>
                    
                    
                    {/* Photos du résultat mécanique */}
                    {res.photos && Object.keys(res.photos).length > 0 && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {Object.entries(res.photos).map(([key, photoPath]) => (
                          <div key={key} className="bg-gray-100 rounded-lg p-2 h-32 flex items-center justify-center">
                            <img 
                              src={filePublicUrlJoin(String(photoPath))} 
                              alt={`Résultat mécanique ${key}`}
                              className="max-h-28 max-w-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150x100?text=Image+non+disponible';
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Message de succès */}
            {successMessage && (
              <div className="p-4 bg-green-50 text-green-800 rounded-md border border-green-200">
                {successMessage}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Fermer
              </button>
              
              {/* Afficher le bouton "Valider la réparation" seulement pour les bus PENDING */}
              {(bus.signalement?.status_bus === 'PENDING' || bus.status === 'PENDING') && (
                <button
                  onClick={handleValidate}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Validation...' : 'Valider la réparation'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};