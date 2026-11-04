import React, { useState } from 'react';
import { useBusContext } from '../../../../contexts/busContext';
import { BusBreakdownByLineResponse } from '../../../../types/busType';
interface BusBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  ligneId: number;
}

const API_BASE_URL = `${import.meta.env.VITE_FILE_URL.replace(/\/+$/, '')}/app/public`;

export const BusBreakdownModal: React.FC<BusBreakdownModalProps> = ({
  isOpen,
  onClose,
  ligneId
}) => {
  const { bus, getBusBreakdownsByLineAndDate } = useBusContext();
  const [selectedBusId, setSelectedBusId] = useState<number | ''>('');
  const [dateDebut, setDateDebut] = useState<string>('');
  const [dateFin, setDateFin] = useState<string>('');
  const [breakdownData, setBreakdownData] = useState<BusBreakdownByLineResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFetchBreakdowns = async () => {
    if (!selectedBusId || !dateDebut || !dateFin) {
      alert('Veuillez sélectionner un bus et les dates');
      return;
    }

    try {
      setLoading(true);
      const response = await getBusBreakdownsByLineAndDate(
        selectedBusId,
        ligneId,
        dateDebut,
        dateFin
      );
      setBreakdownData(response);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la récupération des pannes');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Pannes du bus sur la ligne 
          </h2>
          <button
            onClick={onClose}
            className="ti-btn ti-btn-icon ti-btn-danger"
          >
            <i className="ri-close-line"></i>
          </button>
        </div>

        {/* Formulaire de sélection */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium mb-1">Bus</label>
            <select
              className="ti-form-control w-full"
              value={selectedBusId}
              onChange={(e) => setSelectedBusId(Number(e.target.value))}
            >
              <option value="">Sélectionnez un bus</option>
              {bus.map((b) => (
                <option key={b.id} value={b.id}>
                 {b.num_bus}  - {b.modele} - {b.marque}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date début</label>
            <input
              type="date"
              className="ti-form-control w-full"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date fin</label>
            <input
              type="date"
              className="ti-form-control w-full"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleFetchBreakdowns}
              disabled={loading}
              className="ti-btn ti-btn-primary w-full"
            >
              {loading ? 'Chargement...' : 'Rechercher'}
            </button>
          </div>
        </div>

        {/* Informations du bus */}
        {breakdownData?.data?.bus_detail && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Informations du bus</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-sm text-gray-600">Numéro bus:</span>
                <p className="font-medium">{breakdownData.data.bus_detail.num_bus}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Plaque:</span>
                <p className="font-medium">{breakdownData.data.bus_detail.plaque}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Marque:</span>
                <p className="font-medium">{breakdownData.data.bus_detail.marque}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Statut:</span>
                <p className="font-medium">{breakdownData.data.bus_detail.status}</p>
              </div>
            </div>
          </div>
        )}

        {/* Résultats des pannes */}
        {breakdownData?.data?.dossiers_mecaniques && breakdownData.data.dossiers_mecaniques.length > 0 && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium">
                Pannes trouvées: {breakdownData.data.dossiers_mecaniques.length}
              </h3>
              <span className="text-sm text-green-600 font-medium">
                {breakdownData.message}
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date panne
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Ligne
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Commentaire
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Auteur
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Suivi mécanique
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {breakdownData.data.dossiers_mecaniques.map((item) => (
                    <tr key={item.id_log_bus} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-700">
  {item.date_panne
    ? new Date(item.date_panne).toLocaleString()
    : "-"}
</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {item.ligne?.libelle || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {item.commentaire}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex flex-col">
                          <span>{item.auteur_log.prenom} {item.auteur_log.nom}</span>
                      
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {item.suivi_mecanique ? (
                          <div className="flex flex-col">
                            <span className="font-medium">Oui</span>
                           <span className="text-xs text-gray-500">
  {item.suivi_mecanique?.mecanicien
    ? `${item.suivi_mecanique.mecanicien.prenom} ${item.suivi_mecanique.mecanicien.nom}`
    : "-"}
</span>
                            {item.suivi_mecanique.photos?.photo_1 && (
                              <a 
                                href={`${API_BASE_URL}${item.suivi_mecanique.photos.photo_1}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-500 hover:underline"
                              >
                                Voir photo
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">Aucun</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {breakdownData && breakdownData.data.dossiers_mecaniques.length === 0 && !loading && (
          <div className="text-center py-8 border rounded-lg bg-gray-50">
            <i className="ri-information-line text-3xl text-gray-400 mb-2"></i>
            <p className="text-gray-500">Aucune panne trouvée pour les critères sélectionnés</p>
          </div>
        )}
      </div>
    </div>
  );
};