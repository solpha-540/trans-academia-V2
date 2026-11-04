import { useMemo } from 'react';
import { getUserRole } from '../utils/auth';

// Generic access configuration interface
interface AccessConfig {
  [resourceKey: string]: string[];
}

interface UseRoleAccessReturn {
  hasAccess: (resourceKey: string, accessConfig?: AccessConfig) => boolean;
  userRole: string | null;
  isAgentUser: boolean;
  checkMultipleAccess: (resources: string[], accessConfig?: AccessConfig) => { [key: string]: boolean };
  filterMenuItems: (menuItems: any[], accessConfig?: AccessConfig) => any[];
}

const useRoleAccess = (defaultAccessConfig?: AccessConfig): UseRoleAccessReturn => {
  // Get user role and determine if this is an agent user
  const { userRole, isAgentUser } = useMemo(() => {
    try {
      const role = getUserRole();
      console.log('🔍 Debug - User role from localStorage:', role);
      console.log('🔍 Debug - Role type:', typeof role);
      console.log('🔍 Debug - Role exists:', !!role);
      
      // Check if this is an agent user (has role stored in localStorage)
      const isAgent = !!role;
      
      return {
        userRole: role,
        isAgentUser: isAgent
      };
    } catch (error) {
      console.error('Error getting user role:', error);
      return {
        userRole: null,
        isAgentUser: false
      };
    }
  }, []);

  // Function to check if user has access to a specific resource
  const hasAccess = useMemo(() => {
    return (resourceKey: string, accessConfig?: AccessConfig): boolean => {
      const config = accessConfig || defaultAccessConfig;
      
      // If not an agent user, all resources are accessible (admin users)
      if (!isAgentUser) {
        return true;
      }

      // If no role or no access rules defined, deny access
      if (!userRole || !config || !config[resourceKey]) {
        return false;
      }

      // Helper to normaliser (remove accents, lowercase, trim)
      const normalize = (str: string) => str.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();

      const normalizedUserRole = normalize(userRole);

      return config[resourceKey].some(r => normalize(r) === normalizedUserRole);
    };
  }, [userRole, isAgentUser, defaultAccessConfig]);

  // Function to check access for multiple resources at once
  const checkMultipleAccess = useMemo(() => {
    return (resources: string[], accessConfig?: AccessConfig): { [key: string]: boolean } => {
      const config = accessConfig || defaultAccessConfig;
      const results: { [key: string]: boolean } = {};
      
      resources.forEach(resource => {
        results[resource] = hasAccess(resource, config);
      });
      
      return results;
    };
  }, [hasAccess, defaultAccessConfig]);

  // Function to filter menu items based on user access
  const filterMenuItems = useMemo(() => {
    return (menuItems: any[], accessConfig?: AccessConfig): any[] => {
      const config = accessConfig || defaultAccessConfig;
      console.log('🔍 Debug - FilterMenuItems called with:', {
        menuItemsCount: menuItems?.length,
        userRole,
        isAgentUser,
        configKeys: config ? Object.keys(config) : 'no config'
      });
      
      const filterItems = (items: any[], depth = 0): any[] => {
        const indent = '  '.repeat(depth);
        console.log(`${indent}🔍 Filtering ${items.length} items at depth ${depth}`);
        
        return items.map(item => {
          // Debug: Afficher les détails de l'élément actuel
          console.log(`${indent}🔍 Processing item:`, {
            title: item.title,
            type: item.type,
            path: item.path,
            hasChildren: !!(item.children && item.children.length > 0)
          });
          
          // Check if user has access to this menu item
          const hasItemAccess = hasAccess(item.title, config);
          console.log(`${indent}🔍 Menu item "${item.title}" (type: ${item.type}) access:`, hasItemAccess, 'Config:', config?.[item.title]);
          
          if (!hasItemAccess) {
            console.log(`${indent}❌ Access denied for "${item.title}" - User role: ${userRole}, Required roles: ${config?.[item.title]?.join(', ') || 'none'}`);
            return null; // Return null for items without access
          }
          
          // If item has children, filter them recursively
          if (item.children && item.children.length > 0) {
            console.log(`${indent}👶 Processing ${item.children.length} children for "${item.title}"`);
            const filteredChildren = filterItems(item.children, depth + 1).filter(child => child !== null);
            console.log(`${indent}✅ Filtered children for "${item.title}": ${filteredChildren.length}/${item.children.length}`);
            
            // If no children are accessible, hide the parent (unless it's a direct link)
            if (filteredChildren.length === 0 && item.type === 'sub') {
              console.log(`${indent}🚫 Hiding parent "${item.title}" - no accessible children`);
              return null;
            }
            
            // Return item with filtered children
            const result = {
              ...item,
              children: filteredChildren
            };
            console.log(`${indent}✨ Returning "${item.title}" with ${filteredChildren.length} children`);
            return result;
          }
          
          // Return the item if it has access and no children
          console.log(`${indent}✅ Returning leaf item "${item.title}"`);
          return item;
        }).filter(item => item !== null); // Remove null items
      };
      
      return filterItems(menuItems);
    };
  }, [hasAccess, defaultAccessConfig]);

  return {
    hasAccess,
    userRole,
    isAgentUser,
    checkMultipleAccess,
    filterMenuItems
  };
};

export default useRoleAccess;
