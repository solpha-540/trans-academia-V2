import { useMemo } from 'react';
import { getUserInfo } from '../utils/auth';

interface CardAccessConfig {
  [cardNumber: number]: string[];
}

interface UseCardAccessReturn {
  isCardEnabled: (cardNumber: number) => boolean;
  userRole: string | null;
  isAgentUser: boolean;
}

const useCardAccess = (): UseCardAccessReturn => {
  // Get user role and determine if this is an agent user
  const { userRole, isAgentUser } = useMemo(() => {
    try {
      const userInfo = getUserInfo();
      const role = localStorage.getItem('role') || userInfo?.role_libelle || null;
      
      // Check if this is an agent user (has role stored in localStorage)
      const isAgent = !!localStorage.getItem('role');
      
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

  // Define role-based access rules for cards
  const cardAccessConfig: CardAccessConfig = useMemo(() => ({
    1: ['Chef personnel'], // Card 1 only for "chef personnel"
    2: ['Agent','super user'], // Card 2 for multiple roles
    3: ['Agent'], // Card 3 for multiple roles
    4: ['Agent'], // Card 4 for multiple roles
    5: ['Agent'], // Card 5 for multiple roles
  }), []);

  // Function to check if a card should be enabled
  const isCardEnabled = useMemo(() => {
    return (cardNumber: number): boolean => {
      // If not an agent user, all cards are enabled (admin users)
      if (!isAgentUser) {
        return true;
      }

      // If no role or no access rules defined, disable the card
      if (!userRole || !cardAccessConfig[cardNumber]) {
        return false;
      }

      // Check if user's role is in the allowed roles for this card
      return cardAccessConfig[cardNumber].includes(userRole);
    };
  }, [userRole, isAgentUser, cardAccessConfig]);

  return {
    isCardEnabled,
    userRole,
    isAgentUser
  };
};

export default useCardAccess;
