// components/cargo/BonSortieModal.tsx
import React, { useState } from 'react'
import { X, ArrowDownCircle, Save } from 'lucide-react'
import { LocationCargo, BonSortie } from '../../../../types/cargoType'

interface BonSortieModalProps {
  isOpen: boolean
  onClose: () => void
  location: LocationCargo | null
  onSuccess: () => void
}

const BonSortieModal: React.FC<BonSortieModalProps> = ({ isOpen, onClose, location, onSuccess }) => {
  const [formData, setFormData] = useState({
    numeroBon: `BS-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
    motif: '',
    montant: '',
    beneficiaire: '',
    dateCreation: new Date().toISOString().split('T')[0],
    signatureCaisse: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const bonSortie: BonSortie = {
      id: Date.now(),
      ...formData,
      montant: Number(formData.montant),
      idDemande: location?.id,
      client: location?.client || 'Client non spécifié'
    }
    
    const bonsExistants = localStorage.getItem('bonsSortie')
    const bons = bonsExistants ? JSON.parse(bonsExistants) : []
    bons.push(bonSortie)
    localStorage.setItem('bonsSortie', JSON.stringify(bons))
    
    window.dispatchEvent(new Event('bonsUpdated'))
    
    setTimeout(() => {
      setIsSubmitting(false)
      onSuccess()
      onClose()
    }, 1000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 flex justify-between items-center p-6 border-b bg-gradient-to-r from-red-50 to-white">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <ArrowDownCircle className="h-5 w-5 text-red-600" />
              Bon de sortie
            </h2>
            <p className="text-sm text-gray-500 mt-1">Demande #{location?.reference} - {location?.client}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Numéro bon de sortie *</label>
            <input type="text" value={formData.numeroBon} disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Motif *</label>
            <input type="text" value={formData.motif} onChange={(e) => setFormData(prev => ({ ...prev, motif: e.target.value }))} required
              placeholder="Ex: Carburant, Réparation, etc."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Montant *</label>
              <input type="number" value={formData.montant} onChange={(e) => setFormData(prev => ({ ...prev, montant: e.target.value }))} required
                placeholder="Ex: 50000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bénéficiaire *</label>
              <input type="text" value={formData.beneficiaire} onChange={(e) => setFormData(prev => ({ ...prev, beneficiaire: e.target.value }))} required
                placeholder="Nom du bénéficiaire"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de création *</label>
              <input type="date" value={formData.dateCreation} onChange={(e) => setFormData(prev => ({ ...prev, dateCreation: e.target.value }))} required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Signature caisse *</label>
              <input type="text" value={formData.signatureCaisse} onChange={(e) => setFormData(prev => ({ ...prev, signatureCaisse: e.target.value }))} required
                placeholder="Nom du caissier"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Annuler
            </button>
            <button type="submit" disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
              {isSubmitting ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div> : <Save className="h-4 w-4" />}
              Valider le bon
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BonSortieModal