import React, { useState } from 'react';
import { useServiceContext } from '../../../../contexts/serviceContext';
import { Service } from '../../../../types/serviceType';

interface BusPanneServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
}

export const BusPanneServiceModal: React.FC<BusPanneServiceModalProps> = ({
  isOpen,
  onClose,
  service
}) => {
  const { fetchBusBreakdownStats, busBreakdowns, breakdownStatsLoading, breakdownStatsError, clearBreakdownStats } = useServiceContext();
  
  const [dateDebut, setDateDebut] = useState<string>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  });
  const [dateFin, setDateFin] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [showStats, setShowStats] = useState(false);

  const handleFetchStats = async () => {
    if (!service?.id) return;
    try {
      await fetchBusBreakdownStats(service.id, dateDebut, dateFin);
      setShowStats(true);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleClose = () => {
    setShowStats(false);
    clearBreakdownStats();
    onClose();
  };

  const totalBreakdowns = busBreakdowns?.reduce((total, item) => total + item.pannes.length, 0) || 0;
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 md:w-3/4 lg:w-2/3 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pb-2">
          <h3 className="text-lg font-semibold">
            Statistiques des pannes - {service?.libelle}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de début
            </label>
            <input
              type="date"
              className="ti-form-control form-control-sm w-full"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              disabled={breakdownStatsLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de fin
            </label>
            <input
              type="date"
              className="ti-form-control form-control-sm w-full"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
              disabled={breakdownStatsLoading}
            />
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <button
            onClick={handleFetchStats}
            disabled={breakdownStatsLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {breakdownStatsLoading ? 'Chargement...' : 'Afficher les statistiques'}
          </button>
        </div>

        {breakdownStatsError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {breakdownStatsError}
          </div>
        )}

        {showStats && busBreakdowns && !breakdownStatsLoading && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-600 font-medium">Total des pannes</div>
                <div className="text-2xl font-bold text-blue-900">{totalBreakdowns}</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="text-sm text-purple-600 font-medium">Nombre de bus affectés</div>
                <div className="text-2xl font-bold text-purple-900">{busBreakdowns.length}</div>
              </div>
             
              
            </div>


            <div>
              <h4 className="font-semibold mb-3">Détails par bus</h4>
              <div className="space-y-4">
                {busBreakdowns.map((busBreakdown) => (
                  <div key={busBreakdown.bus.id} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-3 border-b">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-semibold">{busBreakdown.bus.num_bus}</span>
                          <span className="text-sm text-gray-600 ml-2">({busBreakdown.bus.plaque})</span>
                        </div>
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {busBreakdown.pannes.length} panne(s)
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {busBreakdown.bus.marque} {busBreakdown.bus.modele}
                      </div>
                    </div>
                    <div className="p-3 overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ligne</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Commentaire</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Auteur</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {busBreakdown.pannes.map((panne) => (
                            <tr key={panne.id_log_bus}>
                              <td className="px-3 py-2 text-sm">
                                {new Date(panne.date_panne).toLocaleString()}
                              </td>
                              <td className="px-3 py-2 text-sm">
                                <div className="font-medium">{panne.ligne.libelle}</div>
                                <div className="text-xs text-gray-500">
                                  {panne.ligne.point_de_depart} → {panne.ligne.point_d_arrivee}
                                </div>
                              </td>
                              <td className="px-3 py-2 text-sm">
                                <div>{panne.commentaire}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                 
                                </div>
                              </td>
                              <td className="px-3 py-2 text-sm">
                                {panne.auteur_log.nom} {panne.auteur_log.post_nom}<br />
                                <span className="text-xs text-gray-500">{panne.auteur_log.prenom}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};