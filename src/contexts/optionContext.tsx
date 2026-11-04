import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Option, OptionPayload, SubCategory, SubSubCategory } from '../types/optionType';
import { Category } from '../types/categoryType';
import { createOption, getCategories, getSubCategoriesByCategory, getSubSubCategoriesBySubCategory, getOptionsByCategory } from '../components/Api/optionService';

// Interface pour le contexte Option
interface OptionContextType {
  options: Option[];
  filteredOptionsData: any;
  categories: Category[];
  subCategories: SubCategory[];
  subSubCategories: SubSubCategory[];
  loadingOption: boolean;
  loadingCategories: boolean;
  loadingSubCategories: boolean;
  loadingSubSubCategories: boolean;
  loadingFilteredOptions: boolean;
  errorOption: string | null;
  errorCategories: string | null;
  errorSubCategories: string | null;
  errorSubSubCategories: string | null;
  errorFilteredOptions: string | null;
  addOption: (option: OptionPayload) => Promise<Option>;
  fetchOptionsByCategory: (id_categorie: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchSubCategories: (id_categorie: number) => Promise<void>;
  fetchSubSubCategories: (id_sous_categorie: number) => Promise<void>;
  clearErrors: () => void;
  clearSubCategories: () => void;
  clearSubSubCategories: () => void;
}

// Créer le contexte
const OptionContext = createContext<OptionContextType | undefined>(undefined);

// Props pour le provider
interface OptionProviderProps {
  children: ReactNode;
}

// Provider du contexte Option
export const OptionProvider: React.FC<OptionProviderProps> = ({ children }) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [filteredOptionsData, setFilteredOptionsData] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [subSubCategories, setSubSubCategories] = useState<SubSubCategory[]>([]);
  const [loadingOption, setLoadingOption] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);
  const [loadingSubSubCategories, setLoadingSubSubCategories] = useState(false);
  const [loadingFilteredOptions, setLoadingFilteredOptions] = useState(false);
  const [errorOption, setErrorOption] = useState<string | null>(null);
  const [errorCategories, setErrorCategories] = useState<string | null>(null);
  const [errorSubCategories, setErrorSubCategories] = useState<string | null>(null);
  const [errorSubSubCategories, setErrorSubSubCategories] = useState<string | null>(null);
  const [errorFilteredOptions, setErrorFilteredOptions] = useState<string | null>(null);



  // Fonction pour récupérer les options par catégorie avec structure hiérarchique
  const fetchOptionsByCategory = async (id_categorie: number): Promise<void> => {
    setLoadingFilteredOptions(true);
    setErrorFilteredOptions(null);
    try {
      const data = await getOptionsByCategory(id_categorie);
      setFilteredOptionsData(data);
    } catch (error: any) {
      setErrorFilteredOptions(error.message || 'Erreur lors de la récupération des options par catégorie');
      setFilteredOptionsData(null);
    } finally {
      setLoadingFilteredOptions(false);
    }
  };

  // Fonction pour récupérer la liste des catégories
  const fetchCategories = async (): Promise<void> => {
    setLoadingCategories(true);
    setErrorCategories(null);
    try {
      const categoryData = await getCategories();
      setCategories(categoryData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la récupération des catégories';
      setErrorCategories(errorMessage);
      console.error('Erreur lors de la récupération des catégories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Fonction pour récupérer les sous-catégories par ID de catégorie
  const fetchSubCategories = async (id_categorie: number): Promise<void> => {
    setLoadingSubCategories(true);
    setErrorSubCategories(null);
    try {
      const data = await getSubCategoriesByCategory(id_categorie);
      setSubCategories(data);
    } catch (error: any) {
      setErrorSubCategories(error.message || 'Erreur lors de la récupération des sous-catégories');
      setSubCategories([]);
    } finally {
      setLoadingSubCategories(false);
    }
  };

  // Fonction pour récupérer les sous-sous-catégories par ID de sous-catégorie
  const fetchSubSubCategories = async (id_sous_categorie: number): Promise<void> => {
    setLoadingSubSubCategories(true);
    setErrorSubSubCategories(null);
    try {
      const data = await getSubSubCategoriesBySubCategory(id_sous_categorie);
      setSubSubCategories(data);
    } catch (error: any) {
      setErrorSubSubCategories(error.message || 'Erreur lors de la récupération des sous-sous-catégories');
      setSubSubCategories([]);
    } finally {
      setLoadingSubSubCategories(false);
    }
  };

  // Fonction pour ajouter une nouvelle option
  const addOption = async (optionData: OptionPayload): Promise<Option> => {
    setLoadingOption(true);
    setErrorOption(null);
    try {
      const newOption = await createOption(optionData);
      setOptions(prevOptions => [...prevOptions, newOption]);
      return newOption;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création de l\'option';
      setErrorOption(errorMessage);
      console.error('Erreur lors de la création de l\'option:', error);
      throw error; 
    } finally {
      setLoadingOption(false);
    }
  };

  // Fonction pour effacer les erreurs
  const clearErrors = () => {
    setErrorOption(null);
    setErrorCategories(null);
    setErrorSubCategories(null);
    setErrorSubSubCategories(null);
    setErrorFilteredOptions(null);
  };

  // Fonction pour vider les sous-catégories
  const clearSubCategories = () => {
    setSubCategories([]);
    setErrorSubCategories(null);
  };

  // Fonction pour vider les sous-sous-catégories
  const clearSubSubCategories = () => {
    setSubSubCategories([]);
    setErrorSubSubCategories(null);
  };

  // Valeur du contexte
  const contextValue: OptionContextType = {
    options,
    filteredOptionsData,
    categories,
    subCategories,
    subSubCategories,
    loadingOption,
    loadingCategories,
    loadingSubCategories,
    loadingSubSubCategories,
    loadingFilteredOptions,
    errorOption,
    errorCategories,
    errorSubCategories,
    errorSubSubCategories,
    errorFilteredOptions,
    addOption,
    fetchOptionsByCategory,
    fetchCategories,
    fetchSubCategories,
    fetchSubSubCategories,
    clearErrors,
    clearSubCategories,
    clearSubSubCategories
  };

  return (
    <OptionContext.Provider value={contextValue}>
      {children}
    </OptionContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte Option
export const useOptionContext = (): OptionContextType => {
  const context = useContext(OptionContext);
  
  if (context === undefined) {
    throw new Error('useOptionContext must be used within an OptionProvider');
  }
  
  return context;
};