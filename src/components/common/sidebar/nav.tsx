// Navigation de base, sans les modules metier supprimes.
interface MenuItem {
  path: string;
  title: string;
  type: string;
  active: boolean;
  selected: boolean;
  children?: MenuItem[];
}

const BaseMenuItems: MenuItem[] = [{
  path: import.meta.env.BASE_URL,
  title: 'Accueil',
  type: 'link',
  active: false,
  selected: false,
}];

export const useFilteredMenuItems = () => BaseMenuItems;
export const getFilteredMenuItems = () => BaseMenuItems;
export const MenuItems = BaseMenuItems;
