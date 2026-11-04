// components/cargo/BonEntreeModal.tsx
import React, { useState } from 'react'
import { X, ArrowUpCircle, Save, Users } from 'lucide-react'
import { LocationCargo, BonEntree } from '../../../../types/cargoType'

interface BonEntreeModalProps {
  isOpen: boolean
  onClose: () => void
  location: LocationCargo | null
  onSuccess: () => void
}

const nombreEnLettres = (nombre: number): string => {
  const unite = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf']
  const dizaine = ['', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix']
  
  if (nombre < 10) return unite[nombre]
  if (nombre < 20) return 'dix-' + unite[nombre - 10]
  if (nombre < 100) {
    let d = Math.floor(nombre / 10)
    let u = nombre % 10
    return dizaine[d] + (u ? '-' + unite[u] : '')
  }
  if (nombre < 1000) {
    let c = Math.floor(nombre / 100)
    let r = nombre % 100
    return unite[c] + ' cent' + (r ? ' ' + nombreEnLettres(r) : '')
  }
  return nombre.toString()
}

const BonEntreeModal: React.FC<BonEntreeModalProps> = ({ isOpen, onClose, location, onSuccess }) => {
  const [formData, setFormData] = useState({
    numeroBon: `BE-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
    devise: 'CDF',
    sommeChiffres: '',
    sommeLettres: '',
    conducteur: '',
    controleur: '',
    convoyeur: '',
    dateCreation: new Date().toISOString().split('T')[0],
    signatureCaisse: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSommeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const nombre = parseInt(value) || 0
    setFormData(prev => ({
      ...prev,
      sommeChiffres: value,
      sommeLettres: nombre ? nombreEnLettres(nombre) + ' francs congolais' : ''
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const bonEntree: BonEntree = {
      id: Date.now(),
      ...formData,
      sommeChiffres: Number(formData.sommeChiffres),
      idDemande: location?.id,
      client: location?.client || 'Client non spécifié',
      trajet: `${location?.villeDepart} → ${location?.villeDestination}`,
      dateLocation: location?.dateLocation,
      formule: location?.typeCargo,
      montantTotal: Number(formData.sommeChiffres)
    }
    
    const bonsExistants = localStorage.getItem('bonsEntree')
    const bons = bonsExistants ? JSON.parse(bonsExistants) : []
    bons.push(bonEntree)
    localStorage.setItem('bonsEntree', JSON.stringify(bons))
    
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
        <div className="sticky top-0 flex justify-between items-center p-6 border-b bg-gradient-to-r from-green-50 to-white">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <ArrowUpCircle className="h-5 w-5 text-green-600" />
              Bon d'entrée
            </h2>
            <p className="text-sm text-gray-500 mt-1">Demande #{location?.reference} - {location?.client}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Numéro bon d'entrée *</label>
            <input type="text" value={formData.numeroBon} disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Devise *</label>
              <select value={formData.devise} onChange={(e) => setFormData(prev => ({ ...prev, devise: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option value="CDF">Franc Congolais (CDF)</option>
                <option value="USD">Dollar Américain (USD)</option>
                <option value="EUR">Euro (EUR)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Somme en chiffres *</label>
              <input type="number" value={formData.sommeChiffres} onChange={handleSommeChange} required
                placeholder="Ex: 150000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Somme en lettres *</label>
            <textarea value={formData.sommeLettres} readOnly rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50" />
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Imputation
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Conducteur *</label>
                <input type="text" value={formData.conducteur} onChange={(e) => setFormData(prev => ({ ...prev, conducteur: e.target.value }))} required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contrôleur *</label>
                <input type="text" value={formData.controleur} onChange={(e) => setFormData(prev => ({ ...prev, controleur: e.target.value }))} required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Convoyeur *</label>
                <input type="text" value={formData.convoyeur} onChange={(e) => setFormData(prev => ({ ...prev, convoyeur: e.target.value }))} required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
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
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
              {isSubmitting ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div> : <Save className="h-4 w-4" />}
              Valider le bon
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BonEntreeModal