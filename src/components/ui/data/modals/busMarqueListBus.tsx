// components/ui/data/modals/busMarqueListBus.tsx

import { FC } from 'react';
import { X, Bus, CheckCircle, XCircle, Wrench, Info } from 'lucide-react';

interface BusItem {
  id: number;
  id_carte: string;
  num_bus: string;
  plaque: string;
  marque: string;
  modele: string;
  disponibilite: number;
  status: string;
  is_repart: number;
  capacite: number | null;
  categorie: string | null;
  created_at: string;
  last_update: string;
  id_user_created: string;
}

interface BusListModalProps {
  show: boolean;
  onHide: () => void;
  title: string;
  buses: BusItem[];
  marque: string;
}

// Configuration des couleurs pour les marques
const marqueColors: { [key: string]: { color: string; bgColor: string; borderColor: string } } = {
  'ANKAI': { color: 'text-purple-600', bgColor: 'bg-purple-100', borderColor: 'border-purple-200' },
  'VOLVO': { color: 'text-orange-600', bgColor: 'bg-orange-100', borderColor: 'border-orange-200' },
  'MERCEDES': { color: 'text-blue-600', bgColor: 'bg-blue-100', borderColor: 'border-blue-200' },
  'NISSAN': { color: 'text-green-600', bgColor: 'bg-green-100', borderColor: 'border-green-200' },
};

// Configuration des couleurs pour la disponibilité
const disponibiliteConfig = {
  0: { label: 'Indisponible', color: 'text-red-600', bgColor: 'bg-red-100', icon: XCircle },
  1: { label: 'Disponible', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle },
  2: { label: 'En Maintenance', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: Wrench },
};

export const BusListModal: FC<BusListModalProps> = ({ 
  show, 
  onHide, 
  title, 
  buses, 
  marque 
}) => {
  if (!show) return null;

  // S'assurer que buses est un tableau
  const busesArray = Array.isArray(buses) ? buses : [];
  
  // Compter les statistiques des bus
  const stats = {
    total: busesArray.length,
    disponible: busesArray.filter(b => b.disponibilite === 1).length,
    indisponible: busesArray.filter(b => b.disponibilite === 0).length,
    enMaintenance: busesArray.filter(b => b.disponibilite === 2).length,
  };

  // Obtenir les couleurs pour la marque
  const marqueStyle = marqueColors[marque.toUpperCase()] || { 
    color: 'text-gray-600', 
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-200'
  };

  // Formater la date
  // const formatDate = (dateString: string) => {
  //   if (!dateString) return 'N/A';
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString('fr-FR', {
  //     day: '2-digit',
  //     month: '2-digit',
  //     year: 'numeric',
  //     hour: '2-digit',
  //     minute: '2-digit'
  //   });
  // };

  // Obtenir le statut formaté
  // const getStatusLabel = (status: string) => {
  //   if (!status) return 'Non défini';
  //   return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  // };

  // Obtenir la couleur du statut
  const getStatusColor = (status: string) => {
    if (status === 'NON TRAITER') return 'text-gray-600 bg-gray-100';
    if (status === 'PENDING') return 'text-yellow-600 bg-yellow-100';
    if (status === 'TRAITER') return 'text-green-600 bg-green-100';
    return 'text-blue-600 bg-blue-100';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        
        {/* En-tête */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${marqueStyle.bgColor} mr-3`}>
              <Bus className={`h-6 w-6 ${marqueStyle.color}`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            
            </div>
          </div>
          <button 
            onClick={onHide} 
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Statistiques rapides */}
        {stats.total > 0 && (
          <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50 border-b">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600">{stats.disponible}</p>
              <p className="text-xs text-gray-500">Disponibles</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-600">{stats.indisponible}</p>
              <p className="text-xs text-gray-500">Indisponibles</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Wrench className="h-5 w-5 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-yellow-600">{stats.enMaintenance}</p>
              <p className="text-xs text-gray-500">En Maintenance</p>
            </div>
          </div>
        )}

        {/* Corps avec liste des bus */}
        <div className="overflow-y-auto max-h-[60vh] p-6">
          {busesArray.length === 0 ? (
            <div className="text-center py-12">
              <Bus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucun bus {marque} trouvé</p>
              <p className="text-sm text-gray-400 mt-2">Aucun bus de cette marque n'est actuellement enregistré</p>
            </div>
          ) : (
            <div className="space-y-3">
              {busesArray.map((bus) => {
                const disponibiliteInfo = disponibiliteConfig[bus.disponibilite as keyof typeof disponibiliteConfig] || 
                  { label: 'Inconnu', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: Info };
                const DisponibiliteIcon = disponibiliteInfo.icon;
                const statusColor = getStatusColor(bus.status);

                return (
                  <div 
                    key={bus.id} 
                    className={`flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all border-l-4 ${marqueStyle.borderColor}`}
                  >
                    {/* Informations principales */}
                    <div className="flex flex-col h-full flex-1">
  <div className="flex items-center">
    <h4 className="text-lg font-semibold text-gray-900 ">
      {bus.num_bus || 'N/A'}
    </h4>
  </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">

                          <div className={`px-3 py-1 rounded-full ${statusColor} flex items-center`}>
                       
                      
                      </div>

                       <div>
                          <p className="text-xs text-gray-500 mb-1">Modèle</p>
                          <p className="text-gray-700 font-medium">{bus.modele || 'N/A'}</p>
                        </div>

                         <div>
                          <p className="text-xs text-gray-500 mb-1">ID Carte</p>
                          <p className="text-gray-700 text-xs font-mono truncate">
                            {bus.id_carte ? bus.id_carte.substring(0, 20) + '...' : 'N/A'}
                          </p>
                        </div>
                      
                      
                      </div>
                    </div>

                 {/* Statuts */}
<div className="ml-4 space-y-2 self-end">
  <div className={`px-3 py-1 rounded-full ${disponibiliteInfo.bgColor} flex items-center`}>
    <DisponibiliteIcon className={`h-3 w-3 ${disponibiliteInfo.color} mr-1`} />
    <span className={`text-xs font-medium ${disponibiliteInfo.color}`}>
      {disponibiliteInfo.label}
    </span>
  </div>
</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pied avec résumé */}
        <div className="border-t p-4 bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-500">
         
            {stats.disponible > 0 && (
              <span className="ml-2">
             
              </span>
            )}
            {stats.enMaintenance > 0 && (
              <span className="ml-2">
               
              </span>
            )}
          </div>
          <button 
            onClick={onHide} 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusListModal;