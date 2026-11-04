// components/ui/data/modals/PersonnelModal.tsx

import { FC } from 'react';
import { X, User } from 'lucide-react';

interface RoleItem {
  role: string;
  nombre_utilisateurs: number;  // Changé de 'count' à 'nombre_utilisateurs'
}

interface PersonnelModalProps {
  show: boolean;
  onHide: () => void;
  title: string;
  roles: RoleItem[];
  icon: any;
  color: string;
}

// Configuration des couleurs pour les rôles
const roleColors: { [key: string]: { color: string; bgColor: string } } = {
  'chauffeur': { color: 'text-green-600', bgColor: 'bg-green-100' },
  'convoyeur': { color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
  'encadreur': { color: 'text-amber-600', bgColor: 'bg-amber-100' },
  'verificateur': { color: 'text-orange-600', bgColor: 'bg-orange-100' },
  'regulateur': { color: 'text-cyan-600', bgColor: 'bg-cyan-100' },
  'regulateur_lanceur': { color: 'text-lime-600', bgColor: 'bg-lime-100' },
  'regulateur_commit_lanceur': { color: 'text-teal-600', bgColor: 'bg-teal-100' },
  'responsable_technique': { color: 'text-orange-600', bgColor: 'bg-orange-100' },
};

export const PersonnelModal: FC<PersonnelModalProps> = ({ 
  show, 
  onHide, 
  title, 
  roles, 
  icon: Icon, 
  color 
}) => {
  if (!show) return null;

  // Vérifier que roles est un tableau et le trier en utilisant nombre_utilisateurs
  const rolesArray = Array.isArray(roles) ? roles : [];
  const sortedRoles = [...rolesArray].sort((a, b) => 
    (b.nombre_utilisateurs || 0) - (a.nombre_utilisateurs || 0)
  );
  
  // Calculer le total en utilisant nombre_utilisateurs
  const total = sortedRoles.reduce((acc, role) => {
    const count = typeof role.nombre_utilisateurs === 'number' ? role.nombre_utilisateurs : 0;
    return acc + count;
  }, 0);

  // Formater le nom du rôle
  const formatRoleName = (role: string): string => {
    if (!role) return '';
    return role
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* En-tête */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${color.replace('text', 'bg')}/20 mr-3`}>
              <Icon className={`h-6 w-6 ${color}`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500 mt-1">
                Total: {total} personne{total > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button 
            onClick={onHide} 
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Corps */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {sortedRoles.length === 0 ? (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucune donnée disponible</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedRoles.map((item, index) => {
                // Utiliser nombre_utilisateurs au lieu de count
                const roleName = item.role || 'Rôle inconnu';
                const count = typeof item.nombre_utilisateurs === 'number' ? item.nombre_utilisateurs : 0;
                
                const roleStyle = roleColors[item.role] || { 
                  color: 'text-gray-600', 
                  bgColor: 'bg-gray-100' 
                };
                
                // Calculer le pourcentage
                const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : '0';

                return (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center flex-1">
                      <span className="text-sm font-medium text-gray-500 w-8">
                        {index + 1}.
                      </span>
                      <div className={`w-8 h-8 rounded-full ${roleStyle.bgColor} flex items-center justify-center mr-3`}>
                        <User className={`h-4 w-4 ${roleStyle.color}`} />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {formatRoleName(roleName)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-xs text-gray-500 w-16 text-right">
                        {percentage}%
                      </span>
                      <span className="px-3 py-1 text-sm font-semibold rounded-full bg-white border border-gray-200">
                        {count} personne{count > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pied */}
        <div className="border-t p-4 flex justify-end">
          <button 
            onClick={onHide} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};