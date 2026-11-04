// components/cargo/ChoixPaiementModal.tsx
import React from 'react'
import { ArrowUpCircle, ArrowDownCircle, DollarSign, FileText } from 'lucide-react'
import { LocationCargo } from '../../../../types/cargoType'

interface ChoixPaiementModalProps {
  isOpen: boolean
  onClose: () => void
  location: LocationCargo | null
  onBonEntree: () => void
  onBonSortie: () => void
}

const ChoixPaiementModal: React.FC<ChoixPaiementModalProps> = ({ 
  isOpen, onClose, location, onBonEntree, onBonSortie 
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold text-gray-900">Gestion des paiements</h3>
          <p className="text-sm text-gray-500 mt-1">Demande #{location?.reference} - {location?.client}</p>
        </div>
        <div className="p-6 space-y-3">
          <button
            onClick={() => { onBonEntree(); onClose(); }}
            className="w-full flex items-center justify-between p-4 border border-green-200 rounded-lg hover:bg-green-50 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <ArrowUpCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Bon d'entrée</p>
                <p className="text-xs text-gray-500">Encaissement d'argent</p>
              </div>
            </div>
            <DollarSign className="h-5 w-5 text-green-600" />
          </button>
          <button
            onClick={() => { onBonSortie(); onClose(); }}
            className="w-full flex items-center justify-between p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-full">
                <ArrowDownCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Bon de sortie</p>
                <p className="text-xs text-gray-500">Décaissement d'argent</p>
              </div>
            </div>
            <FileText className="h-5 w-5 text-red-600" />
          </button>
        </div>
        <div className="p-4 border-t flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChoixPaiementModal