import React, { useState, useEffect } from 'react';
import { getSubCategoriesByCategory, getSubSubCategoriesBySubCategory } from '../../components/Api/optionService';
import PaginationTable from '../common/PaginationTable';

interface CategoryListProps {
  categoryId?: number;
  subCategoryId?: number;
  type: 'subcategories' | 'subsubcategories';
}

interface Item {
  id: number;
  libelle: string;
  // Ajoutez d'autres propriétés selon votre structure de données
}



const CategoryList: React.FC<CategoryListProps> = ({ categoryId, subCategoryId, type }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Fonction pour charger les données
  const fetchData = async () => {
    try {
      setLoading(true);
      let data;
      
      if (type === 'subcategories' && categoryId) {
        data = await getSubCategoriesByCategory(categoryId);
      } else if (type === 'subsubcategories' && subCategoryId) {
        data = await getSubSubCategoriesBySubCategory(subCategoryId);
      } else {
        throw new Error('Paramètres invalides pour le chargement des données');
      }
      
      setItems(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error(`Erreur lors du chargement des ${type}:`, err);
      setError(`Erreur lors du chargement des ${type}. Veuillez réessayer.`);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Charger les données au montage et quand les dépendances changent
  useEffect(() => {
    if ((type === 'subcategories' && categoryId) || (type === 'subsubcategories' && subCategoryId)) {
      fetchData();
    }
  }, [categoryId, subCategoryId, type]);

  // Calculer les éléments à afficher sur la page courante
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Gérer le changement de page
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Gérer le changement du nombre d'éléments par page
  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Revenir à la première page lors du changement de taille de page
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {type === 'subcategories' ? 'Sous-catégories' : 'Sous-sous-catégories'}
        </h3>
      </div>
      
      <div className="border-t border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Libellé
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.libelle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-primary-600 hover:text-primary-900 mr-4">
                        Modifier
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                    Aucune donnée disponible
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {items.length > 0 && (
          <PaginationTable
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={items.length}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}
      </div>
    </div>
  );
};

export default CategoryList;
