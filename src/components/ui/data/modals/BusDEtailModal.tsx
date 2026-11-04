import React, { useEffect, useState } from 'react';
import { useBusLocationContext } from '../../../../contexts/busLocationContext';

interface BusDetailModalProps {
  busId: number | null;
  onClose: () => void;
}

export const BusDetailModal: React.FC<BusDetailModalProps> = ({ 
  busId, 
  onClose
}) => {
  const { getBusLocationById, updateBusStatus, refreshBusLocations } = useBusLocationContext();
  const [bus, setBus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [showRetourForm, setShowRetourForm] = useState(false);
  const [busDisponibleCount, setBusDisponibleCount] = useState<number>(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Calcul du nombre de bus loués
  const calculateBusesRented = () => {
    if (!bus) return 0;
    const total = bus.nombre_bus || 0;
    const remaining = bus.bus_reste || 0;
    return total - remaining;
  };

  // Pourcentage de bus loués
  const calculateRentedPercentage = () => {
    if (!bus || !bus.nombre_bus) return 0;
    const rented = calculateBusesRented();
    return Math.round((rented / bus.nombre_bus) * 100);
  };

  // Pourcentage de bus non exploités
  const calculateAvailablePercentage = () => {
    if (!bus || !bus.nombre_bus) return 0;
    const available = bus.bus_reste || 0;
    return Math.round((available / bus.nombre_bus) * 100);
  };

  // Fonction pour gérer l'affichage du formulaire
  const handleShowDisponibiliteForm = () => {
    if (!bus) return;
    
    // Initialiser avec la valeur actuelle de bus_reste
    setBusDisponibleCount(bus.bus_reste || 0);
    setShowRetourForm(true);
  };

  // Fonction pour annuler
  const handleCancelDisponibilite = () => {
    setShowRetourForm(false);
    setBusDisponibleCount(0);
  };

  // Fonction pour afficher un message de succès temporaire
  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  // Fonction pour gérer la mise à jour de la disponibilité
  const handleUpdateBusDisponibilite = async () => {
    if (!bus) return;

    try {
      setUpdating(true);

      // Validation du nombre saisi
      if (busDisponibleCount < 0) {
        alert('Veuillez saisir un nombre positif de bus disponibles');
        return;
      }

      // Vérifier si on ne dépasse pas le nombre total de bus
      if (busDisponibleCount > bus.nombre_bus) {
        alert(`Vous ne pouvez pas avoir plus de ${bus.nombre_bus} bus disponibles (nombre total de bus)`);
        return;
      }

      // Calculer le nouveau statut basé sur bus_reste
      const newStatus = busDisponibleCount > 0 ? 'disponible' : 'indisponible';

      // Mettre à jour directement avec la valeur entrée
      await updateBusStatus(bus.id, newStatus, busDisponibleCount);
      
      // Rafraîchir les données
      await refreshBusLocations();
      
      // Recharger les détails du bus
      const updatedBus = await getBusLocationById(bus.id);
      let busObject = updatedBus;
      if (Array.isArray(updatedBus) && updatedBus.length > 0) {
        busObject = updatedBus[0];
      }
      setBus(busObject);

      // Message de confirmation
      const message = `Disponibilité mise à jour avec succès !\nBus disponibles: ${busDisponibleCount}`;
      showSuccessMessage(message);

      // Fermer le formulaire
      setShowRetourForm(false);
      setBusDisponibleCount(0);

    } catch (error: any) {
      console.error('Erreur lors de la mise à jour de la disponibilité:', error);
      alert(`Erreur: ${error.message || 'Impossible de mettre à jour la disponibilité'}`);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (busId) {
      const fetchBus = async () => {
        setLoading(true);
        setError(null);
        try {
          const busData = await getBusLocationById(busId);
          
          let busObject = busData;
          if (Array.isArray(busData) && busData.length > 0) {
            busObject = busData[0];
          }
          
          setBus(busObject);
        } catch (error) {
          console.error('Erreur lors du chargement des détails du bus', error);
          setError('Erreur lors du chargement des détails du bus');
        } finally {
          setLoading(false);
        }
      };
      fetchBus();
    } else {
      setBus(null);
    }
  }, [busId, getBusLocationById]);

  if (!busId) {
    return null;
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <p>Chargement des détails du bus...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  if (!bus) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <p>Aucune donnée disponible pour ce bus</p>
          <button 
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  const busesRented = calculateBusesRented();
  const rentedPercentage = calculateRentedPercentage();
  const availablePercentage = calculateAvailablePercentage();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Message de succès */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <i className="ri-checkbox-circle-fill text-green-500 text-xl"></i>
              </div>
              <div className="ml-3">
                <p className="text-green-800 font-medium">Succès !</p>
                <p className="text-green-700 text-sm mt-1 whitespace-pre-line">{successMessage}</p>
              </div>
              <button
                onClick={() => setSuccessMessage(null)}
                className="ml-auto text-green-500 hover:text-green-700"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Détails du bus #{bus.id}</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Informations générales du bus */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-500">Type de bus</p>
              <p className="font-medium text-lg">{bus.type_bus || 'Non spécifié'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Catégorie</p>
              <p className="font-medium">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  bus.categorie === 'premium' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {bus.categorie || 'Standard'}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Nombre total de bus</p>
              <p className="font-medium">{bus.nombre_bus || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Bus non exploités</p>
              <p className="font-medium">{bus.bus_reste || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Bus déjà loués</p>
              <div className="flex items-center space-x-2">
                <p className="font-medium text-orange-600">{busesRented}</p>
                <span className="text-xs text-gray-500">
                  ({rentedPercentage}%)
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Capacité</p>
              <p className="font-medium">{bus.capacite || 0} places</p>
            </div>
            
            {/* Barre de progression unique avec deux segments */}
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500 mb-2">Répartition des bus</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 relative">
                {/* Segment vert pour les bus non exploités */}
                <div 
                  className="bg-green-500 h-2.5 rounded-l-full absolute left-0"
                  style={{ width: `${availablePercentage}%` }}
                ></div>
                {/* Segment orange pour les bus loués */}
                <div 
                  className="bg-orange-500 h-2.5 rounded-r-full absolute left-0"
                  style={{ 
                    width: `${rentedPercentage}%`,
                    left: `${availablePercentage}%`
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-sm mr-1"></div>
                  <span>{availablePercentage}% non exploités</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-orange-500 rounded-sm mr-1"></div>
                  <span>{rentedPercentage}% loués</span>
                </div>
              </div>
            </div>
          </div>

          {/* Résumé de la flotte */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="font-semibold text-blue-800 mb-3">Vue d'ensemble des bus</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="text-2xl font-bold text-blue-600">{bus.nombre_bus || 0}</p>
                <p className="text-xs text-gray-600">Total</p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="text-2xl font-bold text-green-600">{bus.bus_reste || 0}</p>
                <p className="text-xs text-gray-600">Non exploités</p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="text-2xl font-bold text-orange-600">{busesRented}</p>
                <p className="text-xs text-gray-600">Loués</p>
              </div>
            </div>
          </div>

          {/* Section Gestion disponibilité bus */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <h4 className="font-semibold text-green-800 mb-3">Gestion disponibilité bus</h4>
            
            {!showRetourForm ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    Modifier le nombre de bus disponibles pour ce type
                  </p>
                </div>
                <button
                  onClick={handleShowDisponibiliteForm}
                  className="px-4 py-2 rounded-md font-medium bg-green-500 text-white hover:bg-green-600 transition-colors flex items-center space-x-2"
                >
                  <i className="ri-edit-line"></i>
                  <span>Modifier la disponibilité</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de bus disponible
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="number"
                        min="0"
                        max={bus.nombre_bus}
                        value={busDisponibleCount}
                        onChange={(e) => setBusDisponibleCount(parseInt(e.target.value) || 0)}
                        className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <span className="text-sm text-gray-500">
                        sur {bus.nombre_bus} maximum
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Entrez le nombre total de bus disponibles
                    </p>
                  </div>

                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleCancelDisponibilite}
                    disabled={updating}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleUpdateBusDisponibilite}
                    disabled={updating || busDisponibleCount < 0 || busDisponibleCount > bus.nombre_bus}
                    className={`px-4 py-2 rounded-md font-medium ${
                      (updating || busDisponibleCount < 0 || busDisponibleCount > bus.nombre_bus)
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    } transition-colors flex items-center space-x-2`}
                  >
                    {updating ? (
                      <>
                        <i className="ri-loader-4-line animate-spin"></i>
                        <span>Traitement...</span>
                      </>
                    ) : (
                      <>
                        <i className="ri-check-line"></i>
                        <span>Confirmer la disponibilité</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};